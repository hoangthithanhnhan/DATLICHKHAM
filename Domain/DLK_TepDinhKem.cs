namespace DATLICHKHAM.Domain
{
    public class DLK_TepDinhKem
    {
        public int MaTepDinhKem { get; set; }
        public Guid MaDoiTuong { get; set; }
        public string? DuongDan {  get; set; }
        public DateTime? NgayCapNhat { get; set; }
        public string? TenFile { get; set; }
    }

    public class DLK_TepDinhKemAddModel
    {
        public Guid MaDoiTuong { get; set; }
        public string? DuongDan { get; set; }
        public string? TenFile { get; set; }
    }
}
