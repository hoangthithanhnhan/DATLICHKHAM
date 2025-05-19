using Application.Core;
using DATLICHKHAM.Application.TaiKhoan;
using DATLICHKHAM.Controllers;
using DATLICHKHAM.Domain;
using DATLICHKHAM.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DATLICHKHAM.APIsController
{
    public class TaiKhoanApiController : BaseApiController
    {
        public TaiKhoanApiController(IWebHostEnvironment hostingEnvironment) : base(hostingEnvironment)
        {
        }

        [HttpGet]
        [Route("Gets")]
        public async Task<Result<IEnumerable<AppUser>>> Gets(string Keyword = null)
        {
            return await Mediator.Send(new Gets.Query { Keyword = Keyword});
        }


        [HttpPut]
        [Route("UpdateStatus")]
        public async Task<Result<int>> UpdateStatus(AppUser Entity)
        {
            return await Mediator.Send(new UpdateStatus.Command { entity = Entity });
        }

        //[HttpDelete]
        //[Route("Delete")]
        //public async Task<Result<int>> Delete(int MaChuyenKhoa)
        //{
        //    return await Mediator.Send(new Delete.Command {MaChuyenKhoa=MaChuyenKhoa});
        //}
    }
}
