using Microsoft.AspNetCore.Mvc;

namespace RouteLinks.Areas.CMS.Controllers
{
    [Area("CMS")]
    public class QuanLyDichVuController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}