using Application.Core;
using DATLICHKHAM.Application.HoaDon;
using DATLICHKHAM.Controllers;
using DATLICHKHAM.Domain;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace DATLICHKHAM.APIsController
{
    public class HoaDonApiController : BaseApiController
    {
        public HoaDonApiController(IWebHostEnvironment hostingEnvironment) : base(hostingEnvironment)
        {
        }

        [HttpPost]
        [Route("Add")]
        public async Task<Result<DLK_HoaDon>> Add(DLK_HoaDonAdd Entity)
        {
            return await Mediator.Send(new Add.Command { Entity = Entity });
        }
    }
}
