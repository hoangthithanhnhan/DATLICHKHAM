using Application.Core;
using DATLICHKHAM.Application.BaiViet;
using DATLICHKHAM.Controllers;
using DATLICHKHAM.Domain;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace DATLICHKHAM.APIsController
{
    public class BaiVietApiController : BaseApiController
    {
        public BaiVietApiController(IWebHostEnvironment hostingEnvironment) : base(hostingEnvironment)
        {
        }

        [HttpPost]
        [Route("Gets")]
        public Task<Result<IEnumerable<DLK_BaiViet>>> Gets(DLK_BaiVietRequestFilter filter)
        {
            return Mediator.Send(new Gets.Query { Filter = filter });
        }

        [HttpGet]
        [Route("Get")]
        public async Task<Result<DLK_BaiViet>> Get(int MaBaiViet)
        {
            return await Mediator.Send(new Get.Query { MaBaiViet = MaBaiViet });
        }

        [HttpPost]
        [Route("Add")]
        public async Task<Result<DLK_BaiViet>> Add([FromForm] RequestUploadFile request)
        {
            //biến đổi chuỗi JSON thành object vì [FromForm] không map được object JSON phức tạp được nên phải convert sang 
            DLK_BaiVietAdd BaiViet = JsonConvert.DeserializeObject<DLK_BaiVietAdd>(request.data);
            const string avatarPath = "wwwroot\\upload\\BaiViet"; //nơi lưu file vật lý vừa upload
            const string pathdb = "\\upload\\BaiViet"; //đường dẫn để lưu trong DB
            //trả về đường dẫn file đã upload
            var uploadedFiles = await SaveFileUploadSingleMain(request.file, avatarPath, pathdb);
            //lưu đường dẫn vào trường AnhDaiDien của model ChuyenMuc
            BaiViet.AnhDaiDien = uploadedFiles;
            return await Mediator.Send(new Add.Command { Entity = BaiViet });
        }

        [HttpPut]
        [Route("Update")]
        public async Task<Result<DLK_BaiViet>> Update([FromForm] RequestUploadFile request)
        {

            // Deserialize JSON string từ "data" thành object DLK_ChuyenMucAdd
            DLK_BaiViet BaiViet = JsonConvert.DeserializeObject<DLK_BaiViet>(request.data);
            const string avatarPath = "wwwroot\\upload\\BaiViet"; //nơi lưu file vật lý vừa upload
            const string pathdb = "\\upload\\BaiViet"; //đường dẫn để lưu trong DB
            //Lấy lại thông tin cũ của dịch vụ từ DB, để mình biết ảnh cũ là ảnh gì.
            var BaiVietOld = await Mediator.Send(new Get.Query { MaBaiViet = BaiViet.MaBaiViet });

            if (request.file != null && request.file.Length > 0)
            {
                //Gọi API lấy dịch vụ cũ thành công Và có ảnh cũ tồn tại
                if (BaiVietOld.IsSuccess && !string.IsNullOrEmpty(BaiVietOld.Value.AnhDaiDien))
                {
                    string oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", BaiVietOld.Value.AnhDaiDien.TrimStart('\\'));

                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath); // XÓA ảnh cũ
                    }
                }

                // Upload ảnh mới
                var uploadedFile = await SaveFileUploadSingleMain(request.file, avatarPath, pathdb);
                BaiViet.AnhDaiDien = uploadedFile;
            }
            else
            {
                // Nếu không có file ảnh mới, giữ nguyên đường dẫn ảnh cũ
                if (BaiVietOld.IsSuccess)
                {
                    BaiViet.AnhDaiDien = BaiVietOld.Value.AnhDaiDien;
                }
            }
            return await Mediator.Send(new Update.Command { Entity = BaiViet });
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<Result<int>> Delete(int MaBaiViet)
        {
            var BaiVietOld = await Mediator.Send(new Get.Query { MaBaiViet = MaBaiViet });
            if (BaiVietOld.IsSuccess && !string.IsNullOrEmpty(BaiVietOld.Value.AnhDaiDien))
            {
                try
                {
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", BaiVietOld.Value.AnhDaiDien.TrimStart('\\'));
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
            return await Mediator.Send(new Delete.Command { MaBaiViet = MaBaiViet });
        }

        [HttpDelete]
        [Route("DeleteAnhDaiDien")]
        public async Task<Result<DLK_BaiViet>> DeleteAnhDaiDien(int MaBaiViet)
        {
            var BaiVietOld = await Mediator.Send(new Get.Query { MaBaiViet = MaBaiViet });
            var relativePath = BaiVietOld.Value.AnhDaiDien.Replace("/", Path.DirectorySeparatorChar.ToString()).TrimStart('\\');
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", relativePath);
            if (BaiVietOld.IsSuccess && !string.IsNullOrEmpty(BaiVietOld.Value.AnhDaiDien))
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
                    return Result<DLK_BaiViet>.Failure(ex.Message);
                }
            }
            var entity = BaiVietOld.Value;
            entity.AnhDaiDien = null;
            return await Mediator.Send(new Update.Command { Entity = entity });
        }
    }
}
