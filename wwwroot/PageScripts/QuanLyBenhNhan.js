let APIURL = window.location.origin;
$(document).ready(function () {
    formatInputDate("#ngaySinhAdd");

    formatInputDate("#ngaySinhEdit");

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
            url: APIURL + `/api/BenhNhanApi/Gets`,
            type: "POST",
            data: buildData,
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
                    return data == 0 ? 'Nam' : data == 1 ? 'Nữ' : data == 2 ? 'Khác' : '--';
                }
            },
            {
                targets: 4,
                render: function (data, type, row, meta) {
                    return data ? data : '--';
                }
            },
            {
                targets: 5,
                render: function (data, type, row, meta) {
                    return data == 1 ? "<span class='text-blue'>Đang hoạt động</span>" : "<span class='text-red'>Đã khóa</span>";
                }
            },
            {
                targets: 6,
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
            { data: "hoTen", "width": "300px", "className": "fw-bold" },
            { data: "gioiTinh", "width": "150px", "className": "text-center" },
            { data: "soDienThoai", "width": "250px", "className": "text-center" },
            { data: "diaChi", "width": "350px", "className": "text-center" },
            { data: "trangThai", "width": "200px", "className": "text-center fw-bold" },
            { data: "stt", "width": "auto", "className": "text-center" }
        ]
    })

    //add dữ liệu khi click button Lưu
    $("#saveData").on('click', function () {
        let tenDangNhap = $("#tenDangNhapAdd").val();
        let matKhau = $("#matKhauAdd").val();
        let hoTen = $("#hotenAdd").val();
        let soDienThoai = $("#soDienThoaiAdd").val();
        let gioiTinh = $("input[name='gioitinhAdd']:checked").val();
        console.log(gioiTinh)
        let email = $("#emailAdd").val();
        let ngaySinh = $("#ngaySinhAdd").val();
        let diaChi = $("#diaChiAdd").val();
        let ngheNghiep = $("#ngheNghiepAdd").val();
        let tinhTrangHonNhan = $("#tinhTrangHonNhanAdd").val();
        let tienSuBenh = $("#tienSuBenhAdd").val();
        let thoiQuenSinhHoat = $("#thoiQuenSinhHoatAdd").val();
        let thuocDangDung = $("#thuocDangDungAdd").val();
        let ghiChuKhac = $("#ghiChuAdd").val();
        let trangThai = $("input[name='trangThaiAdd']:checked").val();
        let lyDo = $("#lyDoAdd").val();
        let fileInput = $("#anhDaiDienAdd")[0];
        let file = fileInput.files[0]; //lấy ảnh đại diện
        let request = {
            username: tenDangNhap.trim(),
            password: matKhau.trim(),
            email: email,
            hoTen: hoTen.trim(),
            gioiTinh: Number(gioiTinh),
            ngaySinh: formatDateSQL(ngaySinh),
            soDienThoai: soDienThoai,
            diaChi: diaChi,
            ngheNghiep: ngheNghiep,
            tinhTrangHonNhan: tinhTrangHonNhan,
            tienSuBenh: tienSuBenh,
            thoiQuenSinhHoat: thoiQuenSinhHoat,
            thuocDangDung: thuocDangDung,
            ghiChuKhac: ghiChuKhac,
            trangThai: Boolean(Number(trangThai)),
            lyDo: lyDo,
        }
        console.log(request)
        let formData = new FormData();
        formData.append("data", JSON.stringify(request));// dữ liệu dạng object
        if (file) {
            formData.append("file", file); // ảnh nếu có
        }
        if (checkEmptyString(tenDangNhap.trim())) {
            showAlert("Tên đăng nhập không được để trống", "error");
            return;
        }
        if (checkEmptyString(matKhau.trim())) {
            showAlert("Mật khẩu không được để trống", "error");
            return;
        }
        if (checkEmptyString(hoTen)) {
            showAlert("Họ tên không được để trống", "error");
            return;
        }
        if (checkEmptyString(soDienThoai)) {
            showAlert("Số điện thoại không được để trống", "error");
            return;
        }
        else {
            $.ajax({
                type: "POST",
                url: APIURL + "/api/BenhNhanApi/Add",
                contentType: "application/json; charset=utf-8",
                data: formData,
                processData: false,  //bắt buộc khi dùng FormData
                contentType: false,  //không cho jQuery set header kiểu `application/x-www-form-urlencoded`
                success: function (data) {
                    if (!data.isSuccess) {
                        showAlert(data.error, "error");
                    }
                    else {
                        $('#myTable').DataTable().ajax.reload();
                        $('#modalAdd').modal('hide');
                        showAlert("Thêm thành công", "success");
                        //Làm rỗng form sau khi thêm mới
                        resetForm()
                    }
                },
                error: function (error) {
                    showAlert("Thêm không thành công", "error");
                    console.log(error)
                }
            });
        }
    })
    //lấy giá trị gán vào các input trong modal edit khi click button sửa
    $("#myTable tbody").on('click', '.btn-update', function () {
        let id = $(this).data("id");
        let data = $('#myTable').DataTable().row(id).data();
        $("#maBenhNhanEdit").val(data.maBenhNhan);
        $("#hoTenEdit").val(data.hoTen);
        $("input[name='gioitinhEdit'][value='" + data.gioiTinh + "']").prop("checked", true);
        $("#ngaySinhEdit").val(formatDate(data.ngaySinh));
        $("#soDienThoaiEdit").val(data.soDienThoai);
        $("#emailEdit").val(data.email);
        $("#diaChiEdit").val(data.diaChi);
        $("#tienSuBenhEdit").val(data.tienSuBenh);
        $("#thoiQuenSinhHoatEdit").val(data.thoiQuenSinhHoat);
        $("#ngheNghiepEdit").val(data.ngheNghiep);
        $("#tinhTrangHonNhanEdit").val(data.tinhTrangHonNhan);
        $("#thuocDangDungEdit").val(data.thuocDangDung);
        $("#ghiChuKhacEdit").val(data.ghiChuKhac);
        $("input[name='trangThaiEdit'][value='" + (data.trangThai ? 1 : 0) + "']").prop("checked", true);
        $("#lyDoEdit").val(data.lyDo);
        $("#anhDaiDienEdit").val("");
        //nếu có ảnh thì hiển thị preview, không thì ẩn khối preview
        if (data.anhDaiDien != null && data.anhDaiDien != "") {
            $("#currentAnhDaiDienEdit").attr("src", `${APIURL}/` + data.anhDaiDien);
            $("#anhDaiDienNull").show(); //nếu có ảnh đại diện thì cho xem preview
            $("#maBenhNhanDeleteAnh").val(data.maBenhNhan);
        } else {
            $("#anhDaiDienNull").hide();
            $("#maBenhNhanDeleteAnh").val("");
        };
        $("#anhDaiDienChuyenGiaEdit").val("");
        $('#modalEdit').modal('show');
    })


    //update dữ liệu khi click button Lưu
    $("#editData").on('click', function () {
        let maBenhNhan = $("#maBenhNhanEdit").val();
        let hoTen = $("#hoTenEdit").val();
        let gioiTinh = $("input[name='gioitinhEdit']:checked").val();
        let ngaySinh = $("#ngaySinhEdit").val();
        let diaChi = $("#diaChiEdit").val();
        let soDienThoai = $("#soDienThoaiEdit").val();
        let email = $("#emailEdit").val();
        let tienSuBenh = $("#tienSuBenhEdit").val();
        let thoiQuenSinhHoat = $("#thoiQuenSinhHoatEdit").val();
        let ngheNghiep = $("#ngheNghiepEdit").val();
        let tinhTrangHonNhan = $("#tinhTrangHonNhanEdit").val();
        let thuocDangDung = $("#thuocDangDungEdit").val();
        let ghiChuKhac = $("#ghiChuKhacEdit").val();
        let trangThai = $("input[name='trangThaiEdit']:checked").val();
        let fileInput = $("#anhDaiDienEdit")[0];
        let file = fileInput.files[0];
        let request = {
            maBenhNhan: maBenhNhan,
            hoTen: hoTen,
            gioiTinh: Number(gioiTinh),
            ngaySinh: formatDateSQL(ngaySinh),
            diaChi: diaChi,
            soDienThoai: soDienThoai,
            email: email,
            tienSuBenh: tienSuBenh,
            thoiQuenSinhHoat: thoiQuenSinhHoat,
            ngheNghiep: ngheNghiep,
            tinhTrangHonNhan: tinhTrangHonNhan,
            thuocDangDung: thuocDangDung,
            ghiChuKhac: ghiChuKhac,
            trangThai: Boolean(Number(trangThai))
        }
        let formData = new FormData();
        formData.append("data", JSON.stringify(request));// dữ liệu dạng object
        if (file) {
            formData.append("file", file); // ảnh nếu có
        }
        if (checkEmptyString(hoTen)) {
            showAlert("Họ và tên chuyên gia không được để trống", "error");
            return;
        }
        if (checkEmptyString(gioiTinh)) {
            showAlert("Giới tính không được để trống", "error");
            return;
        }
        if (checkEmptyString(ngaySinh)) {
            showAlert("Ngày sinh không được để trống", "error");
            return;
        }
        if (checkEmptyString(soDienThoai)) {
            showAlert("Số điện thoại không được để trống", "error");
            return;
        }
        else {
            $.ajax({
                type: "PUT",
                url: APIURL + "/api/BenhNhanApi/Update",
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
                    console.log(error, "Log lỗi")
                }
            });
        }
    })

    $("#myTable tbody .btn-update").on('click', function () {
        let id = $(this).data("id");
        let data = $('#myTable').DataTable().row(id).data();
    })

    //lấy mã chuyên gia để xóa khi click button xóa trên bảng
    $("#myTable tbody").on('click', '.btn-delete', function () {
        let id = $(this).data("id");
        let data = $('#myTable').DataTable().row(id).data();
        $("#maBenhNhanDelete").val(data.maBenhNhan);
        $('#modalDelete').modal('show');
    })

    //thực hiện xóa dữ liệu khi click button ĐỒNG Ý
    $("#deleteData").on('click', function () {
        let maBenhNhan = $("#maBenhNhanDelete").val();
        $.ajax({
            type: "DELETE",
            url: APIURL + `/api/BenhNhanApi/Delete?MaBenhNhan=${maBenhNhan}`,
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


    //xóa ảnh đại diện
    $('#btn-deleteAnhDaiDien').on('click', function () {
        $("#modalDeleteAnhDaiDien").modal('show');
    });

    $("#deleteAnhDaiDien").on('click', function () { //chỉ xóa ảnh đại diện
        let maBenhNhan = $("#maBenhNhanDeleteAnh").val();
        console.log(maBenhNhan)
        if (maBenhNhan != "") {
            $.ajax({
                type: "DELETE",
                url: APIURL + `/api/BenhNhanApi/DeleteAnhDaiDien?MaBenhNhan=${maBenhNhan}`,
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
    //xử lý modal chồng nhau
    $('#modalDeleteAnhDaiDien').on('hidden.bs.modal', function () {
        $("body").addClass("modal-open");
        $('#modalEdit input[type="file"]').val('');

    });


    // clear value khi click button thêm mới
    $('#modalAdd').on('show.bs.modal', function () {
        resetForm();
    });

    //render lại bảng khi click button tìm kiếm
    $("#btn-search").on('click', function () {
        $('#myTable').DataTable().ajax.reload();
    })


    //search khi nhấn enter
    $("#search").on('keydown', function (e) {
        if (e.key === 'Enter') {
            $('#myTable').DataTable().ajax.reload();
        }
    })

})
function resetForm() {
    $("#modalAdd input:not([type='radio'])").val("");
    $("#modalAdd textarea").val("");
    $("#modalAdd select").val("").trigger("change");
    $('input[name="gioitinhAdd"]').prop('checked', false);
}