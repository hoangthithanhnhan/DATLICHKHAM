namespace DATLICHKHAM.Domain
{
    public class DLK_ThongTinChanDoan
    {
        public int MaChanDoan { get; set; }
        public int MaLichHen { get; set; }
        public string TinhTrangHienTai { get; set; }
        public string ChanDoan { get; set; }
        public string HuongDieuTri { get; set; }
    }
    public class DLK_ThongTinChanDoanAdd
    {
        public int MaLichHen { get; set; }
        public string TinhTrangHienTai { get; set; }
        public string ChanDoan { get; set; }
        public string HuongDieuTri { get; set; }
    }
}
