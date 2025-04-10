using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using DATLICHKHAM.Models;

namespace DATLICHKHAM.Controllers
{
    public class DangNhapController : Controller
    {
        private readonly ILogger<DangNhapController> _logger;

        public DangNhapController(ILogger<DangNhapController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
