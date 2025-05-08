using DATLICHKHAM.Controllers;
using iTextSharp.text.pdf.qrcode;
using Microsoft.AspNetCore.Mvc;
using QRCoder;
using System.Drawing;
using System.Drawing.Imaging;

namespace DATLICHKHAM.ApiController
{
    public class GenerateQRApiController : BaseApiController
    {
        public GenerateQRApiController(IWebHostEnvironment hostingEnvironment) : base(hostingEnvironment)
        {
        }
        [HttpPost]
        public async Task<IActionResult> GenerateQR(string qRCode)
        {
            try
            {
                QRCodeGenerator QrGenerator = new QRCodeGenerator();
                QRCodeData QrCodeInfo = QrGenerator.CreateQrCode(qRCode, QRCodeGenerator.ECCLevel.Q);
                BitmapByteQRCode qrCode = new BitmapByteQRCode(QrCodeInfo);
                byte[] BitmapArray = qrCode.GetGraphic(20);
                string QrUri = string.Format("data:image/png;base64,{0}", Convert.ToBase64String(BitmapArray));

                return Ok(QrUri);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
    public static class BitmapExtension
    {
        public static byte[] BitmapToByteArray(this Bitmap bitmap)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                bitmap.Save(ms, ImageFormat.Png);
                return ms.ToArray();
            }
        }
    }
}