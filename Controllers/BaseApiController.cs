using Application.Core;
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
    }
}
