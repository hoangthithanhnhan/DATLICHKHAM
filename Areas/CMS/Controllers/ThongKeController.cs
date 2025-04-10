using Microsoft.AspNetCore.Mvc;

namespace RouteLinks.Areas.CMS.Controllers
{
    [Area("CMS")]
    public class ThongKeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}