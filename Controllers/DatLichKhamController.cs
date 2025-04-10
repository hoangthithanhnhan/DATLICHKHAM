using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using DATLICHKHAM.Models;

namespace DATLICHKHAM.Controllers
{
    public class DatLichKhamController : Controller
    {
        private readonly ILogger<DatLichKhamController> _logger;

        public DatLichKhamController(ILogger<DatLichKhamController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult DatLichKhamChiTiet()
        {
            return View();
        }
    }
}
