using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using DATLICHKHAM.Models;

namespace DATLICHKHAM.Controllers
{
    public class VeChungToiController : Controller
    {
        private readonly ILogger<VeChungToiController> _logger;

        public VeChungToiController(ILogger<VeChungToiController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
