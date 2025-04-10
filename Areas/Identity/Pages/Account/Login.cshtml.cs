// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
#nullable disable

using System.ComponentModel.DataAnnotations;
using DATLICHKHAM.Models;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;


namespace QuanLyCayXanh.Areas.Identity.Pages.Account
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
            public string Email { get; set; }

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
                var user = await _userManager.FindByNameAsync(Input.Email);
                if (user != null)
                {
                    var result = await _signInManager.PasswordSignInAsync(Input.Email, Input.Password, true, lockoutOnFailure: false);
                    if (result.Succeeded)
                    {
                        _logger.LogInformation("Đăng nhập thành công");
                        return LocalRedirect(returnUrl);
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
                // If we got this far, something failed, redisplay form
                return Page();
            }
            return Page();
        }
    }
}
