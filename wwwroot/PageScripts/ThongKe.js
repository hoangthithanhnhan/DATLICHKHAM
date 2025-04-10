$(document).ready(function () {
    let data = [
        {
            "stt": 1,
            "MaLichHen": 1,
            "ThoiGianHen": "07:00 - 08:00",
            "MaBenhNhan": 1,
            "TenBenhNhan": "Thanh Nn",
            "TenBacSi": "Võ Lê Bá Tùng",
            "HinhThucKham": 0,
            "TrangThai": 1,
            "LyDoHuyLich": null,
            "ChucDanh": "TS. BS.",
            "NgayHen": "2025-03-12 10:09:07.4500000",
            "SoSao": 4,
            "NoiDung": "Mình rất thích cách trang web này hoạt động. Giao diện dễ hiểu, đặt lịch nhanh chóng mà không cần gọi điện. Ngoài ra, tính năng nhắc nhở lịch khám giúp mình không bị quên. Tuy nhiên, nếu có thêm thông báo qua SMS thì sẽ tiện hơn.",
            "ThoiGianDanhGia": "2025-03-12 10:09:07.4500000",
            "ChucVu": "Chuyên viên tư vấn",
            "ChuyenKhoa": "Tâm lý học lâm sàng",
            "NgayPhep": "2025-03-12 10:09:07.4500000",
            "TongLichHen": 22,
            "DaKham": 12,
            "DaHuy": 2,
            "ChoKham":2,
            "DoanhThuTienMat": 2000,
            "ChuyenKhoan": 5220,
            "TongDoanhThu": 23924,
            "SoCaKham": 13,
            "SoCaHuy": 4234,
            "DanhGiaTrungBinh":14324
        }
    ]
    $('#lichHen').DataTable({
        dom: '<"top"f>rt<"bottom d-flex justify-content-end" lp>',
        "pageLength": 10,
        "autoWidth": false,
        "ordering": false,
        "bInfo": false,
        "bDestroy": true,
        searching: false,
        lengthMenu: [
            [10, 20, 50, 100],
            [10, 20, 50, 100]
        ],
        language: {
            "sProcessing": "Đang xử lý...",
            "sLengthMenu": "_MENU_",
            "sZeroRecords": "Không có dữ liệu",
            "sEmptyTable": "Bảng trống",
            "sInfo": "Hiện dòng _START_ đến _END_ trong tổng _TOTAL_ dòng",
            "sInfoEmpty": "Hiện dòng 0 đến 0 trong tổng 0 dòng",
            "sSearch": "Tìm kiếm",
            "sLoadingRecords": "Đang tải...",
            "paginate": {
                "first": '<img src="../images/arrow_previous.png" />',
                "previous": '<img src="../images/chevron_left.png" />',
                "next": '<img src="../images/chevron_right.png" />',
                "last": '<img src="../images/arrow_next.png" />'
            }
        },
        "data": data,
        "columnDefs": [
            {
                targets: 1,
                render: function (data, type, row, meta) {
                    return formatDate(data);
                }
            }
        ],
        "columns": [
            { data: "stt", "width": "60px", "className": "text-center" },
            { data: "NgayHen", "width": "350px", "className": "fw-bold text-center" },
            { data: "TongLichHen", "width": "280px", "className": "text-right" },
            { data: "DaKham", "width": "280px", "className": "text-right" },
            { data: "DaHuy", "width": "280px", "className": "text-right" },
            { data: "ChoKham", "width": "280px", "className": "text-right" }
        ]
    })
    $('#doanhThu').DataTable({
        dom: '<"top"f>rt<"bottom d-flex justify-content-end" lp>',
        "pageLength": 10,
        "autoWidth": false,
        "ordering": false,
        "bInfo": false,
        "bDestroy": true,
        searching: false,
        lengthMenu: [
            [10, 20, 50, 100],
            [10, 20, 50, 100]
        ],
        language: {
            "sProcessing": "Đang xử lý...",
            "sLengthMenu": "_MENU_",
            "sZeroRecords": "Không có dữ liệu",
            "sEmptyTable": "Bảng trống",
            "sInfo": "Hiện dòng _START_ đến _END_ trong tổng _TOTAL_ dòng",
            "sInfoEmpty": "Hiện dòng 0 đến 0 trong tổng 0 dòng",
            "sSearch": "Tìm kiếm",
            "sLoadingRecords": "Đang tải...",
            "paginate": {
                "first": '<img src="../images/arrow_previous.png" />',
                "previous": '<img src="../images/chevron_left.png" />',
                "next": '<img src="../images/chevron_right.png" />',
                "last": '<img src="../images/arrow_next.png" />'
            }
        },
        "data": data,
        "columnDefs": [
            {
                targets: 1,
                render: function (data, type, row, meta) {
                    return formatDate(data);
                }
            }
        ],
        "columns": [
            { data: "stt", "width": "60px", "className": "text-center" },
            { data: "NgayHen", "width": "350px", "className": "fw-bold text-center" },
            { data: "DoanhThuTienMat", "width": "375px", "className": "text-right" },
            { data: "ChuyenKhoan", "width": "375px", "className": "text-right" },
            { data: "TongDoanhThu", "width": "auto", "className": "text-right" }
        ]
    })
    $('#bacSi').DataTable({
        dom: '<"top"f>rt<"bottom d-flex justify-content-end" lp>',
        "pageLength": 10,
        "autoWidth": false,
        "ordering": false,
        "bInfo": false,
        "bDestroy": true,
        searching: false,
        lengthMenu: [
            [10, 20, 50, 100],
            [10, 20, 50, 100]
        ],
        language: {
            "sProcessing": "Đang xử lý...",
            "sLengthMenu": "_MENU_",
            "sZeroRecords": "Không có dữ liệu",
            "sEmptyTable": "Bảng trống",
            "sInfo": "Hiện dòng _START_ đến _END_ trong tổng _TOTAL_ dòng",
            "sInfoEmpty": "Hiện dòng 0 đến 0 trong tổng 0 dòng",
            "sSearch": "Tìm kiếm",
            "sLoadingRecords": "Đang tải...",
            "paginate": {
                "first": '<img src="../images/arrow_previous.png" />',
                "previous": '<img src="../images/chevron_left.png" />',
                "next": '<img src="../images/chevron_right.png" />',
                "last": '<img src="../images/arrow_next.png" />'
            }
        },
        "data": data,
        "columnDefs": [
        ],
        "columns": [
            { data: "stt", "width": "60px", "className": "text-center" },
            { data: "TenBacSi", "width": "350px", "className": "fw-bold text-center" },
            { data: "SoCaKham", "width": "375px", "className": "text-right" },
            { data: "SoCaHuy", "width": "375px", "className": "text-right" },
            { data: "DanhGiaTrungBinh", "width": "auto", "className": "text-right" }
        ]
    })

    $("#myTable tbody .btn-update").on('click', function () {
        let id = $(this).data("id");
        let data = $('#myTable').DataTable().row(id).data();
        console.log(data)
    })
})