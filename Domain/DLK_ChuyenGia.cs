namespace DATLICHKHAM.Domain
{
    public class DLK_ChuyenGia
    {
        public int MaChuyenGia { get; set; }
        public int MaNguoiDung { get; set; }
        public int MaChuyenKhoa { get; set; }
        public string TenChuyenKhoa { get; set; }
        public string? HoTen { get; set; }
        public string? ChucDanh { get; set; }
        public string? ChucVu { get; set; }
        public byte? GioiTinh { get; set; }
        public DateTime? NgaySinh { get; set; }
        public byte? SoNamKinhNghiem { get; set; }
        public string? GiaiThuong_NghienCuu { get; set; }
        public string? GioiThieu {  get; set; }
        public string? DonViCongTac {  get; set; }
        public string? KinhNghiem { get; set; }
        public string? DiaChi {  get; set; }
        public bool TrangThai { get; set; }
        public string AnhDaiDien { get; set; }
    }
    public class DLK_ChuyenGiaUpdate
    {
        public int MaChuyenGia { get; set; }
        public int MaChuyenKhoa { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string HoTen { get; set; }
        public string? ChucDanh { get; set; }
        public string? ChucVu { get; set; }
        public byte GioiTinh { get; set; }
        public DateTime NgaySinh { get; set; }
        public byte? SoNamKinhNghiem { get; set; }
        public string? GiaiThuong_NghienCuu { get; set; }
        public string? GioiThieu { get; set; }
        public string? DonViCongTac { get; set; }
        public string? KinhNghiem { get; set; }
        public string? DiaChi { get; set; }
        public bool TrangThai { get; set; }
        public string AnhDaiDien { get; set; }
    }

    public class DLK_ChuyenGiaAddInfo { 
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string HoTen { get; set; }
        public byte? GioiTinh { get; set; }
        public DateTime NgaySinh { get; set; }
        public long MaNguoiDung { get; set; }
    }
    public class DLK_ChuyenGiaRequestFilter{
        public string? Keyword { get; set; }
    }
}
