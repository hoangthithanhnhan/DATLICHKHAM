let APIURL = window.location.origin;
$(document).ready(function () {
    //render bảng
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
            url: APIURL + `/api/ChuyenKhoaApi/Gets`,
             type: "GET",
             contentType: "application/json; charset=utf-8",
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
                    return data ? data : '--';
                }
            },
            {
                targets: 3,
                render: function (data, type, row, meta) {
                    return data ? '<span class="text-blue">Sử dụng</span>' : '<span class="text-red">Không sử dụng</span>';
                }
            },
            {
                targets: 4,
                render: function (data, type, row, meta) {
                    return `<button type="button" data-id="${meta.row}" class="button btn-update">
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
            { data: "tenChuyenKhoa", "width": "400px", "className": "fw-bold" },
            { data: "moTa", "width": "800px", "className": "" },
            { data: "trangThai", "width": "150px", "className": "text-center fw-bold" },
            { data: "maChuyenKhoa", "width": "auto", "className": "text-center fw-bold" }
        ]   
    })
    //add dữ liệu khi click button Lưu
    $("#saveData").on('click', function () {
        let tenChuyenKhoa = $("#tenChuyenKhoaAdd").val();
        let moTa = $("#moTaAdd").val();
        let trangThai = $("#suDungAdd").is(":checked");
        let request = {
            tenChuyenKhoa: tenChuyenKhoa,
            moTa: moTa,
            trangThai: Boolean(Number(trangThai))
        }
        if (checkEmptyString(tenChuyenKhoa)) {
            showAlert("Tên chuyên khoa không được để trống", "error");
            return;
        }
        else {
            $.ajax({
                type: "POST",
                url: APIURL + "/api/ChuyenKhoaApi/Add",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(request),
                success: function (data) {
                    $('#myTable').DataTable().ajax.reload();
                    $('#modalAdd').modal('hide'); 
                    showAlert("Thêm thành công", "success");
                    //Làm rỗng form sau khi thêm mới
                    resetForm()
                },
                error: function (error) {
                    showAlert("Thêm không thành công", "error");
                }
            });
        }
    })
    //update: lấy dữ liệu qua id KHI CLICK BUTTON UPDATE, gán vào các ô input
    $("#myTable tbody").on('click', '.btn-update' , function () {
        let id = $(this).data("id");
        let data = $('#myTable').DataTable().row(id).data();
        $("#tenChuyenKhoaEdit").val(data.tenChuyenKhoa);
        $("#moTaEdit").val(data.moTa);
        $("#maChuyenKhoaEdit").val(data.maChuyenKhoa);
        $("input[name='trangThaiEdit'][value='" + (data.trangThai ? 1 : 0) + "']").prop("checked", true);
        $('#modalEdit').modal('show');
    })
    //update dữ liệu khi click button Lưu
    $("#editData").on('click', function () {
        let maChuyenKhoa = $("#maChuyenKhoaEdit").val();
        let tenChuyenKhoa = $("#tenChuyenKhoaEdit").val();
        let trangThai = $("input[name='trangThaiEdit']:checked").val();
        let moTa = $("#moTaEdit").val();
        let request = {
            maChuyenKhoa: maChuyenKhoa,
            tenChuyenKhoa: tenChuyenKhoa,
            moTa: moTa,
            trangThai: Boolean(Number(trangThai))
        }
        if (tenChuyenKhoa.trim() != null && tenChuyenKhoa.trim() != "") {
            $.ajax({
                type: "PUT",
                url: APIURL + "/api/ChuyenKhoaApi/Update",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(request),
                success: function (data) {
                    $('#myTable').DataTable().ajax.reload();
                    $('#modalEdit').modal('hide');
                    showAlert("Cập nhật thành công", "success");
                },
                error: function (error) {
                    showAlert("Cập nhật không thành công", "error");
                }
            });
        }
    })
    //Delete: lấy dữ liệu qua id KHI CLICK BUTTON DELETE, gán vào các ô input được hidden
    $("#myTable tbody").on('click', '.btn-delete', function () {
        let id = $(this).data("id");
        let data = $('#myTable').DataTable().row(id).data();
        $("#maChuyenKhoaDelete").val(data.maChuyenKhoa);
        $('#modalDelete').modal('show');
    })
    //Delete dữ liệu khi click button Đồng ý xóa
    $("#deleteData").on('click', function () {
        let maChuyenKhoa = $("#maChuyenKhoaDelete").val();
        $.ajax({
            type: "DELETE",
            url: APIURL + `/api/ChuyenKhoaApi/Delete?maChuyenKhoa=${maChuyenKhoa}`,
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                $('#myTable').DataTable().ajax.reload();
                $('#modalDelete').modal('hide');
                if (data && data.isSuccess) { 
                    showAlert("Xóa thành công", "success");
                } else {
                    showAlert("Xóa không thành công", "error");
                }
            },
            error: function (error) {
                showAlert("Xóa không thành công", "error");

            }
        });
    })
    // clear value khi click button thêm mới
    $('#modalAdd').on('show.bs.modal', function () {
        resetForm();
    });
    //render lại bảng khi click button tìm kiếm
    $("#btn-search").on('click', function () {
        let keyword = $("#search").val();
        $('#myTable').DataTable().ajax.url(APIURL + `/api/ChuyenKhoaApi/Gets?filter=${keyword}`).load();
    })
    //render lại bảng khi nhấn phím Enter
    $("#search").on('keyup', function (e) {
        if (e.keyCode === 13) {
            let keyword = $("#search").val();
            $('#myTable').DataTable().ajax.url(APIURL + `/api/ChuyenKhoaApi/Gets?filter=${keyword}`).load();
        }
    })
})
//reset form
function resetForm() {
    $("#modalAdd input").val("");
    $("#modalAdd textarea").val("");
    $("input[name='trangThaiAdd'][value='1']").prop('checked', true);
}