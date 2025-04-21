using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace DATLICHKHAM.Services
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        public UploadController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }
        /// <summary>
        /// tải ảnh lên ô soạn thảo CKEditor 
        /// </summary>
        /// <param name="upload"></param>
        /// <returns></returns>
        [HttpPost("imageBlog")]
        public async Task<IActionResult> UploadImageBlog(IFormFile upload)
        {
            if (upload == null || upload.Length == 0)
                return BadRequest("Vui lòng chọn một tệp ảnh!");

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
            var fileExtension = Path.GetExtension(upload.FileName).ToLower();

            if (!allowedExtensions.Contains(fileExtension))
            {
                return BadRequest("Chỉ cho phép tải lên tệp JPG, JPEG hoặc PNG!");
            }

            var uploadPath = Path.Combine(_environment.WebRootPath, "upload/Blog");

            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }

            var fileName = $"{Guid.NewGuid()}_{upload.FileName}";
            var filePath = Path.Combine(uploadPath, fileName);

            // Lưu file vào thư mục
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await upload.CopyToAsync(stream);
            }

            var fileUrl = $"{Request.Scheme}://{Request.Host}/upload/Blog/{fileName}";

            return Ok(new
            {
                uploaded = true,
                url = fileUrl
            });
        }



    }
}



