using Application.Core;
using DATLICHKHAM.Controllers;
using DATLICHKHAM.Domain;
using DATLICHKHAM.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using DATLICHKHAM.Application.ChuyenGia;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Newtonsoft.Json;

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
                PhoneNumber = Entity.SoDienThoai,
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
        public async Task<Result<DLK_ChuyenGia>> Update([FromForm] RequestUploadFile request)
        {
            // Deserialize JSON string từ "data" thành object DLK_ChuyenGiaAdd
            DLK_ChuyenGia chuyenGia = JsonConvert.DeserializeObject<DLK_ChuyenGia>(request.data);
            const string avatarPath = "wwwroot\\upload\\ChuyenGia"; //nơi lưu file vật lý vừa upload
            const string pathdb = "\\upload\\ChuyenGia"; //đường dẫn để lưu trong DB
            //Lấy lại thông tin cũ của dịch vụ từ DB, để mình biết ảnh cũ là ảnh gì.
            var ChuyenGiaOLD = await Mediator.Send(new Get.Query { MaChuyenGia = chuyenGia.MaChuyenGia });

            if (request.file != null && request.file.Length > 0)
            {
                //Gọi API lấy dịch vụ cũ thành công Và có ảnh cũ tồn tại
                //if (ChuyenGiaOLD.IsSuccess && !string.IsNullOrEmpty(ChuyenGiaOLD.Value.AnhDaiDien))
                if (ChuyenGiaOLD != null && ChuyenGiaOLD.IsSuccess && ChuyenGiaOLD.Value != null && !string.IsNullOrEmpty(ChuyenGiaOLD.Value.AnhDaiDien))
                {
                    string oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", ChuyenGiaOLD.Value.AnhDaiDien.TrimStart('\\'));

                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath); // XÓA ảnh cũ
                    }
                }

                // Upload ảnh mới
                var uploadedFile = await SaveFileUploadSingleMain(request.file, avatarPath, pathdb);
                chuyenGia.AnhDaiDien = uploadedFile;
            }
            else
            {
                // Nếu không có file ảnh mới, giữ nguyên đường dẫn ảnh cũ
                if (ChuyenGiaOLD.IsSuccess && ChuyenGiaOLD.Value != null)
                {
                    chuyenGia.AnhDaiDien = ChuyenGiaOLD.Value.AnhDaiDien;
                }
                else
                {
                    Console.WriteLine("Không tìm thấy chuyên gia cũ hoặc dữ liệu bị thiếu.");
                }
            }
            return await Mediator.Send(new Update.Command { Entity = chuyenGia });
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<Result<int>> Delete(int MaChuyenGia)
        {
            var ChuyenMucOld = await Mediator.Send(new Get.Query { MaChuyenGia = MaChuyenGia });
            if (ChuyenMucOld.IsSuccess && !string.IsNullOrEmpty(ChuyenMucOld.Value.AnhDaiDien))
            {
                try
                {
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", ChuyenMucOld.Value.AnhDaiDien.TrimStart('\\'));
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
            return await Mediator.Send(new Delete.Command { MaChuyenGia = MaChuyenGia });
        }

        [HttpDelete]
        [Route("DeleteAnhDaiDien")]
        public async Task<Result<DLK_ChuyenGia>> DeleteAnhDaiDien(int MaChuyenGia)
        {
            var ChuyenGiaOld = await Mediator.Send(new Get.Query { MaChuyenGia = MaChuyenGia });
            var relativePath = ChuyenGiaOld.Value.AnhDaiDien.Replace("/", Path.DirectorySeparatorChar.ToString()).TrimStart('\\');
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", relativePath);
            if (ChuyenGiaOld.IsSuccess && !string.IsNullOrEmpty(ChuyenGiaOld.Value.AnhDaiDien))
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
                    return Result<DLK_ChuyenGia>.Failure(ex.Message);
                }
            }
            var entity = ChuyenGiaOld.Value;
            entity.AnhDaiDien = null;
            return await Mediator.Send(new Update.Command { Entity = entity });
        }
    }
}
