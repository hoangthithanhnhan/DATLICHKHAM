using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using DATLICHKHAM.Models;

namespace DATLICHKHAM.Controllers
{
    public class ThongTinCaNhanChuyenGiaController : Controller
    {
        private readonly ILogger<ThongTinCaNhanChuyenGiaController> _logger;

        public ThongTinCaNhanChuyenGiaController(ILogger<ThongTinCaNhanChuyenGiaController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
