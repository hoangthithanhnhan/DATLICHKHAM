using Application.Core;
using DATLICHKHAM.Application.TepKemTheo;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace DATLICHKHAM.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        private bool _IsValid;
        private IMediator _mediator;
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();
        private readonly IWebHostEnvironment _hostingEnvironment;
        public BaseApiController(IWebHostEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        protected ActionResult HandleResult<T>(Result<T> result)
        {
            if (result == null)
                return NotFound();
            if (result.IsSuccess && result.Value != null)
            {
                return Ok(result.Value);
            }
            if (result.IsSuccess && result.Value == null)
                return NotFound();

            return BadRequest(result.Error);
        }
        protected async Task<string> SaveFileUploadSingleMain(IFormFile file, string targetDirectory, string pathdb)
        {
            if (file == null) return null;
            string noiluutru = "";
            string pre = new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds().ToString();

            string fileName = file.FileName;
            int idx = fileName.LastIndexOf('.');
            string newFileName = $"{fileName.Substring(0, idx)}_{pre}{fileName.Substring(idx)}";
            var filePath = Path.Combine(targetDirectory, newFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);

                noiluutru = $"{pathdb}/{newFileName}";
            }

            return noiluutru;
        }

        protected async Task<List<DLK_TepDinhKemAddModel>> SaveFileUpload(List<IFormFile> files, Guid idObj, string targetDirectory, string pathdb)
        {
            var uploadedFiles = new List<DLK_TepDinhKemAddModel>();

            foreach (var file in files)
            {
                if (file.Length <= 0) continue;

                string pre = new DateTimeOffset(DateTime.UtcNow).ToUnixTimeSeconds().ToString() + DateTimeOffset.UtcNow.Millisecond;
                string fileName = file.FileName;
                int idx = fileName.LastIndexOf('.');
                string newFileName = $"{fileName.Substring(0, idx)}_{pre}{fileName.Substring(idx)}";
                var filePath = Path.Combine(targetDirectory, newFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);

                    DLK_TepDinhKemAddModel e = new DLK_TepDinhKemAddModel
                    {
                        MaDoiTuong = idObj,
                        TenFile = fileName,
                        DuongDan = $"{pathdb}/{newFileName}"
                    };

                    uploadedFiles.Add(e);
                }
            }

            return uploadedFiles;
        }

        protected async Task<int> DeletePhysicalFile(Guid MaDoiTuong)
        {
            var result = await Mediator.Send(new GetTepKemTheoByMaDoiTuong.Query { MaDoiTuong = MaDoiTuong });
            var resultObj = result.Value.ToList();
            var vanbanPath = "wwwroot";
            if (resultObj.Count > 0 && resultObj != null)
            {
                foreach (var item in resultObj)
                {
                    await Mediator.Send(new Delete.Command { MaTepDinhKem = item.MaTepDinhKem });
                    string fullPath = item.DuongDan;
                    string fullPathNormalized = fullPath.Replace("/", "\\").TrimStart('\\');
                    if (fullPath != null)
                    {
                        string oldFilePath = Path.Combine(vanbanPath, fullPathNormalized);
                        if (System.IO.File.Exists(oldFilePath))
                        {
                            // Nếu tồn tại, xóa file cũ
                            System.IO.File.Delete(oldFilePath);
                        }
                    }
                }
                return 0;
            }
            return 1;
        }
    }
}
