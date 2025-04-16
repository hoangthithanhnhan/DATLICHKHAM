using Microsoft.AspNetCore.Mvc;

namespace RouteLinks.Areas.CMS.Controllers
{
    [Area("CMS")]
    public class QuanLyHeThongController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}