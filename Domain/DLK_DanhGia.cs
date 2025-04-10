namespace DATLICHKHAM.Domain
{
    public class DLK_DanhGia
    {
        public int MaDanhGia { get; set; }
        public int MaLichHen { get; set; }
        public string? NoiDung { get; set; }
        public DateTime? ThoiGianDanhGia { get; set; }
        public byte? SoSao {  get; set; }
        public bool TrangThai { get; set; }
    }
}
