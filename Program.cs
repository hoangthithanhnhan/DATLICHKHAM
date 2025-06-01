

using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

using Microsoft.AspNetCore.Authentication.Cookies;
using DATLICHKHAM.Application.ChuyenKhoa;
using DATLICHKHAM.Models;
using DATLICHKHAM.Persistence;

var builder = WebApplication.CreateBuilder(args);
// Connect Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<DataContext>(options => options.UseSqlServer(connectionString));



// Add services to the container.
//
builder.Services.AddRazorPages();

builder.Services.AddControllers();

builder.Services.AddMvc();
//dùng để gọi api từ tài nguyên khác khi bị dính cors
builder.Services.AddHttpClient();

builder.Services.AddControllersWithViews();

//Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();   

//builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddIdentityCore<AppUser>(opt =>
{
    opt.Password.RequireNonAlphanumeric = false;
});

builder.Services.AddIdentity<AppUser, AppRole>(config =>
{

})
    .AddEntityFrameworkStores<DataContext>()
    .AddDefaultTokenProviders();

builder.Services.AddHttpContextAccessor();
builder.Services.ConfigureApplicationCookie(config =>
{
    config.Cookie.Name = "Qlcxbt.Cookie";
    config.LoginPath = "/Identity/Account/Login";
    config.LogoutPath = "/Logout";
    config.AccessDeniedPath = "/AccessDenied";
    config.ExpireTimeSpan = TimeSpan.FromHours(1);
    config.SlidingExpiration = true;
});
builder.Services.AddMediatR(typeof(Add.Handler).Assembly);
#region JWT
builder.Services
    .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie();
#endregion


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}


app.UseHttpsRedirection();
app.UseStaticFiles();
//app.UseDefaultFiles();

app.UseRouting();
app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.UseDeveloperExceptionPage();
app.MapAreaControllerRoute(
    name: "CMS",
    areaName: "CMS",
    pattern: "cms/{controller=Home}/{action=Index}/{id?}"
);

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");

});
app.MapRazorPages();
app.MapControllers();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
    var mediator = app.Services.GetRequiredService<IMediator>();
    await context.Database.MigrateAsync();
}
catch (System.Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "Error");
    //throw;
}

app.Run();
