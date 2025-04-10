namespace DATLICHKHAM.Domain
{
    public class DLK_BinhLuan
    {
        public int MaBinhLuan {  get; set; }
        public int MaBaiViet { get; set; }
        public int MaNguoiDung { get; set; }
        public string? NoiDung { get; set; }
        public DateTime? ThoiGianBinhLuan { get; set; }
        public bool TrangThai { get; set; }
        public bool TrangThaiDaXem {  get; set; }
    }
}
