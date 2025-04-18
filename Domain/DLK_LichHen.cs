﻿namespace DATLICHKHAM.Domain
{
    public class DLK_LichHen
    {
        public int MaLichHen { get; set; }
        public int MaChuyenGia { get; set; }
        public int MaBenhNhan {  get; set; }
        public DateTime? NgayHen { get; set; }
        public string? ThoiGianHen { get; set; }
        public byte? TrangThai { get; set; }
        public bool HinhThucKham { get; set; }
        public string? LyDoHuyLich {  get; set; }
        public string? GhiChu {  get; set; }
    }
    public class DLK_LichHenAdd
    {
        public int MaChuyenGia { get; set; }
        public int MaBenhNhan { get; set; }
        public DateTime? NgayHen { get; set; }
        public string? ThoiGianHen { get; set; }
        public byte? TrangThai { get; set; }
        public bool HinhThucKham { get; set; }
        public string? LyDoHuyLich { get; set; }
        public string? GhiChu { get; set; }
    }
}
