

namespace DATLICHKHAM.Domain
{
    public class DLK_DichVu
    {
        public int MaDichVu { get; set; }
        public string? TenDichVu { get; set; }
        public string? MoTa {  get; set; }
        public bool TrangThai { get; set; }
        public float? GiaDichVu { get; set; }
        public string? AnhDaiDien {  get; set; }
    }
    public class DLK_DichVuAdd
    {
        public string? TenDichVu { get; set; }
        public string? MoTa { get; set; }
        public bool TrangThai { get; set; }
        public float? GiaDichVu { get; set; }
        public string? AnhDaiDien { get; set; }
    }
}
