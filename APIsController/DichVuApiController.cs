using Application.Core;
using DATLICHKHAM.Application.DichVu;
using DATLICHKHAM.Controllers;
using DATLICHKHAM.Domain;
using DATLICHKHAM.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace DATLICHKHAM.APIsController
{
    public class DichVuApiController : BaseApiController
    {
        public DichVuApiController(IWebHostEnvironment hostingEnvironment) : base(hostingEnvironment)
        {
        }

        [HttpPost]
        [Route("Gets")]
        public async Task<Result<IEnumerable<DLK_DichVu>>> Gets(DLK_DichVuRequestFilter filter)
        {
            return await Mediator.Send(new Gets.Query {filter=filter});
        }

        [HttpGet]
        [Route("Get")]
        public async Task<Result<DLK_DichVu>> Get(int MaDichVu)
        {
            return await Mediator.Send(new Get.Query { MaDichVu = MaDichVu });
        }

        [HttpPost]
        [Route("Add")]
        public async Task<Result<DLK_DichVu>> Add([FromForm] RequestUploadFile request)
        {
            //biến đổi chuỗi JSON thành object vì [FromForm] không map được object JSON phức tạp được nên phải convert sang 
            DLK_DichVuAdd DichVu = JsonConvert.DeserializeObject<DLK_DichVuAdd>(request.data);
            const string avatarPath = "wwwroot\\upload\\DichVu"; //nơi lưu file vật lý vừa upload
            const string pathdb = "\\upload\\DichVu"; //đường dẫn để lưu trong DB
            //trả về đường dẫn file đã upload
            var uploadedFiles = await SaveFileUploadSingleMain(request.file, avatarPath, pathdb);
            //lưu đường dẫn vào trường AnhDaiDien của model DichVu
            DichVu.AnhDaiDien = uploadedFiles;
            return await Mediator.Send(new Add.Commnad { Entity = DichVu });
        }


        [HttpPut]
        [Route("Update")]
        public async Task<Result<DLK_DichVu>> Update([FromForm] RequestUploadFile request)
        {

            // Deserialize JSON string từ "data" thành object DLK_DichVuAdd
            DLK_DichVu DichVu = JsonConvert.DeserializeObject<DLK_DichVu>(request.data);
            const string avatarPath = "wwwroot\\upload\\DichVu"; //nơi lưu file vật lý vừa upload
            const string pathdb = "\\upload\\DichVu"; //đường dẫn để lưu trong DB
            //Lấy lại thông tin cũ của dịch vụ từ DB, để mình biết ảnh cũ là ảnh gì.
            var DichVuOld = await Mediator.Send(new Get.Query { MaDichVu = DichVu.MaDichVu });

            if (request.file != null && request.file.Length > 0)
            {
                //Gọi API lấy dịch vụ cũ thành công Và có ảnh cũ tồn tại
                if (DichVuOld.IsSuccess && !string.IsNullOrEmpty(DichVuOld.Value.AnhDaiDien))
                {
                    string oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", DichVuOld.Value.AnhDaiDien.TrimStart('\\'));

                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath); // XÓA ảnh cũ
                    }
                }

                // Upload ảnh mới
                var uploadedFile = await SaveFileUploadSingleMain(request.file, avatarPath, pathdb);
                DichVu.AnhDaiDien = uploadedFile;
            }
            else
            {
                // Nếu không có file ảnh mới, giữ nguyên đường dẫn ảnh cũ
                if (DichVuOld.IsSuccess)
                {
                    DichVu.AnhDaiDien = DichVuOld.Value.AnhDaiDien;
                }
            }
            return await Mediator.Send(new Update.Command { Entity = DichVu });
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<Result<int>> Delete(int MaDichVu)
        {
            var DichVuOld = await Mediator.Send(new Get.Query { MaDichVu = MaDichVu });
            if (DichVuOld.IsSuccess && !string.IsNullOrEmpty(DichVuOld.Value.AnhDaiDien))
            {
                try
                {
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", DichVuOld.Value.AnhDaiDien.TrimStart('\\'));
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
            return await Mediator.Send(new Delete.Command { MaDichVu = MaDichVu });
        }

        [HttpDelete]
        [Route("DeleteAnhDaiDien")]
        public async Task<Result<DLK_DichVu>> DeleteAnhDaiDien(int MaDichVu)
        {
            var DichVuOld = await Mediator.Send(new Get.Query { MaDichVu = MaDichVu });
            var relativePath = DichVuOld.Value.AnhDaiDien.Replace("/", Path.DirectorySeparatorChar.ToString()).TrimStart('\\');
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", relativePath);
            if (DichVuOld.IsSuccess && !string.IsNullOrEmpty(DichVuOld.Value.AnhDaiDien))
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
                    return Result<DLK_DichVu>.Failure(ex.Message);
                }
            }
            var entity = DichVuOld.Value;
            entity.AnhDaiDien = null;
            return await Mediator.Send(new Update.Command { Entity = entity });
        }
    }
}
