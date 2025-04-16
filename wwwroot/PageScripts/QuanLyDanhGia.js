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
            "ThoiGianDanhGia":"2025-03-12 10:09:07.4500000"
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
                targets: 2,
                render: function (data, type, row, meta) {
                    return data == 0 ? "<span class='text-pink'>Công khai</span>" : "<span class='text-blue'>Ẩn danh</span>";

                }
            },
            {
                targets: 4,
                render: function (data, type, row, meta) {
                    return formatDate(data)
                }
            },
            {
                targets: 6,
                render: function (data, type, row, meta) {
                    return `<button type="button" data-id="${meta.row}" class="button btn-replyrating" data-bs-toggle="modal" data-bs-target="#modalDelete">
                                <img src="../images/replyrating.png" alt="Alternate Text" />
                            </button>
                            <button type="button" data-id="${meta.row}" class="button btn-delete" data-bs-toggle="modal" data-bs-target="#modalDelete">
                                <img src="../images/delete_filled.png" alt="Alternate Text" />
                            </button>`;

                }
            },

        ],
        "columns": [
            { data: "stt", "width": "60px", "className": "text-center" },
            { data: "hoTen", "width": "250px", "className": "fw-bold" },
            { data: "trangThai", "width": "200px", "className": "text-center fw-bold" },
            { data: "soSao", "width": "100px", "className": "text-center" },
            { data: "thoiGianDanhGia", "width": "170px", "className": "text-center" },
            { data: "noiDung", "width": "600px", "className": "text-center" },
            { data: "thaoTac", "width": "auto", "className": "text-center" }
        ]
    })

    $("#myTable tbody .btn-update").on('click', function () {
        let id = $(this).data("id");
        let data = $('#myTable').DataTable().row(id).data();
        console.log(data)
    })
})