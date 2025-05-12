let APIURL = window.location.origin;
$(document).ready(function () {
    function buildData() {
        let keyword = $('#search').val();
        let request = {
            keyword: keyword,
        }
        return JSON.stringify(request);
    }


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
            url: APIURL + "/api/DanhGiaApi/Gets",
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
                targets: 2,
                render: function (data, type, row, meta) {
                    return ratingstar(data);

                }
            },
            {
                targets: 4,
                render: function (data, type, row, meta) {
                    return formatDate(data)
                }
            },
            {
                targets: 5,
                render: function (data, type, row, meta) {
                    return `
                            <button type="button" data-id="${meta.row}" class="button btn-delete" data-bs-toggle="modal" data-bs-target="#modalDelete">
                                <img src="../images/delete_filled.png" alt="Alternate Text" />
                            </button>`;

                }
            }

        ],
        "columns": [
            { data: "stt", "width": "60px", "className": "text-center" },
            { data: "hoTen", "width": "250px", "className": "fw-bold" },
            { data: "soSao", "width": "300px", "className": "text-center" },
            { data: "noiDung", "width": "400px", "className": "" },
            { data: "thoiGianDanhGia", "width": "300px", "className": "text-center" },
            { data: "maDanhGia", "width": "auto", "className": "text-center" }
        ]
    })

    $(document).on('click', '.btn-delete', function () {
        let id = $(this).data("id");
        let data = $('#myTable').DataTable().row(id).data();
        $("#maDanhGiaDelete").val(data.maDanhGia);
        $('#modalDelete').modal('show');
    })

    $('#deleteData').click(function () {
        let maDanhGia = $("#maDanhGiaDelete").val();
        $.ajax({
            type: "DELETE",
            url: APIURL + `/api/DanhGiaApi/Delete?maDanhGia=${maDanhGia}`,
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                $('#myTable').DataTable().ajax.reload();
                if (data && data.isSuccess) {
                    showAlert("Xóa thành công", "success");
                    $('#modalDelete').modal('hide');
                } else {
                    showAlert("Xóa không thành công", "error");
                    $('#modalDelete').modal('hide');
                }
            },
            error: function (error) {
                showAlert("Xóa không thành công", "error");

            }
        });
    })

    $("#btn-search").on('click', function () {
        $('#myTable').DataTable().ajax.reload();
    })


    //search khi enter
    $("#search").on('keyup', function (e) {
        if (e.keyCode === 13) {
            $('#myTable').DataTable().ajax.reload();
        }
    })

})

function ratingstar(soSao) {
    let html = '<span class="text-warning">';
    for (let i = 0; i < soSao; i++) {
        html += `&#9733;`;
    }
    html += '</span>';
    return html;
}
