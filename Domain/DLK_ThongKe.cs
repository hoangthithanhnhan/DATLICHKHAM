namespace DATLICHKHAM.Domain
{
    public class DLK_ThongKe
    {
        public int TongSoBenhNhan { get; set; }
        public int TongSoChuyenGia { get; set; }
        public int TongSoLichHen { get; set; }
        public int LichHenHomNay { get; set; }
    }
    public class DLK_ThongKe_DoanhThu
    {
        public int Thang { get; set; }
        public float TongDoanhThu { get; set; }
    }
    public class DLK_ThongKe_LichHen
    {
        public int Thang { get; set; }
        public int DaDat { get; set; }
        public int DaHuy { get; set; }
    }
    public class DLK_ThongKe_DichVu
    {
        public string TenDichVu { get; set; }
        public int DoanhThu { get; set; }
    }
    public class DLK_ThongKe_ChuyenGia
    {
        public string HoTen { get; set; }
        public int SoLanDat { get; set; }
        public string Avatar { get; set; }
    }
    public class DLK_ThongKe_DanhGia
    {
        public string HoTen { get; set; }
        public string NoiDung { get; set; }
        public int SoSao { get; set; }
    }
}
