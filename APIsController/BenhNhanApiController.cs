using Application.Core;
using DATLICHKHAM.Application.BenhNhan;
using DATLICHKHAM.Controllers;
using DATLICHKHAM.Domain;
using DATLICHKHAM.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

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
        [Route("Get")]
        public async Task<Result<DLK_BenhNhan>> Get(int MaBenhNhan)
        {
            return await Mediator.Send(new Get.Query { MaBenhNhan = MaBenhNhan });
        }

        [HttpPost]
        [Route("Gets")]
        public async Task<Result<IEnumerable<DLK_BenhNhan>>> Gets(DLK_BenhNhanRequestFilter filter)
        {
            return await Mediator.Send(new Gets.Query { filter = filter });
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
                    //Gọi service add chuyên gia để đưa thông tin chuyên gia vào cơ sở dữ liệu
                    return await Mediator.Send(new Add.Command { Entity = Entity });
                }
            }
            else
            {
                string error = requestUser.Errors.ToList()[0].Description;

                return Result<DLK_BenhNhan>.Failure(error);
            }
            return Result<DLK_BenhNhan>.Failure("Thêm mới user không thành công");
        }

        [HttpPut]
        [Route("Update")]
        public async Task<Result<DLK_BenhNhan>> Update([FromForm] RequestUploadFile request)
        {
            // Deserialize JSON string từ "data" thành object DLK_ChuyenGiaAdd
            DLK_BenhNhan benhNhan = JsonConvert.DeserializeObject<DLK_BenhNhan>(request.data);
            const string avatarPath = "wwwroot\\upload\\BenhNhan"; //nơi lưu file vật lý vừa upload
            const string pathdb = "\\upload\\BenhNhan"; //đường dẫn để lưu trong DB
            //Lấy lại thông tin cũ của dịch vụ từ DB, để mình biết ảnh cũ là ảnh gì.
            var BenhNhanOLD = await Mediator.Send(new Get.Query { MaBenhNhan = benhNhan.MaBenhNhan });

            if (request.file != null && request.file.Length > 0)
            {
                //Gọi API lấy dịch vụ cũ thành công Và có ảnh cũ tồn tại
                //if (ChuyenGiaOLD.IsSuccess && !string.IsNullOrEmpty(ChuyenGiaOLD.Value.AnhDaiDien))
                if (BenhNhanOLD != null && BenhNhanOLD.IsSuccess && BenhNhanOLD.Value != null && !string.IsNullOrEmpty(BenhNhanOLD.Value.AnhDaiDien))
                {
                    string oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", BenhNhanOLD.Value.AnhDaiDien.TrimStart('\\'));

                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath); // XÓA ảnh cũ
                    }
                }

                // Upload ảnh mới
                var uploadedFile = await SaveFileUploadSingleMain(request.file, avatarPath, pathdb);
                benhNhan.AnhDaiDien = uploadedFile;
            }
            else
            {
                // Nếu không có file ảnh mới, giữ nguyên đường dẫn ảnh cũ
                if (BenhNhanOLD.IsSuccess && BenhNhanOLD.Value != null)
                {
                    benhNhan.AnhDaiDien = BenhNhanOLD.Value.AnhDaiDien;
                }
                else
                {
                    Console.WriteLine("Không tìm thấy chuyên gia cũ hoặc dữ liệu bị thiếu.");
                }
            }
            return await Mediator.Send(new Update.Command { Entity = benhNhan });
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<Result<int>> Delete(int MaBenhNhan)
        {
            var BenhNhanOld = await Mediator.Send(new Get.Query { MaBenhNhan = MaBenhNhan });
            if (BenhNhanOld.IsSuccess && !string.IsNullOrEmpty(BenhNhanOld.Value.AnhDaiDien))
            {
                try
                {
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", BenhNhanOld.Value.AnhDaiDien.TrimStart('\\'));
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }
                catch (Exception ex)
                {
                    return Result<int>.Failure(ex.Message);
                }
            }
            return await Mediator.Send(new Delete.Command { MaBenhNhan = MaBenhNhan });
        }


        [HttpDelete]
        [Route("DeleteAnhDaiDien")]
        public async Task<Result<DLK_BenhNhan>> DeleteAnhDaiDien(int MaBenhNhan)
        {
            var BenhNhanOld = await Mediator.Send(new Get.Query { MaBenhNhan = MaBenhNhan });
            var relativePath = BenhNhanOld.Value.AnhDaiDien.Replace("/", Path.DirectorySeparatorChar.ToString()).TrimStart('\\');
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", relativePath);
            if (BenhNhanOld.IsSuccess && !string.IsNullOrEmpty(BenhNhanOld.Value.AnhDaiDien))
            {
                try
                {
                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }
                catch (Exception ex)
                {
                    return Result<DLK_BenhNhan>.Failure(ex.Message);
                }
            }
            var entity = BenhNhanOld.Value;
            entity.AnhDaiDien = null;
            return await Mediator.Send(new Update.Command { Entity = entity });
        }
    }
}
