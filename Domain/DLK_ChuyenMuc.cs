namespace DATLICHKHAM.Domain
{
    public class DLK_ChuyenMuc
    {
        public int MaChuyenMuc {  get; set; }
        public string? TenChuyenMuc { get; set; }
        public string? MoTa {  get; set; }
        public string? AnhDaiDien { get; set; }
        public bool TrangThai {  get; set; }
    }
    public class DLK_ChuyenMucAdd
    {
        public string? TenChuyenMuc { get; set; }
        public string? MoTa { get; set; }
        public string? AnhDaiDien { get; set; }
        public bool TrangThai { get; set; }
    }
    public class DLK_ChuyenMucRequestFilter
    {
        public string? Keyword { get; set; }
    }
}
