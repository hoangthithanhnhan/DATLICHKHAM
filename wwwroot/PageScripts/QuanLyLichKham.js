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
            "NgayHen":"2025-03-12 10:09:07.4500000"
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
                targets: 1,
                render: function (data, type, row, meta) {
                    return formatDate(data);

                }
            },
            {
                targets: 4,
                render: function (data, type, row, meta) {
                    return `${row.ChucDanh} ${row.TenBacSi}`;

                }
            },
            {
                targets: 5,
                render: function (data, type, row, meta) {
                    return data == 0 ? "<span class='text-pink'>Trực tiếp</span>" : "<span class='text-blue'>Khám Online</span>";

                }
            },
            {
                targets: 6,
                render: function (data, type, row, meta) {
                    return data == 0 ? "<span class='text-blue'>Đã đặt lịch</span>" : data == 1 ? "<span class='text-green'>Hoàn thành</span>" : "<span class='text-red'>Đã hủy lịch</span>";

                }
            },
            {
                targets: 7,
                render: function (data, type, row, meta) {
                    return data != "" && data != null ? data : "--";

                }
            },
            {
                targets: 8,
                render: function (data, type, row, meta) {
                    return `<button type="button" data-id="${meta.row}" class="button btn-update">
                                <img src="../images/edit_filled.png" alt="Alternate Text" />
                            </button> 
                            <button type="button" data-id="${meta.row}" class="button btn-delete" data-bs-toggle="modal" data-bs-target="#modalDelete">
                                <img src="../images/delete_filled.png" alt="Alternate Text" />
                            </button>`;

                }
            },

        ],
        "columns": [
            { data: "stt", "width": "60px", "className": "text-center" },
            { data: "NgayHen", "width": "140px", "className": "text-center" },
            { data: "ThoiGianHen", "width": "200px", "className": "text-center" },
            { data: "TenBenhNhan", "width": "230px", "className": "fw-bold" },
            { data: "TenBacSi", "width": "230px", "className": "fw-bold" },
            { data: "HinhThucKham", "width": "150px", "className": "text-center fw-bold" },
            { data: "TrangThai", "width": "150px", "className": "text-center fw-bold" },
            { data: "LyDoHuyLich", "width": "auto", "className": "text-center" },
            { data: "MaLichHen", "width": "175px", "className": "text-center" },
        ]
    })

    $("#myTable tbody .btn-update").on('click', function () {
        let id = $(this).data("id");
        let data = $('#myTable').DataTable().row(id).data();
        console.log(data)
    })
})