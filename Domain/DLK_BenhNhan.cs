namespace DATLICHKHAM.Domain
{
    public class DLK_BenhNhan
    {
        public int MaBenhNhan { get; set; }
        public long MaNguoiDung {  get; set; }
        public string HoTen {  get; set; }
        public DateTime NgayTao { get; set; }
        public bool TrangThai {  get; set; }
        public byte? GioiTinh {  get; set; }
        public DateTime? NgaySinh { get; set; }
        public string? DiaChi { get; set; }
        public string? TienSuBenh { get; set; }
        public string? ThoiQuenSinhHoat { get; set; }
        public string? GhiChuKhac { get; set; }
        public string? NgheNghiep {  get; set; }
        public string? TinhTrangHonNhan { get; set; }
        public string? ThuocDangDung { get; set; }
        public string? LyDo { get; set; }
        public string SoDienThoai { get; set; }
        public string? Email { get; set; }
        public string? AnhDaiDien { get; set; }

    }
    public class DLK_BenhNhanAddInfo
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string? Email { get; set; }
        public string HoTen { get; set; }
        public string SoDienThoai { get; set; }
        public long MaNguoiDung { get; set; }
        public byte? GioiTinh { get; set; }
        public DateTime? NgaySinh { get; set; }
        public string? DiaChi { get; set; }
        public string? TienSuBenh { get; set; }
        public string? ThoiQuenSinhHoat { get; set; }
        public string? GhiChuKhac { get; set; }
        public string? NgheNghiep { get; set; }
        public string? TinhTrangHonNhan { get; set; }
        public string? ThuocDangDung { get; set; }
        public string? LyDo { get; set; }
        public bool TrangThai { get; set; }
        public string? AnhDaiDien { get; set; }
    }
    public class DLK_BenhNhanRequestFilter
    {
        public string? Keyword { get; set; }
    }
}
