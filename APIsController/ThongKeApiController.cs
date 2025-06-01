using Application.Core;
using DATLICHKHAM.Application.ThongKe;
using DATLICHKHAM.Controllers;
using DATLICHKHAM.Domain;
using DATLICHKHAM.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DATLICHKHAM.APIsController
{
    public class ThongKeApiController : BaseApiController
    {
        public ThongKeApiController(IWebHostEnvironment hostingEnvironment) : base(hostingEnvironment)
        {
        }

        [HttpGet]
        [Route("ThongKeTongQuat")]
        public async Task<Result<DLK_ThongKe>> ThongKeTongQuat()
        {
            return await Mediator.Send(new TongQuat.Query ());
        }

        [HttpGet]
        [Route("ThongKeDoanhThu")]
        public async Task<Result<IEnumerable<DLK_ThongKe_DoanhThu>>> ThongKeDoanhThu(int Nam)
        {
            return await Mediator.Send(new DoanhThu.Query { Nam = Nam });
        }

        [HttpGet]
        [Route("ThongKeLichHen")]
        public async Task<Result<IEnumerable<DLK_ThongKe_LichHen>>> ThongKeLichHen(int Nam)
        {
            return await Mediator.Send(new LichHen.Query { Nam = Nam });
        }

        [HttpGet]
        [Route("ThongKeDichVu")]
        public async Task<Result<IEnumerable<DLK_ThongKe_DichVu>>> ThongKeDichVu()
        {
            return await Mediator.Send(new DichVu.Query ());
        }

        [HttpGet]
        [Route("ThongKeChuyenGia")]
        public async Task<Result<IEnumerable<DLK_ThongKe_ChuyenGia>>> ThongKeChuyenGia()
        {
            return await Mediator.Send(new ChuyenGia.Query());
        }

        [HttpGet]
        [Route("ThongKeDanhGia")]
        public async Task<Result<IEnumerable<DLK_ThongKe_DanhGia>>> ThongKeDanhGia()
        {
            return await Mediator.Send(new DanhGia.Query());
        }
    }
}
