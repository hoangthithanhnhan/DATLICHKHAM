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

    //đổ dữ liệu vào select2 CHUYÊN MỤC
    $.ajax({
        url: APIURL + `/api/ChuyenMucApi/Gets`,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ trangThai: true }), // gửi đúng format JSON body
        success: function (data) {
            if (data && data.isSuccess) {
                if (data.value && data.value.length > 0) {
                    let html = "<option value=''>Chọn chuyên mục</option>";

                    $.each(data.value, function (index, item) {
                        html += `<option value="${item.maChuyenMuc}">${item.tenChuyenMuc}</option>`;
                    });

                    $("#chuyenMucAdd").html(html);
                    $("#chuyenMucEdit").html(html);

                    $('#chuyenMucAdd').select2({
                        width: "100%",
                        minimumResultsForSearch: Infinity
                    });

                    $('#chuyenMucEdit').select2({
                        width: "100%",
                        minimumResultsForSearch: Infinity
                    });
                }
            }
        },
        error: function (xhr) {
            console.error("Lỗi khi gọi API chuyên mục:", xhr);
        }
    });

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
            url: APIURL + "/api/BaiVietApi/Gets",
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
                targets: 3,
                render: function (data, type, row, meta) {
                    return formatTime(data) + "<br>" +formatDate(data)
                }
            },
            {
                targets: 4,
                render: function (data, type, row, meta) {
                    return data == 1 ? "<span class='text-pink'>Công khai</span>" : "<span class='text-blue'>Ẩn danh</span>";

                }
            },
            {
                targets: 5,
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
            { data: "tieuDe", "width": "600px", "className": "fw-bold" },
            { data: "nguoiDang", "width": "250px", "className": "text-center" },
            { data: "thoiGianDangBai", "width": "250px", "className": "text-center" },
            { data: "trangThai", "width": "200px", "className": "text-center fw-bold" },
            { data: "maBaiViet", "width": "auto", "className": "text-center" }
        ]
    })

    $('#saveData').on('click', function () {
        let machuyenMuc = $('#chuyenMucAdd').val();
        let tieuDe = $('#tieuDeAdd').val();
        let tomTat = $('#tomTatAdd').val();
        let noiDung = editorThemMoiInstance.getData();
        let trangThai = $("#congKhaiAdd").is(":checked");
        let file = $("#anhDaiDienBaiVietAdd")[0].files[0];
        let request = {
            machuyenMuc: machuyenMuc,
            tieuDe: tieuDe,
            tomTat: tomTat,
            noiDung: noiDung,
            trangThai: trangThai,
        }
        console.log(request)
        let formData = new FormData();
        formData.append("file", file);
        formData.append("data", JSON.stringify(request));
        console.log(formData)
        if (checkEmptyString(machuyenMuc)) {
            showAlert("Chuyên mục bài viết không được để trống", "error");
            return;
        }
        if (checkEmptyString(tieuDe)) {
            showAlert("Tiêu đề bài viết không được để trống", "error");
            return;
        }
        if (checkEmptyString(noiDung)) {
            showAlert("Nội dung bài viết không được để trống", "error");
            return;
        }
        else {
            $.ajax({
                type: "POST",
                url: APIURL + "/api/BaiVietApi/Add",
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

    // clear value khi click button thêm mới
    $('#modalAdd').on('show.bs.modal', function () {
        resetForm();
    });

    //click button edit và lấy value
    $("#myTable tbody").on('click','.btn-update', function () {
        let id = $(this).data("id");
        let data = $('#myTable').DataTable().row(id).data();
        $('#maBaiVietEdit').val(data.maBaiViet);
        $('#chuyenMucEdit').val(data.maChuyenMuc).trigger("change");
        $('#tieuDeEdit').val(data.tieuDe);
        $('#tomTatEdit').val(data.tomTat);
        editorEditInstance.setData(data.noiDung);
        $("input[name='trangThaiEdit'][value='" + (data.trangThai ? 1 : 0) + "']").prop("checked", true);
        $('#modalEdit').modal('show');

        if (data.anhDaiDien != null && data.anhDaiDien != "") {
            $("#currentAnhDaiDienEdit").attr("src", `${APIURL}/` + data.anhDaiDien);
            $("#anhDaiDienNull").show(); //nếu có ảnh đại diện thì cho xem preview
            $("#maBaiVietDeleteAnh").val(data.maBaiViet);
        } else {
            $("#anhDaiDienNull").hide();
            $("#maBaiVietDeleteAnh").val("");
        };
        $("#anhDaiDienBaiVietEdit").val("");
        $('#modalEdit').modal('show');
    })

    //update dữ liệu khi click button Lưu
    $("#editData").on('click', function () {
        let maBaiViet = $("#maBaiVietEdit").val();
        let maChuyenMuc = $("#chuyenMucEdit").val();
        let tieuDe = $("#chuyenMucEdit").val();
        let tomTat = $("#tomTatEdit").val();
        let noiDung = editorEditInstance.getData();
        let trangThai = $("input[name='trangThaiEdit']:checked").val();
        let fileInput = $("#anhDaiDienBaiVietEdit")[0];
        let file = fileInput.files[0];
        let request = {
            maBaiViet: maBaiViet,
            maChuyenMuc: maChuyenMuc,
            tieuDe: tieuDe,
            tomTat: tomTat,
            noiDung: noiDung,
            trangThai: Boolean(Number(trangThai))
        }
        let formData = new FormData();
        formData.append("data", JSON.stringify(request)); // dữ liệu dạng object
        if (file) {
            formData.append("file", file); // ảnh nếu có
        }

        if (checkEmptyString(maChuyenMuc)) {
            showAlert("Chuyên mục không được để trống", "error");
            return;
        }
        if (checkEmptyString(tieuDe)) {
            showAlert("Tiêu đề không được để trống", "error");
            return;
        }
        else {
            $.ajax({
                type: "PUT",
                url: APIURL + "/api/BaiVietApi/Update",
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

    $('#btn-deleteAnhDaiDien').on('click', function () {
        $('#modalDeleteAnhDaiDien').modal('show');
    })

    $('#deleteAnhDaiDien').on('click', function () {
        let maBaiViet = $('#maBaiVietDeleteAnh').val();
        if (maBaiViet != "") {
            $.ajax({
                type: "DELETE",
                url: APIURL + `/api/BaiVietApi/DeleteAnhDaiDien?MaBaiViet=${maBaiViet}`,
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

    //lấy Mã chuyên mục khi click button xóa
    $("#myTable tbody").on('click', '.btn-delete', function () {
        let id = $(this).data("id");
        let data = $('#myTable').DataTable().row(id).data();
        $("#maBaiVietDelete").val(data.maBaiViet);
        $('#modalDelete').modal('show');
    })


    //xóa dữ liệu khi click button đồng ý
    $("#deleteData").on('click', function () {
        let maBaiViet = $("#maBaiVietDelete").val();
        $.ajax({
            type: "DELETE",
            url: APIURL + `/api/BaiVietApi/Delete?MaBaiViet=${maBaiViet}`,
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


    ClassicEditor
        .create(document.querySelector('#noiDungAdd'), {
            ckfinder: {
                uploadUrl: APIURL + `/api/Upload/imageBlog`,
            },
        })
        .then(editor => {
            editorThemMoiInstance = editor;
        })
        .catch(error => {
            console.error(error);
        });

    ClassicEditor
        .create(document.querySelector('#noiDungEdit'), {
            ckfinder: {
                uploadUrl: APIURL + `/api/Upload/imageBlog`,
            },
        })
        .then(editor => {
            editorEditInstance = editor;
        })
        .catch(error => {
            console.error(error);
        });

    $('#modalDeleteAnhDaiDien').on('hidden.bs.modal', function () {
        $("body").addClass("modal-open");
        $('#modalEdit input[type="file"]').val('');

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
    $("#modalAdd select").val("").trigger("change");
    $("#modalAdd input[name='trangThaiAdd'][value='1']").prop('checked', true);
    editorThemMoiInstance.setData('');
}