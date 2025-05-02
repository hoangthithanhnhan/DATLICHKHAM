using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using DATLICHKHAM.Models;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace DATLICHKHAM.Controllers
{
    public class DangKyController : Controller
    {
        private readonly ILogger<DangKyController> _logger;
        public DangKyController(ILogger<DangKyController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
