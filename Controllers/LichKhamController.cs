using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using DATLICHKHAM.Models;

namespace DATLICHKHAM.Controllers
{
    public class LichKhamController : Controller
    {
        private readonly ILogger<LichKhamController> _logger;

        public LichKhamController(ILogger<LichKhamController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
