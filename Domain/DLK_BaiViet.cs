namespace DATLICHKHAM.Domain
{
    public class DLK_BaiViet
    {
        public int MaBaiViet { get; set; }
        public int MaNguoiDung { get; set; }
        public int MaChuyenMuc { get; set; }
        public string? TieuDe {  get; set; }
        public string? NoiDung { get; set; }
        public DateTime? ThoiGianDangBai { get; set; }
        public bool TrangThai {  get; set; }
        public string? AnhDaiDien {  get; set; }
        public string? TomTat {  get; set; }
    }
}
