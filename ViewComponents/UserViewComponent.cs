using DATLICHKHAM.Models;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
namespace DATLICHKHAM.ViewComponents
{
    public class UserViewComponent : ViewComponent
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<AppRole> _roleManager;
        private readonly IMediator _mediator;
        public UserViewComponent(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager, IMediator mediator)
        {
            _userManager = userManager;
            _mediator = mediator;
            _roleManager = roleManager;
        }
        public async Task<IViewComponentResult> InvokeAsync()
        {
            var userCurrent = (ClaimsIdentity)User.Identity;
            var user = userCurrent != null && userCurrent.Name != null ? await _userManager.FindByNameAsync(userCurrent.Name) : null;
            if (user != null)
            {
                var roles = await _userManager.GetRolesAsync(user);
                if (roles.Count > 0)
                {
                    var role = await _roleManager.FindByNameAsync(roles.First());
                    ViewBag.VaiTro = role.Id;
                } else
                {
                    ViewBag.VaiTro = "";
                }
                ViewBag.DisplayName = user.DisplayName;
                ViewBag.Avatar = user.Avatar;
                
            }
            return View();
        }
    }
}
