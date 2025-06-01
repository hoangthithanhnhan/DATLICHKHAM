let APIURL = window.location.origin;
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
            url: APIURL + `/api/TaiKhoanApi/Gets`,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataSrc: function (data) {
                console.log(data)
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
                targets: 3,
                render: function (data, type, row, meta) {
                    return data == 1 ? '<span class="text-pink">Quản trị viên</span>' : data == 2 ? '<span class="text-blue">Chuyên gia</span>' : '<span class="text-yellow">Bệnh nhân</span>';
                }
            },
            {
                targets: 4,
                render: function (data, type, row, meta) {
                    return data ? '<span class="text-green">Đang hoạt động</span>' : '<span class="text-red">Đã khóa</span>';
                }
            },
            {
                targets: 5,
                render: function (data, type, row, meta) {
                    return row.vaiTro != 1 ? `<button type="button" data-id="${meta.row}" class="button btn-status">
                                <img src="../images/${row.isEnabled ? 'lock.png' : 'unlock.png'}" alt="Alternate Text" />
                            </button> 
                            <button type="button" data-id="${meta.row}" class="button d-none btn-delete" data-bs-toggle="modal" data-bs-target="#modalDelete">
                                <img src="../images/delete_filled.png" alt="Alternate Text" />
                            </button>` : ""; 
                }
            }

        ],
        "columns": [
            { data: "stt", "width": "5%", "className": "text-center" },
            { data: "displayName", "width": "30%", "className": "fw-bold" },
            { data: "userName", "width": "25%", "className": "fw-bold" },
            { data: "vaiTro", "width": "15%", "className": "text-center fw-bold" },
            { data: "isEnabled", "width": "15%", "className": "text-center fw-bold" },
            { data: "id", "width": "10%", "className": "text-center" }
        ]
    })

    $("#myTable tbody").on('click','.btn-status', function () {
        let id = $(this).data("id");
        let data = $('#myTable').DataTable().row(id).data();
        let request = {
            id: data.id,
            isEnabled: !data.isEnabled
        }
        console.log(request)
        $.ajax({
            type: "PUT",
            url: APIURL + `/api/TaiKhoanApi/UpdateStatus`,
            data: JSON.stringify(request),
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data) {
                    showAlert("Cập nhật thành công", "success");
                    let keyword = $("#search").val();
                    $('#myTable').DataTable().ajax.url(APIURL + `/api/TaiKhoanApi/Gets?Keyword=${keyword}`).load();
                }
                else {
                    showAlert("Cập nhật không thành công", "danger");
                }
            },
            error: function (err) {
                showAlert("Đã có lỗi xảy ra!", "danger");
            }
        })
        console.log(data)
    })


    $("#btn-search").on('click', function () {
        let keyword = $("#search").val();
        $('#myTable').DataTable().ajax.url(APIURL + `/api/TaiKhoanApi/Gets?Keyword=${keyword}`).load();
    })


    //search khi enter
    $("#search").on('keyup', function (e) {
        if (e.keyCode === 13) {
            let keyword = $("#search").val();
            $('#myTable').DataTable().ajax.url(APIURL + `/api/TaiKhoanApi/Gets?Keyword=${keyword}`).load();
        }
    })
})