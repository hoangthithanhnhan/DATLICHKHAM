using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace DATLICHKHAM.Models
{
    public class AppUser : IdentityUser<Int64>
    {
        public string? DisplayName { get; set; }
        public string? Bio { get; set; }
        public string? Address { get; set; } 
        public string? Avatar { get; set; }
        public int? GroupId { get; set; }
        public int? ChucDanhId { get; set; }
        public bool IsEnabled { get; set; } = true;
        [NotMapped]
        public byte? VaiTro { get; set; }
    }
}
