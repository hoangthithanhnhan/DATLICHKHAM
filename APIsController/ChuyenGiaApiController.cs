using Application.Core;
using DATLICHKHAM.Controllers;
using DATLICHKHAM.Domain;
using DATLICHKHAM.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using DATLICHKHAM.Application.ChuyenGia;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Newtonsoft.Json;
using System.Security.Claims;

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
        [Route("user-info")]
        public async Task<Result<DLK_ChuyenGia>> GetUserInfo()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return await Mediator.Send(new Get.Query { MaChuyenGia = null , MaNguoiDung = userId });
        }

        [HttpGet]
        [Route("Get")]
        public async Task<Result<DLK_ChuyenGia>> Get(int? MaChuyenGia)
        {
            return await Mediator.Send(new Get.Query { MaChuyenGia = MaChuyenGia , MaNguoiDung = null});
        }

        [HttpPost]
        [Route("Gets")]
        public async Task<Result<IEnumerable<DLK_ChuyenGia>>> Gets(DLK_ChuyenGiaRequestFilter filter)
        {
            return await Mediator.Send(new Gets.Query {filter=filter});
        }

        [HttpGet]
        [Route("GetChuyenGiaByDichVu")]
        public Task<Result<IEnumerable<DLK_ChuyenGia>>> GetChuyenGiaByDichVu(int MaDichVu)
        {
            return Mediator.Send(new GetChuyenGiaByDichVu.Query { MaDichVu = MaDichVu });
        }

        [HttpPost]
        [Route("Add")]
        public async Task<Result<DLK_ChuyenGia>> Add([FromForm] RequestUploadFile request)
        {
            //chuyển từ json string sang object DLK_ChuyenGiaAddInfo
            DLK_ChuyenGiaAddInfo chuyenGia = JsonConvert.DeserializeObject<DLK_ChuyenGiaAddInfo>(request.data);

            const string avatarPath = "wwwroot\\upload\\ChuyenGia"; // Thư mục lưu trữ file
            const string pathdb = "\\upload\\ChuyenGia"; // Đường dẫn lưu trong DB

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

                // Gán đường dẫn file vào chuyenGia
                chuyenGia.AnhDaiDien = Path.Combine(pathdb, fileName).Replace("\\", "/"); // format theo URL
            }

            // Tạo user bằng Identity
            var userModel = new AppUser
            {
                UserName = chuyenGia.Username,
                Email = chuyenGia.Email,
                DisplayName = chuyenGia.HoTen,
                PhoneNumber = chuyenGia.SoDienThoai,
                VaiTro = 1,
                Avatar = chuyenGia.AnhDaiDien
            };

            var requestUser = await _userManager.CreateAsync(userModel, chuyenGia.Password);

            if (requestUser.Succeeded)
            {
                var infoUser = await _userManager.FindByNameAsync(chuyenGia.Username);
                //kiểm tra username id đã tồn tại hay chưa
                if (infoUser?.Id != null)
                {
                    // Lưu thông tin Chuyên Gia vào bảng ChuyenGia
                    chuyenGia.MaNguoiDung = infoUser.Id;

                    // Gửi yêu cầu thêm chuyên gia vào cơ sở dữ liệu
                    var resultChuyenGia = await Mediator.Send(new Add.Command { Entity = chuyenGia });

                    var userInfo = await _userManager.FindByIdAsync(infoUser.Id.ToString());

                    chuyenGia.Email = userInfo.Email;
                    chuyenGia.SoDienThoai = userInfo.PhoneNumber;
                    chuyenGia.AnhDaiDien = userInfo.Avatar;

                    return resultChuyenGia;
                }
            }
            else
            {
                string error = requestUser.Errors.FirstOrDefault()?.Description ?? "Lỗi không xác định";
                return Result<DLK_ChuyenGia>.Failure(error);
            }

            return Result<DLK_ChuyenGia>.Failure("Thêm mới user không thành công");
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
            var chuyenGiaOld = await Mediator.Send(new Get.Query { MaChuyenGia = MaChuyenGia });

            //Lấy danh sách chứng chỉ của chiên da

            // Mapping danh sách chứng chỉ của chiên da

            //Trong mapping danh sách chứng chỉ của chiên da thì gọi thủ tục lấy ra danh sách tệp kèm theo của chứng chỉ

            //Sau khi có được danh sách file của chứng chỉ thì mapping danh sách file, xóa file vật lý, rồi gọi thủ tục để xóa DB
            if (chuyenGiaOld.IsSuccess && !string.IsNullOrEmpty(chuyenGiaOld.Value.AnhDaiDien))
            {
                try
                {
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", chuyenGiaOld.Value.AnhDaiDien.TrimStart('\\'));
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
