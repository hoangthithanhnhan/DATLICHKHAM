using Application.Core;
using DATLICHKHAM.Controllers;
using DATLICHKHAM.Domain;
using DATLICHKHAM.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using DATLICHKHAM.Application.ChuyenGia;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace DATLICHKHAM.APIsController
{
    public class ChuyenGiaApiController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;

        public ChuyenGiaApiController(IWebHostEnvironment hostingEnvironment, UserManager<AppUser> userManager) : base(hostingEnvironment)
        {
            _userManager = userManager;
        }


        [HttpGet]
        [Route("Get")]
        public async Task<Result<DLK_ChuyenGia>> Get(int MaChuyenGia)
        {
            return await Mediator.Send(new Get.Query { MaChuyenGia = MaChuyenGia });
        }

        [HttpPost]
        [Route("Gets")]
        public async Task<Result<IEnumerable<DLK_ChuyenGia>>> Gets(DLK_ChuyenGiaRequestFilter filter)
        {
            return await Mediator.Send(new Gets.Query {filter=filter});
        }

        [HttpPost]
        [Route("Add")]
        public async Task<Result<DLK_ChuyenGia>> Add(DLK_ChuyenGiaAddInfo Entity)
        {

            //Khởi tạo model create user bằng identity
            var userModel = new AppUser
            {
                UserName = Entity.Username,
                Email = Entity.Email,
                DisplayName = Entity.HoTen,
                VaiTro = 1
            };

            //Tạo user bằng identity
            var requestUser = await _userManager.CreateAsync(userModel, Entity.Password);

            //Check request create user identity nếu thành công thì get ID để đưa vào model tạo chuyên gia
            //để tạo chuyên gia bằng account admin
            if (requestUser.Succeeded)
            {
                var infoUser = await _userManager.FindByNameAsync(Entity.Username);
                if(infoUser.Id != null)
                {
                    Entity.MaNguoiDung = infoUser.Id;
                    return await Mediator.Send(new Add.Command { Entity = Entity });
                }
            }
            else
            {
                string error = requestUser.Errors.ToList()[0].Description;
                
                return Result<DLK_ChuyenGia>.Failure(error);
            }
                return Result<DLK_ChuyenGia>.Failure("Thêm mới user không thành công");

            //Gọi service add chuyên gia để đưa thông tin chuyên gia vào cơ sở dữ liệu
        }

        
        [HttpPut]
        [Route("Update")]
        public async Task<Result<DLK_ChuyenGia>> Update(DLK_ChuyenGiaUpdate Entity)
        {
            return await Mediator.Send(new Update.Command { Entity = Entity });
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<Result<int>> Delete(int MaNguoiDung)
        {
            return await Mediator.Send(new Delete.Command { MaNguoiDung = MaNguoiDung });
        }

    }
}
