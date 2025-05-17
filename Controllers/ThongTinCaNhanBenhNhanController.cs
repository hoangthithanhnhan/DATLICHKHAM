using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using DATLICHKHAM.Models;
using MediatR;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;

namespace DATLICHKHAM.Controllers
{
    public class ThongTinCaNhanBenhNhanController : Controller
    {
        private readonly ILogger<ThongTinCaNhanBenhNhanController> _logger;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMediator _mediator;

        public ThongTinCaNhanBenhNhanController(ILogger<ThongTinCaNhanBenhNhanController> logger, UserManager<AppUser> userManager, IMediator mediator)
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
                var benhNhanInfo = await _mediator.Send(new Application.BenhNhan.Get.Query { MaBenhNhan = null, MaNguoiDung = user.Id.ToString() });
                if (benhNhanInfo.IsSuccess)
                {
                    ViewBag.MaBenhNhan = benhNhanInfo.Value?.MaBenhNhan;
                }
            }
            return View();
        }
    }
}
