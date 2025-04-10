using Application.Core;
using DATLICHKHAM.Application.ChungChiChuyenGia;
using DATLICHKHAM.Controllers;
using DATLICHKHAM.Domain;
using Microsoft.AspNetCore.Mvc;
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
        public async Task<Result<DLK_ChungChiChuyenGia>> Add(DLK_ChungChiChuyenGiaAdd Entity)
        {
            return await Mediator.Send(new Add.Command { Entity=Entity});
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
