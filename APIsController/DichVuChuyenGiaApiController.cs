using Application.Core;
using DATLICHKHAM.Application.DichVu_ChuyenGia;
using DATLICHKHAM.Controllers;
using DATLICHKHAM.Domain;
using Microsoft.AspNetCore.Mvc;

namespace DATLICHKHAM.APIsController
{
    public class DichVuChuyenGiaApiController : BaseApiController
    {
        public DichVuChuyenGiaApiController(IWebHostEnvironment hostingEnvironment) : base(hostingEnvironment)
        {
        }

        [HttpPost]
        [Route("Add")]
        public async Task<Result<DLK_DichVu_ChuyenGia>> Add(DLK_DichVu_ChuyenGia Entity)
        {
            return await Mediator.Send(new Add.Command { Entity = Entity });
        }

        [HttpGet]
        [Route("GetDichVuByChuyenGia")]
        public Task<Result<IEnumerable<DLK_DichVu_ChuyenGia>>> GetDichVuByChuyenGia(int MaChuyenGia)
        {
            return Mediator.Send(new GetDichVuByChuyenGia.Query { MaChuyenGia = MaChuyenGia });
        }
    }
}
