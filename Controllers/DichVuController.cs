using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using DATLICHKHAM.Models;

namespace DATLICHKHAM.Controllers
{
    public class DichVuController : Controller
    {
        private readonly ILogger<DichVuController> _logger;

        public DichVuController(ILogger<DichVuController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult DanhSachChuyenGia()
        {
            return View();
        }
    }
}
