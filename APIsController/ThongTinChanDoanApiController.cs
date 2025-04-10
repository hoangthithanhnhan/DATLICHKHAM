using Application.Core;
using DATLICHKHAM.Application.ThongTinChanDoan;
using DATLICHKHAM.Controllers;
using DATLICHKHAM.Domain;
using Microsoft.AspNetCore.Mvc;

namespace DATLICHKHAM.APIsController
{
    public class ThongTinChanDoanApiController : BaseApiController
    {
        public ThongTinChanDoanApiController(IWebHostEnvironment hostingEnvironment) : base(hostingEnvironment)
        {
        }

        [HttpGet]
        [Route("Gets")]
        public async Task<Result<IEnumerable<DLK_ThongTinChanDoan>>> Gets()
        {
            return await Mediator.Send(new Gets.Query { });
        }

        [HttpGet]
        [Route("Get")]
        public async Task<Result<DLK_ThongTinChanDoan>> Get(int MaChanDoan)
        {
            return await Mediator.Send(new Get.Query { MaChanDoan = MaChanDoan });
        }

        [HttpPost]
        [Route("Add")]
        public async Task<Result<DLK_ThongTinChanDoan>> Add(DLK_ThongTinChanDoanAdd Entity)
        {
            return await Mediator.Send(new Add.Command { Entity = Entity });
        }

        [HttpPut]
        [Route("Update")]
        public async Task<Result<DLK_ThongTinChanDoan>> Update(DLK_ThongTinChanDoan Entity)
        {
            return await Mediator.Send(new Update.Command { Entity = Entity });
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<Result<int>> Delete(int MaChanDoan)
        {
            return await Mediator.Send(new Delete.Command { MaChanDoan = MaChanDoan });
        }
    }
}
