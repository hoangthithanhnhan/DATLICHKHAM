using Application.Core;
using DATLICHKHAM.Application.DanhGia;
using DATLICHKHAM.Controllers;
using DATLICHKHAM.Domain;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace DATLICHKHAM.APIsController
{
    public class DanhGiaApiController : BaseApiController
    {
        public DanhGiaApiController(IWebHostEnvironment hostingEnvironment) : base(hostingEnvironment)
        {
        }

        [HttpPost]
        [Route("Gets")]
        public async Task<Result<IEnumerable<DLK_DanhGia>>> Gets(DLK_DanhGiaRequestFilter filter)
        {
            return await Mediator.Send(new Gets.Query { Filter = filter });
        }

        [HttpPost]
        [Route("Add")]
        public async Task<Result<DLK_DanhGia>> Add(DLK_DanhGiaAdd Entity)
        {
            return await Mediator.Send(new Add.Command { Entity = Entity });
        }

        [HttpGet]
        [Route("GetDanhGiaByLichHen")]
        public async Task<Result<DLK_DanhGia>> GetDanhGiaByLichHen(int MaLichHen)
        {
            return await Mediator.Send(new GetDanhGiaByLichHen.Query { MaLichHen = MaLichHen });
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<Result<int>> Delete(int MaDanhGia)
        {
            return await Mediator.Send(new Delete.Command { MaDanhGia = MaDanhGia });
        }
    }
}
