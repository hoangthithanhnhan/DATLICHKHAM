using DATLICHKHAM.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Areas.CMS.Controllers
{
    [Area("CMS")]
    [Authorize]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        public HomeController(ILogger<HomeController> logger, UserManager<AppUser> userManager, SignInManager<AppUser> signInManager)
        {
            _logger = logger;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public async Task<IActionResult> Index()
        {
            var userCurrent = (ClaimsIdentity)User.Identity;
            var user = userCurrent != null && userCurrent.Name != null ? await _userManager.FindByNameAsync(userCurrent.Name) : null;
            if (user != null)
            {
                var checkRole = await _userManager.IsInRoleAsync(user, "Admin");

                if (!checkRole)
                {
                    return LocalRedirect($"/AccessDenied");
                }

            }
            return View();
        }
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return LocalRedirect("~/");
        }
    }
}