using Application.Core;
using DATLICHKHAM.Application.ChungChiChuyenGia;
using DATLICHKHAM.Application.TepKemTheo;
using DATLICHKHAM.Controllers;
using DATLICHKHAM.Domain;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Diagnostics.Contracts;
using static Dapper.SqlMapper;

namespace DATLICHKHAM.APIsController
{
    public class ChungChiChuyenGiaApiController : BaseApiController
    {
        public ChungChiChuyenGiaApiController(IWebHostEnvironment hostingEnvironment) : base(hostingEnvironment)
        {
        }
        [HttpGet]
        [Route("Get")]
        public async Task<Result<DLK_ChungChiChuyenGia>> Get(Guid MaChungChi)
        {
            return await Mediator.Send(new Get.Query { MaChungChi = MaChungChi });
        }

        [HttpGet]
        [Route("Gets")]
        public async Task<Result<IEnumerable<DLK_ChungChiChuyenGia_TepKemTheo>>> Gets(int? MaChuyenGia)
        {
            return await Mediator.Send(new Gets.Query { MaChuyenGia = MaChuyenGia});
        }

        [HttpPost]
        [Route("Add")]
        public async Task<Result<DLK_ChungChiChuyenGia>> Add([FromForm] RequestUploadMultiFile _request)
        {
            const string Path = "wwwroot\\upload\\ChungChi"; // Thư mục lưu trữ file
            const string PathDB = "\\upload\\ChungChi"; // Đường dẫn lưu trong DB
            DLK_ChungChiChuyenGiaAdd Entity = JsonConvert.DeserializeObject<DLK_ChungChiChuyenGiaAdd>(_request.data);
            var result = await Mediator.Send(new Add.Command { Entity = Entity });
            if(result.IsSuccess)
            {
                var modalAdd = await SaveFileUpload(_request.files, result.Value.MaChungChi, Path, PathDB);
                if (modalAdd != null && modalAdd.Count() > 0)
                {
                    foreach (var itemFile in modalAdd)
                    {
                        await Mediator.Send(new AddTepKemTheo.Command { Entity = itemFile });
                    }
                }
            }

            return result;
        }

        [HttpPut]
        [Route("Update")]
        public async Task<Result<DLK_ChungChiChuyenGia>> Update([FromForm] RequestUploadMultiFile _request)
        {
            DLK_ChungChiChuyenGia Entity = JsonConvert.DeserializeObject<DLK_ChungChiChuyenGia>(_request.data);
            var result = await Mediator.Send(new Update.Command { Entity = Entity });

            const string vanbanPath = "wwwroot\\upload\\ChungChi";
            const string pathdb = "\\upload\\ChungChi";
            if (result.IsSuccess)
            {
                if (_request.files != null)
                {
                    var uploadedFiles = await SaveFileUpload(_request.files, result.Value.MaChungChi, vanbanPath, pathdb);
                
                    if (uploadedFiles != null)
                    {
                        foreach(var item in uploadedFiles)
                        {
                            await Mediator.Send(new AddTepKemTheo.Command { Entity = item });
                        } 
                    }
                }
            }

            return result;
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<Result<int>> Delete(Guid MaChungChi)
        {
            var resultDelete = await DeletePhysicalFile(MaChungChi);
            if (resultDelete == 0)
            {
                return await Mediator.Send(new Application.ChungChiChuyenGia.Delete.Command { MaChungChi = MaChungChi });
            }
            return await Mediator.Send(new Application.ChungChiChuyenGia.Delete.Command { MaChungChi = MaChungChi });
        }

        [HttpDelete]
        [Route("DeleteAnhChungChi")]
        public async Task<Result<int>> DeleteAnhChungChi(int MaTepDinhKem)
        {
            var tepDinhKemOld = await Mediator.Send(new GetTepKemTheoByMaTepKemTheo.Query { MaTepDinhKem = MaTepDinhKem});
            var relativePath = tepDinhKemOld.Value.DuongDan.Replace("/", Path.DirectorySeparatorChar.ToString()).TrimStart('\\');
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", relativePath);
            if (tepDinhKemOld.IsSuccess && !string.IsNullOrEmpty(tepDinhKemOld.Value.DuongDan))
            {
                try
                {
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }
                catch (Exception ex)
                {
                    return Result<int>.Failure(ex.Message);
                }
            }
            return await Mediator.Send(new DATLICHKHAM.Application.TepKemTheo.Delete.Command { MaTepDinhKem = MaTepDinhKem});
        }

    }
}
