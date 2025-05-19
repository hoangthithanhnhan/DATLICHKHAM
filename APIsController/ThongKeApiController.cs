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
        [Route("ThongKe_TongQuat")]
        public async Task<Result<DLK_ThongKe>> ThongKe_TongQuat()
        {
            return await Mediator.Send(new TongQuat.Query ());
        }

        [HttpGet]
        [Route("ThongKe_DoanhThu")]
        public async Task<Result<IEnumerable<DLK_ThongKe_DoanhThu>>> ThongKe_DoanhThu(int Nam)
        {
            return await Mediator.Send(new DoanhThu.Query { Nam = Nam });
        }

    }
}
