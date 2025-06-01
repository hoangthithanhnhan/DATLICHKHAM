using DATLICHKHAM.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace RouteLinks.Areas.CMS.Controllers
{
    [Area("CMS")]
    [Authorize]
    public class QuanLyBaiVietController : Controller
    {
        private readonly UserManager<AppUser> _userManager;
        public QuanLyBaiVietController(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
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
    }
}