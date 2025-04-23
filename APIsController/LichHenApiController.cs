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

        [HttpDelete]
        [Route("Delete")]
        public async Task<Result<int>> Delete(int MaLichHen)
        {
            return await Mediator.Send(new Delete.Commnad { MaLichHen = MaLichHen });
        }
    }
}
