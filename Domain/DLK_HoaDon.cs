namespace DATLICHKHAM.Domain
{
    public class DLK_HoaDon
    {
        public int MaHoaDon {  get; set; }
        public int MaLichHen { get; set; }
        public float? TongTien { get; set; }
        public byte TrangThai { get; set; }
    }
    public class DLK_HoaDonAdd
    {
        public int MaLichHen { get; set; }
        public float? TongTien { get; set; }
        public byte? TrangThai { get; set; }
    }
}
