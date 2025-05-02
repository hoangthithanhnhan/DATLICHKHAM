using Application.Core;
using DATLICHKHAM.Application.LichLamViecChuyenGia;
using DATLICHKHAM.Controllers;
using DATLICHKHAM.Domain;
using Microsoft.AspNetCore.Mvc;

namespace DATLICHKHAM.APIsController
{
    public class LichLamViecChuyenGiaApiController : BaseApiController
    {
        public LichLamViecChuyenGiaApiController(IWebHostEnvironment hostingEnvironment) : base(hostingEnvironment)
        {
        }

        [HttpGet]
        [Route("Gets")]
        public async Task<Result<IEnumerable<DLK_LichLamViecChuyenGia>>> Gets()
        {
            return await Mediator.Send(new Gets.Query());
        }

        [HttpGet]
        [Route("GetsLichLamViecChuyenGiaByNgay")]
        public async Task<Result<IEnumerable<DLK_LichLamViecChuyenGia>>> GetsByNgay(DateTime? Ngay,int? MaChuyenGia,bool? TrangThai,int? MaLichLamViec)
        {
            return await Mediator.Send(new GetsLichLamViecChuyenGiaByNgay.Query { Ngay = Ngay , MaChuyenGia=MaChuyenGia, TrangThai = TrangThai, MaLichLamViec = MaLichLamViec});
        }

        [HttpGet]
        [Route("Get")]
        public async Task<Result<DLK_LichLamViecChuyenGia>> Get(int MaLichLamViec)
        {
            return await Mediator.Send(new Get.Query { MaLichLamViec = MaLichLamViec });
        }

        [HttpPost]
        [Route("Add")]
        public async Task<Result<DLK_LichLamViecChuyenGia>> Add(DLK_LichLamViecChuyenGiaAdd Entity)
        {
            return await Mediator.Send(new Add.Command { Entity = Entity });
        }

        [HttpPut]
        [Route("Update")]
        public async Task<Result<DLK_LichLamViecChuyenGia>> Update(DLK_LichLamViecChuyenGia Entity)
        {
            return await Mediator.Send(new Update.Command { Entity = Entity });
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<Result<int>> Delete(int MaLichLamViec)
        {
            return await Mediator.Send(new Delete.Command { MaLichLamViec = MaLichLamViec });
        }
    }
}
