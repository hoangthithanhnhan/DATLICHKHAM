using Application.Core;
using DATLICHKHAM.Application.ChungChiChuyenGia;
using DATLICHKHAM.Application.TepKemTheo;
using DATLICHKHAM.Controllers;
using DATLICHKHAM.Domain;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Diagnostics.Contracts;

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
        public async Task<Result<IEnumerable<DLK_ChungChiChuyenGia>>> Gets()
        {
            return await Mediator.Send(new Gets.Query { });
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
        public async Task<Result<DLK_ChungChiChuyenGia>> Update(DLK_ChungChiChuyenGia Entity)
        {
            return await Mediator.Send(new Update.Command { Entity = Entity });
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<Result<int>> Delete(Guid MaChungChi)
        {
            return await Mediator.Send(new Delete.Command { MaChungChi = MaChungChi });
        }
    }
}
