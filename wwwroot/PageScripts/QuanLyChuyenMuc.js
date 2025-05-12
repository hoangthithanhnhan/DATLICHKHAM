let APIURL = window.location.origin;
$(document).ready(function () {
    //keyword ở ô input tìm kiếm
    function buildData() {
        let keyword = $('#search').val();
        let request = {
            keyword: keyword,
        }
        return JSON.stringify(request);
    }
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
                targets: 2,
                render: function (data, type, row, meta) {
                    return data ? data : "--";
                }
            },
            {
                targets: 3,
                render: function (data, type, row, meta) {
                    return data ? `<img class='anhDaiDien' src='${APIURL}/${data}' alt='Alternate Text' />` : "<img class='anhDaiDien' src='../images/null-image.jpg' alt='Alternate Text' />";
                }
            },
            {
                targets: 4,
                render: function (data, type, row, meta) {
                    return data ? "<span class='text-blue'>Sử dụng</span>" : "<span class='text-red'>Không sử dụng</span>";
                }
            },
            {
                targets: 5,
                render: function (data, type, row, meta) {
                    return `
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
            { data: "tenChuyenMuc", "width": "300px", "className": "fw-bold" },
            { data: "moTa", "width": "auto", "className": "" },
            { data: "anhDaiDien", "width": "200px", "className": "text-center" },
            { data: "trangThai", "width": "200px", "className": "text-center fw-bold" },
            { data: "stt", "width": "175px", "className": "text-center" }
        ]
    })
    //add dữ liệu khi click button Lưu
    $("#saveData").on('click', function () {
        let tenChuyenMuc = $("#tenChuyenMucAdd").val();
        let moTa = $("#moTaAdd").val();
        let trangThai = $("#suDungAdd").is(":checked");
        let file = $("#anhDaiDienChuyenMucAdd")[0].files[0];
        let request = {
            tenChuyenMuc: tenChuyenMuc,
            moTa: moTa,
            trangThai: trangThai
        }
        let formData = new FormData();
        formData.append("file", file);
        formData.append("data", JSON.stringify(request));
        if (checkEmptyString(tenChuyenMuc)) {
            showAlert("Tên chuyên mục không được để trống", "error");
            return;
        }
        else {
            $.ajax({
                type: "POST",
                url: APIURL + "/api/ChuyenMucApi/Add",
                processData: false,
                contentType: false,
                async: false,
                data: formData,
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
    $("#myTable tbody").on('click', '.btn-update', function () {
        let id = $(this).data("id");
        let data = $('#myTable').DataTable().row(id).data();
        $("#maChuyenMucEdit").val(data.maChuyenMuc);
        $("#tenChuyenMucEdit").val(data.tenChuyenMuc);
        $("#moTaEdit").val(data.moTa);
        $("input[name='trangThaiEdit'][value='" + (data.trangThai ? 1 : 0) + "']").prop("checked", true);

        if (data.anhDaiDien != null && data.anhDaiDien != "") {
            $("#currentAnhDaiDienEdit").attr("src", `${APIURL}/` + data.anhDaiDien);
            $("#anhDaiDienNull").show(); //nếu có ảnh đại diện thì cho xem preview
            $("#maChuyenMucDeleteAnh").val(data.maChuyenMuc);
        } else {
            $("#anhDaiDienNull").hide();
            $("#maChuyenMucDeleteAnh").val("");
        };
        $("#anhDaiDienChuyenMucEdit").val("");
        $('#modalEdit').modal('show');
    })

    //update dữ liệu khi click button Lưu
    $("#editData").on('click', function () {
        let maChuyenMuc = $("#maChuyenMucEdit").val();
        let tenChuyenMuc = $("#tenChuyenMucEdit").val();
        let moTa = $("#moTaEdit").val();
        let trangThai = $("input[name='trangThaiEdit']:checked").val();
        let fileInput = $("#anhDaiDienChuyenMucEdit")[0];
        let file = fileInput.files[0];
        let request = {
            maChuyenMuc: maChuyenMuc,
            tenChuyenMuc: tenChuyenMuc,
            moTa: moTa,
            trangThai: Boolean(Number(trangThai))
        }
        let formData = new FormData();
        formData.append("data", JSON.stringify(request)); // dữ liệu dạng object
        if (file) {
            formData.append("file", file); // ảnh nếu có
        }

        if (checkEmptyString(tenChuyenMuc)) {
            showAlert("Tên chuyên mục không được để trống", "error");
            return;
        }
        else {
            $.ajax({
                type: "PUT",
                url: APIURL + "/api/ChuyenMucApi/Update",
                processData: false,  // Không xử lý dữ liệu thành query string
                contentType: false,  // Không đặt Content-Type, để browser tự thêm multipart
                data: formData,
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


    //lấy Mã chuyên mục khi click button xóa
    $("#myTable tbody").on('click', '.btn-delete', function () {
        let id = $(this).data("id");
        let data = $('#myTable').DataTable().row(id).data();
        $("#maChuyenMucDelete").val(data.maChuyenMuc);
        $('#modalDelete').modal('show');
    })


    //xóa dữ liệu khi click button đồng ý
    $("#deleteData").on('click', function () {
        let maChuyenMuc = $("#maChuyenMucDelete").val();
        $.ajax({
            type: "DELETE",
            url: APIURL + `/api/ChuyenMucApi/Delete?MaChuyenMuc=${maChuyenMuc}`,
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


    $('#btn-deleteAnhDaiDien').on('click', function () {
        $("#modalDeleteAnhDaiDien").modal('show');
    });

    $("#deleteAnhDaiDien").on('click', function () { //chỉ xóa ảnh đại diện
        let maChuyenMuc = $("#maChuyenMucDeleteAnh").val();
        if (maChuyenMuc != "") {
            $.ajax({
                type: "DELETE",
                url: APIURL + `/api/ChuyenMucApi/DeleteAnhDaiDien?MaChuyenMuc=${maChuyenMuc}`,
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (data && data.isSuccess) {
                        $('#myTable').DataTable().ajax.reload();
                        showAlert("Xóa thành công", "success");
                        $('#modalDeleteAnhDaiDien').modal('hide');
                        $("#anhDaiDienNull").hide();
                    } else {
                        showAlert("Xóa không thành công", "error");
                        $('#modalDeleteAnhDaiDien').modal('hide');
                    }
                },
                error: function (error) {
                    showAlert("Xóa không thành công", "error");
                },

            });
        }
    })


    // clear value khi click button thêm mới
    $('#modalAdd').on('show.bs.modal', function () {
        resetForm();
    });


    //search khi click button tìm kiếm
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
function resetForm() {
    $("#modalAdd input:not([type='radio'])").val("");
    $("#modalAdd textarea").val("");
    $("#modalAdd input[name='trangThaiAdd'][value='1']").prop('checked', true);
}