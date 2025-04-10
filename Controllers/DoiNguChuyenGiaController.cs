using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using DATLICHKHAM.Models;

namespace DATLICHKHAM.Controllers
{
    public class DoiNguChuyenGiaController : Controller
    {
        private readonly ILogger<DoiNguChuyenGiaController> _logger;

        public DoiNguChuyenGiaController(ILogger<DoiNguChuyenGiaController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

    }
}
