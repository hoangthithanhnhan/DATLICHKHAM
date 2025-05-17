using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using DATLICHKHAM.Models;
using MediatR;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;

namespace DATLICHKHAM.Controllers
{
    public class ThongTinCaNhanChuyenGiaController : Controller
    {
        private readonly ILogger<ThongTinCaNhanChuyenGiaController> _logger;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMediator _mediator;

        public ThongTinCaNhanChuyenGiaController(ILogger<ThongTinCaNhanChuyenGiaController> logger, UserManager<AppUser> userManager, IMediator mediator)
        {
            _logger = logger;
            _userManager = userManager;
            _mediator = mediator;
        }

        public async Task<IActionResult> Index()
        {
            var userCurrent = (ClaimsIdentity)User.Identity;
            var user = userCurrent != null && userCurrent.Name != null ? await _userManager.FindByNameAsync(userCurrent.Name) : null;
            if (user != null)
            {
                var chuyenGiaInfo = await _mediator.Send(new Application.ChuyenGia.Get.Query { MaChuyenGia = null, MaNguoiDung = user.Id.ToString() });
                if (chuyenGiaInfo.IsSuccess)
                {
                    ViewBag.MaChuyenGia = chuyenGiaInfo.Value?.MaChuyenGia;
                }
            }
            return View();
        }
    }
}
