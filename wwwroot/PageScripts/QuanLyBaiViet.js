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
            "TenChuyenKhoa": "Tâm lý học lâm sàng",
            "MoTa": "Chuyên khoa Tư vấn & Trị liệu Tâm lý cho người lớn chuyên hỗ trợ các vấn đề về tâm lý, cảm xúc và sức khỏe tinh thần. Các bác sĩ và chuyên gia tư vấn giúp người bệnh vượt qua căng thẳng, lo âu, trầm cảm, rối loạn giấc ngủ và các khó khăn tâm lý khác thông qua liệu pháp tâm lý và hướng dẫn can thiệp phù hợp.",
            "TenChungChi": "Tin học ứng dụng",
            "NgayCap": "2025-03-12 10:09:07.4500000",
            "NgayHetHan": "2025-03-12 10:09:07.4500000",
            "SoHieuChungChi": "ABC/1234",
            "ToChucCap": "Hiệp hội y tế VN",
            "TieuDe": "Trầm cảm",
            "NguoiDang": "Thanh Nhàn",
            "NgayDang": "2025-03-12 10:09:07.4500000"
        }
    ]
    $('#myTable').DataTable({
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
                targets: 3,
                render: function (data, type, row, meta) {
                    return formatTime(data) +"<br>"+ formatDate(data);
                }
            },
            {
                targets: 4,
                render: function (data, type, row, meta) {
                    return data == 0 ? "<span class='text-pink'>Công khai</span>" : "<span class='text-blue'>Ẩn danh</span>";

                }
            },
            {
                targets: 5,
                render: function (data, type, row, meta) {
                    return `<button type="button" data-id="${meta.row}" class="button btn-view-image">
                                <img src="../images/view-image.png" alt="Alternate Text" />
                            </button> 
                            <button type="button" data-id="${meta.row}" class="button btn-update">
                                <img src="../images/edit_filled.png" alt="Alternate Text" />
                            </button> 
                            <button type="button" data-id="${meta.row}" class="button btn-delete" data-bs-toggle="modal" data-bs-target="#modalDelete">
                                <img src="../images/delete_filled.png" alt="Alternate Text" />
                            </button>`;
                }
            }

        ],
        "columns": [
            { data: "stt", "width": "60px", "className": "text-center" },
            { data: "TieuDe", "width": "600px", "className": "fw-bold" },
            { data: "NguoiDang", "width": "250px", "className": "text-center" },
            { data: "NgayDang", "width": "250px", "className": "text-center " },
            { data: "TrangThai", "width": "200px", "className": "text-center fw-bold" },
            { data: "stt", "width": "auto", "className": "text-center" }
        ]
    })

    $("#myTable tbody .btn-update").on('click', function () {
        let id = $(this).data("id");
        let data = $('#myTable').DataTable().row(id).data();
        console.log(data)
    })
})