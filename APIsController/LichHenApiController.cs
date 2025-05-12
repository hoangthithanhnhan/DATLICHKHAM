using Application.Core;
using DATLICHKHAM.Application.LichHen;
using DATLICHKHAM.Controllers;
using DATLICHKHAM.Domain;
using Microsoft.AspNetCore.Mvc;

namespace DATLICHKHAM.APIsController
{
    public class LichHenApiController : BaseApiController
    {
        public LichHenApiController(IWebHostEnvironment hostingEnvironment) : base(hostingEnvironment)
        {
        }

        [HttpGet]
        [Route("Gets")]
        public async Task<Result<IEnumerable<DLK_LichHen>>> Gets(string? keyword=null)
        {
            return await Mediator.Send(new Gets.Query { keyword = keyword });
        }

        [HttpGet]
        [Route("Get")]
        public async Task<Result<DLK_LichHen>> Get(int MaLichHen)
        {
            return await Mediator.Send(new Get.Query { MaLichHen = MaLichHen });
        }

        [HttpGet]
        [Route("GetLichHenByChuyenGiaByNgay")]
        public async Task<Result<IEnumerable<DLK_LichHen>>> GetLichHenByChuyenGiaByNgay(int MaChuyenGia, DateTime NgayHen)
        {
            return await Mediator.Send(new GetLichHenByChuyenGiaByNgay.Query { MaChuyenGia = MaChuyenGia, NgayHen = NgayHen });
        }

        [HttpGet]
        [Route("GetLichHenByBenhNhan")]
        public async Task<Result<IEnumerable<DLK_LichHen>>> GetLichHenByBenhNhan(int MaBenhNhan)
        {
            return await Mediator.Send(new GetLichHenByBenhNhan.Query { MaBenhNhan = MaBenhNhan });
        }

        [HttpPost]
        [Route("Add")]
        public async Task<Result<DLK_LichHen>> Add(DLK_LichHenAdd Entity)
        {
            return await Mediator.Send(new Add.Command { Entity = Entity });
        }

        [HttpPut]
        [Route("Update")]
        public async Task<Result<DLK_LichHenUpdate>> Update(DLK_LichHenUpdate Entity)
        {
            return await Mediator.Send(new Update.Command { Entity = Entity });
        }

        [HttpPut]
        [Route("UpdateTrangThai")]
        public async Task<Result<int>> UpdateTrangThai(int MaLichHen)
        {
            return await Mediator.Send(new UpdateTrangThai.Command {MaLichHen=MaLichHen});
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<Result<int>> Delete(int MaLichHen)
        {
            return await Mediator.Send(new Delete.Commnad { MaLichHen = MaLichHen });
        }

        [HttpPut]
        [Route("HuyLichHen")]
        public async Task<Result<DLK_LichHenUpdate>> HuyLichHen(DLK_LichHenUpdate Entity)
        {
            return await Mediator.Send(new HuyLichHen.Command { Entity = Entity});
        }
    }
}
