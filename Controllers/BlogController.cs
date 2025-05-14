using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using DATLICHKHAM.Models;

namespace DATLICHKHAM.Controllers
{
    public class BlogController : Controller
    {
        private readonly ILogger<BlogController> _logger;

        public BlogController(ILogger<BlogController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }
        public IActionResult BaiVietChiTiet(string maBaiViet="")
        {
            if (!string.IsNullOrEmpty(maBaiViet))
            {
                ViewBag.MaBaiViet = maBaiViet;
            }
            return View();
        }
    }
}
