using Microsoft.AspNetCore.Mvc;

namespace RouteLinks.Areas.CMS.Controllers
{
    [Area("CMS")]
    public class QuanLyChuyenKhoaController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}