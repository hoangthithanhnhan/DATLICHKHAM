using System.ComponentModel.DataAnnotations;
using DATLICHKHAM.Models;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;


namespace Login.Areas.Identity.Pages.Account
{
    public class LoginModel : PageModel
    {
        private readonly SignInManager<AppUser> _signInManager;
        private readonly UserManager<AppUser> _userManager;
        private readonly IUserStore<AppUser> _userStore;
        private readonly IUserEmailStore<AppUser> _emailStore;
        private readonly ILogger<LoginModel> _logger;
        private readonly IConfiguration _configuration;
        private readonly IMediator _mediator;
        private readonly RoleManager<AppRole> _roleManager;

        public LoginModel(SignInManager<AppUser> signInManager, ILogger<LoginModel> logger, UserManager<AppUser> userManager, IUserStore<AppUser> userStore, IConfiguration configuration, IMediator mediator, RoleManager<AppRole> roleManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _userStore = userStore;
            _configuration = configuration;
            _logger = logger;
            _mediator = mediator;
            _roleManager = roleManager;
        }

        [BindProperty]
        public InputModel Input { get; set; }

        public IList<AuthenticationScheme> ExternalLogins { get; set; }

        public string ReturnUrl { get; set; }

        [TempData]
        public string ErrorMessage { get; set; }

        public class InputModel
        {

            [Required(ErrorMessage = "Tài khoản không được bỏ trống!")]
            public string Username { get; set; }

            [Required(ErrorMessage = "Mật khẩu không được bỏ trống!")]

            [DataType(DataType.Password)]
            public string Password { get; set; }
            public int SSO { get; set; }
        }

        public async Task OnGetAsync(string returnUrl = null)
        {
            if (!string.IsNullOrEmpty(ErrorMessage))
            {
                ModelState.AddModelError(string.Empty, ErrorMessage);
            }

            returnUrl ??= Url.Content("~/");

            await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);

            ExternalLogins = (await _signInManager.GetExternalAuthenticationSchemesAsync()).ToList();

            ReturnUrl = returnUrl;
        }

        public async Task<IActionResult> OnPostAsync(string returnUrl = null)
        {
            returnUrl ??= Url.Content("~/CMS");

            ExternalLogins = (await _signInManager.GetExternalAuthenticationSchemesAsync()).ToList();

            if (ModelState.IsValid)
            {
                var user = await _userManager.FindByNameAsync(Input.Username);

                if (user != null)
                {
                    if (!user.IsEnabled)
                    {
                        _logger.LogWarning("Tài khoản của bạn bị khoá!");
                        ModelState.AddModelError(string.Empty, "Tài khoản của bạn bị khoá!");
                        return Page();
                    }
                    else
                    {
                        var result = await _signInManager.PasswordSignInAsync(Input.Username, Input.Password, true, lockoutOnFailure: false);
                        if (result.Succeeded)
                        {
                            var checkRole = await _userManager.IsInRoleAsync(user, "Admin");
                            //VaiTro ==0 là Admin, sẽ điều hướng đến trang quản trị
                            if (checkRole)
                            {
                                return LocalRedirect(returnUrl);
                            }
                            else
                            {
                                return LocalRedirect("~/");
                            }

                        }
                        if (result.RequiresTwoFactor)
                        {
                            return RedirectToPage("./LoginWith2fa", new { ReturnUrl = returnUrl, RememberMe = true });
                        }
                        if (result.IsLockedOut)
                        {
                            _logger.LogWarning("Tài khoản của bạn bị khoá!");
                            return RedirectToPage("./Login");
                        }
                        else
                        {
                            ModelState.AddModelError(string.Empty, "Sai tên đăng nhập hoặc mật khẩu!");
                            return Page();
                        }
                    }
                }
                return Page();
            }
            return Page();
        }
    }
}
