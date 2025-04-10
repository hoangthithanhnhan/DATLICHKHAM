namespace DATLICHKHAM.Domain
{
    public class DLK_ChungChiChuyenGia
    {
        public Guid MaChungChi { get; set; }
        public int MaChuyenGia { get; set; }
        public string? TenChungChi { get; set; }
        public DateTime? NgayCap { get; set; }
        public DateTime? NgayHetHan {  get; set; }
        public string? SoHieuChungChi { get; set; }
        public string? ToChucCap { get; set; }
    }
    public class DLK_ChungChiChuyenGiaAdd
    {
        public int MaChuyenGia { get; set; }
        public string? TenChungChi { get; set; }
        public DateTime? NgayCap { get; set; }
        public DateTime? NgayHetHan { get; set; }
        public string? SoHieuChungChi { get; set; }
        public string? ToChucCap { get; set; }
    }
}
