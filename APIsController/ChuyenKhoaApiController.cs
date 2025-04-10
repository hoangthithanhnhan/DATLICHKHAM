using Application.Core;
using DATLICHKHAM.Application.ChuyenKhoa;
using DATLICHKHAM.Controllers;
using DATLICHKHAM.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DATLICHKHAM.APIsController
{
    public class ChuyenKhoaApiController : BaseApiController
    {
        public ChuyenKhoaApiController(IWebHostEnvironment hostingEnvironment) : base(hostingEnvironment)
        {
        }

        [HttpGet]
        [Route("Get")]
        [AllowAnonymous]
        public async Task<Result<DLK_ChuyenKhoa>> Get(int MaChuyenKhoa)
        {
            return await Mediator.Send(new Get.Query { MaChuyenKhoa= MaChuyenKhoa });
        }

        [HttpGet]
        [Route("Gets")]
        [AllowAnonymous]
        public async Task<Result<IEnumerable<DLK_ChuyenKhoa>>> Gets(string filter=null)
        {
            return await Mediator.Send(new Gets.Query { filter=filter});
        }


        [HttpPost]
        [Route("Add")]
        public async Task<Result<DLK_ChuyenKhoa>> Add(DLK_ChuyenKhoaAdd Entity)
        {
            return await Mediator.Send(new Add.Command {Entity=Entity});
        }

        [HttpPut]
        [Route("Update")]
        public async Task<Result<DLK_ChuyenKhoa>> Update(DLK_ChuyenKhoa Entity)
        {
            return await Mediator.Send(new  Update.Command {Entity=Entity});
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<Result<int>> Delete(int MaChuyenKhoa)
        {
            return await Mediator.Send(new Delete.Command {MaChuyenKhoa=MaChuyenKhoa});
        }
    }
}
