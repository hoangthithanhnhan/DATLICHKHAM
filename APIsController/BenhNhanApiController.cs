using Application.Core;
using DATLICHKHAM.Application.BenhNhan;
using DATLICHKHAM.Controllers;
using DATLICHKHAM.Domain;
using DATLICHKHAM.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace DATLICHKHAM.APIsController
{
    public class BenhNhanApiController : BaseApiController
    {

        private readonly UserManager<AppUser> _userManager;

        public BenhNhanApiController(IWebHostEnvironment hostingEnvironment, UserManager<AppUser> userManager) : base(hostingEnvironment)
        {

            _userManager = userManager;
        }

        [HttpGet]
        [Route("Gets")]
        public async Task<Result<IEnumerable<DLK_BenhNhan>>> Gets()
        {
            return await Mediator.Send(new Gets.Query());
        }

        [HttpGet]
        [Route("Get")]
        public async Task<Result<DLK_BenhNhan>> Get(int MaBenhNhan)
        {
            return await Mediator.Send(new Get.Query { MaBenhNhan = MaBenhNhan });
        }

        [HttpPost]
        [Route("Add")]
        public async Task<Result<DLK_BenhNhan>> Add(DLK_BenhNhanAddInfo Entity)
        {
            var userModel = new AppUser
            {
                UserName = Entity.Username,
                Email = Entity.Email,
                DisplayName = Entity.HoTen,
                PhoneNumber = Entity.SoDienThoai,
                VaiTro = 2
            };

            //Tạo user bằng identity
            var requestUser = await _userManager.CreateAsync(userModel, Entity.Password);

            //Check request create user identity nếu thành công thì get ID để đưa vào model tạo chuyên gia
            //để tạo chuyên gia bằng account admin
            if (requestUser.Succeeded)
            {
                var infoUser = await _userManager.FindByNameAsync(Entity.Username);
                if (infoUser.Id != null)
                {
                    Entity.MaNguoiDung = infoUser.Id;
                }
                else
                {
                    return Result<DLK_BenhNhan>.Failure("Thêm mới user không thành công");
                }
            }
            //Gọi service add chuyên gia để đưa thông tin chuyên gia vào cơ sở dữ liệu
            return await Mediator.Send(new Add.Command { Entity = Entity });
        }

        [HttpPut]
        [Route("Update")]
        public async Task<Result<DLK_BenhNhan>> Update(DLK_BenhNhanUpdate Entity)
        {
            return await Mediator.Send(new Update.Command { Entity = Entity });
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<Result<int>> Delete(int MaBenhNhan)
        {
            return await Mediator.Send(new Delete.Command { MaBenhNhan = MaBenhNhan });
        }

    }
}
