using Application.Core;
using DATLICHKHAM.Application.BenhNhan;
using DATLICHKHAM.Controllers;
using DATLICHKHAM.Domain;
using DATLICHKHAM.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Security.Claims;

namespace DATLICHKHAM.APIsController
{
    public class BenhNhanApiController : BaseApiController
    {

        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<AppRole> _roleManager;

        public BenhNhanApiController(IWebHostEnvironment hostingEnvironment, UserManager<AppUser> userManager, RoleManager<AppRole> roleManager) : base(hostingEnvironment)
        {

            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpGet]
        [Route("user-info")]
        public async Task<Result<DLK_BenhNhan>> GetUserInfo()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return await Mediator.Send(new Get.Query { MaBenhNhan = null, MaNguoiDung = userId });
        }

        [HttpGet]
        [Route("Get")]
        public async Task<Result<DLK_BenhNhan>> Get(int MaBenhNhan)
        {
            return await Mediator.Send(new Get.Query { MaBenhNhan = MaBenhNhan });
        }

        [HttpPost]
        [Route("Gets")]
        public async Task<Result<IEnumerable<DLK_BenhNhan>>> Gets(bool? trangThai, string filter = null)
        {
            return await Mediator.Send(new Gets.Query { filter = filter, trangthai = trangThai });
        }

        [HttpPost]
        [Route("Add")]
        public async Task<Result<DLK_BenhNhan>> Add([FromForm] RequestUploadFile request)
        {
            //chuyển từ json string sang object DLK_BenhNhanAddInfo
            DLK_BenhNhanAddInfo benhNhan = JsonConvert.DeserializeObject<DLK_BenhNhanAddInfo>(request.data);

            const string avatarPath = "wwwroot\\upload\\BenhNhan"; // Thư mục lưu trữ file
            const string pathdb = "\\upload\\BenhNhan"; // Đường dẫn lưu trong DB

            // Kiểm tra thư mục lưu file đã tồn tại chưa, nếu chưa thì tạo mới
            if (!Directory.Exists(avatarPath))
                Directory.CreateDirectory(avatarPath);

            // Xử lý file upload
            if (request.file != null && request.file.Length > 0)
            {
                // Tạo tên file duy nhất để tránh trùng
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(request.file.FileName);
                var fullPath = Path.Combine(avatarPath, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await request.file.CopyToAsync(stream);
                }

                // Gán đường dẫn file vào benhNhan
                benhNhan.AnhDaiDien = Path.Combine(pathdb, fileName).Replace("\\", "/"); // format theo URL
            }

            // Tạo user bằng Identity
            var userModel = new AppUser
            {
                UserName = benhNhan.Username,
                Email = benhNhan.Email,
                DisplayName = benhNhan.HoTen,
                PhoneNumber = benhNhan.SoDienThoai,
                //VaiTro = 2,
                Avatar = benhNhan.AnhDaiDien
            };

            var requestUser = await _userManager.CreateAsync(userModel, benhNhan.Password);

            if (requestUser.Succeeded)
            {
                var infoUser = await _userManager.FindByNameAsync(benhNhan.Username);

                var addRoleUser = await _userManager.AddToRoleAsync(infoUser, "BenhNhan");

                if (!addRoleUser.Succeeded) {
                    string error = addRoleUser.Errors.FirstOrDefault()?.Description ?? "Lỗi không xác định";
                    return Result<DLK_BenhNhan>.Failure(error);
                }

                //kiểm tra username id đã tồn tại hay chưa
                if (infoUser?.Id != null)
                {
                    // Lưu thông tin Chuyên Gia vào bảng ChuyenGia
                    benhNhan.MaNguoiDung = infoUser.Id;

                    // Gửi yêu cầu thêm chuyên gia vào cơ sở dữ liệu
                    var resultChuyenGia = await Mediator.Send(new Add.Command { Entity = benhNhan });

                    var userInfo = await _userManager.FindByIdAsync(infoUser.Id.ToString());

                    benhNhan.Email = userInfo.Email;
                    benhNhan.SoDienThoai = userInfo.PhoneNumber;
                    benhNhan.AnhDaiDien = userInfo.Avatar;

                    return resultChuyenGia;
                }
            }
            else
            {
                string error = requestUser.Errors.FirstOrDefault()?.Description ?? "Lỗi không xác định";
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
