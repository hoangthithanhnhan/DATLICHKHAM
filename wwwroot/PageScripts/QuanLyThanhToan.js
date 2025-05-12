$(document).ready(function () {
   
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
        "ajax": {
            url: APIURL + "/api/ChuyenMucApi/Gets",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: buildData,
            dataSrc: function (data) {
                var result = data.value
                if (result) {
                    for (let i = 0; i < result.length; i++) {
                        result[i].stt = i + 1;
                    }
                    return result;
                }
                return []

            }
        },
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
                    return data == 0 ? "<span class='text-blue'>Đã thanh toán</span>" : data == 1 ? "<span class='text-green'>Đã đặt cọc</span>" : "<span class='text-red'>Đã hoàn tiền cọc</span>";

                }
            },
            {
                targets: 8,
                render: function (data, type, row, meta) {
                    return `<button type="button" data-id="${meta.row}" class="button btn-update">
                                <img src="../images/view-detail.png" alt="Alternate Text" />
                            </button>`;

                }
            },
        ],
         "columns": [
            { data: "stt", "width": "60px", "className": "text-center" },
            { data: "NgayHen", "width": "160px", "className": "text-center" },
            { data: "ThoiGianHen", "width": "200px", "className": "text-center" },
            { data: "TenBenhNhan", "width": "250px", "className": "fw-bold" },
             { data: "TrangThai", "width": "150px", "className": "fw-bold text-center" },
            { data: "SoTienDatCoc", "width": "175px", "className": "text-right" },
            { data: "SoTienConLai", "width": "175px", "className": "text-right" },
            { data: "TongTien", "width": "200px", "className": "text-right" },
            { data: "MaHoaDon", "width": "auto", "className": "text-center" },
        ]
    })

   
})