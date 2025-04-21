using DATLICHKHAM.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
namespace DATLICHKHAM.ViewComponents
{
    public class UserViewComponent : ViewComponent
    {
        private readonly UserManager<AppUser> _userManager;
        public UserViewComponent(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }
        public async Task<IViewComponentResult> InvokeAsync()
        {
            var userCurrent = (ClaimsIdentity)User.Identity;
            var user = userCurrent != null && userCurrent.Name != null ? await _userManager.FindByNameAsync(userCurrent.Name) : null;
            if (user != null)
            {
                ViewBag.DisplayName = user.DisplayName;
                ViewBag.Avatar = user.Avatar;
                ViewBag.VaiTro = user.VaiTro;
            }
            return View();
        }
    }
}
