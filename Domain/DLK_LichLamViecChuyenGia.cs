namespace DATLICHKHAM.Domain
{
    public class DLK_LichLamViecChuyenGia
    {
        public int MaLichLamViec {  get; set; }
        public int MaChuyenGia { get; set; }
        public DateTime Ngay {  get; set; }
        public string? ThoiGianLamViec { get; set; }
        public bool TrangThai { get; set; } 
    }
    public class DLK_LichLamViecChuyenGiaAdd
    {
        public int MaChuyenGia { get; set; }
        public DateTime? Ngay { get; set; }
        public string? ThoiGianLamViec { get; set; }

    }
}
