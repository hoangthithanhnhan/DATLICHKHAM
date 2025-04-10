using Application.Core;
using DATLICHKHAM.Application.ChuyenMuc;
using DATLICHKHAM.Controllers;
using DATLICHKHAM.Domain;
using DATLICHKHAM.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace DATLICHKHAM.APIsController
{
    public class ChuyenMucApiController : BaseApiController
    {
        public ChuyenMucApiController(IWebHostEnvironment hostingEnvironment) : base(hostingEnvironment)
        {
        }

        [HttpPost]
        [Route("Gets")]
        public async Task<Result<IEnumerable<DLK_ChuyenMuc>>> Gets(DLK_ChuyenMucRequestFilter filter)
        {
            return await Mediator.Send(new Gets.Query {Filter=filter});
        }

        [HttpGet]
        [Route("Get")]
        public async Task<Result<DLK_ChuyenMuc>> Get(int MaChuyenMuc)
        {
            return await Mediator.Send(new Get.Query { MaChuyenMuc = MaChuyenMuc });
        }

        [HttpPost]
        [Route("Add")]
        public async Task<Result<DLK_ChuyenMuc>> Add([FromForm] RequestUploadFile request)
        {
            //biến đổi chuỗi JSON thành object vì [FromForm] không map được object JSON phức tạp được nên phải convert sang 
            DLK_ChuyenMucAdd ChuyenMuc = JsonConvert.DeserializeObject<DLK_ChuyenMucAdd>(request.data);
            const string avatarPath = "wwwroot\\upload\\ChuyenMuc"; //nơi lưu file vật lý vừa upload
            const string pathdb = "\\upload\\ChuyenMuc"; //đường dẫn để lưu trong DB
            //trả về đường dẫn file đã upload
            var uploadedFiles = await SaveFileUploadSingleMain(request.file, avatarPath, pathdb);
            //lưu đường dẫn vào trường AnhDaiDien của model ChuyenMuc
            ChuyenMuc.AnhDaiDien = uploadedFiles;
            return await Mediator.Send(new Add.Command { Entity = ChuyenMuc });
        }


        [HttpPut]
        [Route("Update")]
        public async Task<Result<DLK_ChuyenMuc>> Update([FromForm] RequestUploadFile request)
        {

            // Deserialize JSON string từ "data" thành object DLK_ChuyenMucAdd
            DLK_ChuyenMuc ChuyenMuc = JsonConvert.DeserializeObject<DLK_ChuyenMuc>(request.data);
            const string avatarPath = "wwwroot\\upload\\ChuyenMuc"; //nơi lưu file vật lý vừa upload
            const string pathdb = "\\upload\\ChuyenMuc"; //đường dẫn để lưu trong DB
            //Lấy lại thông tin cũ của dịch vụ từ DB, để mình biết ảnh cũ là ảnh gì.
            var ChuyenMucOld = await Mediator.Send(new Get.Query { MaChuyenMuc = ChuyenMuc.MaChuyenMuc });

            if (request.file != null && request.file.Length > 0)
            {
                //Gọi API lấy dịch vụ cũ thành công Và có ảnh cũ tồn tại
                if (ChuyenMucOld.IsSuccess && !string.IsNullOrEmpty(ChuyenMucOld.Value.AnhDaiDien))
                {
                    string oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", ChuyenMucOld.Value.AnhDaiDien.TrimStart('\\'));

                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath); // XÓA ảnh cũ
                    }
                }

                // Upload ảnh mới
                var uploadedFile = await SaveFileUploadSingleMain(request.file, avatarPath, pathdb);
                ChuyenMuc.AnhDaiDien = uploadedFile;
            }
            else
            {
                // Nếu không có file ảnh mới, giữ nguyên đường dẫn ảnh cũ
                if (ChuyenMucOld.IsSuccess)
                {
                    ChuyenMuc.AnhDaiDien = ChuyenMucOld.Value.AnhDaiDien;
                }
            }
            return await Mediator.Send(new Update.Command { Entity = ChuyenMuc });
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<Result<int>> Delete(int MaChuyenMuc)
        {
            var ChuyenMucOld = await Mediator.Send(new Get.Query { MaChuyenMuc = MaChuyenMuc });
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
            return await Mediator.Send(new Delete.Command { MaChuyenMuc = MaChuyenMuc });
        }

        [HttpDelete]
        [Route("DeleteAnhDaiDien")]
        public async Task<Result<DLK_ChuyenMuc>> DeleteAnhDaiDien(int MaChuyenMuc)
        {
            var DichVuOld = await Mediator.Send(new Get.Query { MaChuyenMuc = MaChuyenMuc });
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
                    return Result<DLK_ChuyenMuc>.Failure(ex.Message);
                }
            }
            var entity = DichVuOld.Value;
            entity.AnhDaiDien = null;
            return await Mediator.Send(new Update.Command { Entity = entity });
        }
    }
}
