namespace DATLICHKHAM.Domain
{
    public class DLK_DanhGia
    {
        public int MaDanhGia { get; set; }
        public int MaLichHen { get; set; }
        public string? HoTen { get; set; }
        public string? NoiDung { get; set; }
        public DateTime? ThoiGianDanhGia { get; set; }
        public byte? SoSao {  get; set; }
    }
    public class DLK_DanhGiaAdd
    {
        public int MaLichHen { get; set; }
        public string? NoiDung { get; set; }
        public byte? SoSao { get; set; }
    }
    public class DLK_DanhGiaRequestFilter
    {
        public string? Keyword { get; set; }
    }
}
