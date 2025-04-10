namespace DATLICHKHAM.Domain
{
    public class DLK_ChuyenKhoa
    {
        public int MaChuyenKhoa { get; set; }
        public string? TenChuyenKhoa { get; set; }
        public string? MoTa { get; set; }
        public bool TrangThai { get; set; }
    }
    public class DLK_ChuyenKhoaAdd
    {
        public string? TenChuyenKhoa { get; set; }
        public string? MoTa { get; set; }
        public bool TrangThai { get; set; }
    }
    public class DLK_ChuyenKhoaRequestFilter
    {
        public string? Keyword { get; set; }
    }
}
