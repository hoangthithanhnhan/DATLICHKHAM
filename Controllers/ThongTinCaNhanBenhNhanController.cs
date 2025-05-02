using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using DATLICHKHAM.Models;

namespace DATLICHKHAM.Controllers
{
    public class ThongTinCaNhanBenhNhanController : Controller
    {
        private readonly ILogger<ThongTinCaNhanBenhNhanController> _logger;

        public ThongTinCaNhanBenhNhanController(ILogger<ThongTinCaNhanBenhNhanController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
