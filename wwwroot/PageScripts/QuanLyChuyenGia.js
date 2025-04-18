﻿let APIURL = window.location.origin;
$(document).ready(function () {

    //ngày sinh
    formatInputDate("#ngaySinhAdd");
    formatInputDate("#ngaySinhEdit");
    //ngày cấp chứng chỉ
    formatInputDate("#ngayCapAdd");
    formatInputDate("#ngayCapEdit");

    //ngày hết hạn chứng chỉ
    formatInputDate("#ngayHetHanAdd");
    formatInputDate("#ngayHetHanEdit");

    //đổ dữ liệu vào select2 CHUYÊN KHOA
    $.ajax({
        url: APIURL + `/api/ChuyenKhoaApi/Gets?trangThai=true`,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data && data.isSuccess) {
                if (data.value && data.value.length > 0) {
                    let html = "<option value=''>Chọn chuyên khoa</option>";

                    $.each(data.value, function (index, item) {
                        html += `<option value="${item.maChuyenKhoa}">${item.tenChuyenKhoa}</option>`;
                    });

                    $("#chuyenKhoaAdd").html(html);
                    $("#chuyenKhoaEdit").html(html);

                    $('#chuyenKhoaAdd').select2({
                        width: "100%",
                        minimumResultsForSearch: Infinity,
                        //placeholder: "Chọn chuyên khoa",
                        //dropdownParent: $("#chuyenKhoaAddParent")
                    });
                    $('#chuyenKhoaEdit').select2({
                        width: "100%",
                        minimumResultsForSearch: Infinity,
                        //placeholder: "Chọn chuyên khoa",
                        //dropdownParent: $("#chuyenKhoaEditParent")
                    });
                }
            }
        }
    })

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
            url: APIURL + `/api/ChuyenGiaApi/Gets`,
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
                targets: 6,
                render: function (data, type, row, meta) {
                    return data ? "<span class='text-blue'>Đang làm việc</span>" : "<span class='text-red'>Đã nghỉ việc</span>";
                }
            },
            {
                targets: 7,
                render: function (data, type, row, meta) {
                    return `
                            <button type="button" data-id="${meta.row}" class="button btn-addChungChi" data-bs-toggle="modal" data-bs-target="#modalAddChungChi">
                                <img src="../images/addchungchi.png" alt="Alternate Text" />
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
            { data: "hoTen", "width": "250px", "className": "fw-bold" },
            { data: "chucDanh", "width": "200px", "className": "text-center" },
            { data: "chucVu", "width": "225px", "className": "text-center fw-bold" },
            { data: "tenChuyenKhoa", "width": "250px", "className": "text-center" },
            { data: "soNamKinhNghiem", "width": "180px", "className": "text-center" },
            { data: "trangThai", "width": "180px", "className": "text-center fw-bold" },
            { data: "maChuyenGia", "width": "auto", "className": "text-center" }
        ]
    })
    //add dữ liệu khi click button Lưu
    $("#saveData").on('click', function () {
        let tenDangNhap = $("#tenDangNhapAdd").val();
        let matKhau = $("#matKhauAdd").val();
        let email = $("#emailAdd").val();
        let hoTen = $("#hotenAdd").val();
        let gioiTinh = $("input[name='gioitinhAdd']:checked").val();
        let ngaySinh = $("#ngaySinhAdd").val();
        let soDienThoai = $("#soDienThoaiAdd").val();
        let diaChi = $("#diaChiAdd").val();
        let chucDanh = $("#chucDanhAdd").val();
        let chucVu = $("#chucVuAdd").val();
        let maChuyenKhoa = $("#chuyenKhoaAdd").val();
        let soNamKinhNghiem = $("#soNamKinhNghiemAdd").val();
        let donViCongTac = $("#donViCongTacAdd").val();
        let giaiThuongNghienCuu = $("#giaiThuongNghienCuuAdd").val();
        let gioiThieu = $("#gioiThieuAdd").val();
        let kinhNghiem = $("#kinhNghiemAdd").val();
        let fileInput = $("#anhDaiDienAdd")[0];
        let file = fileInput.files[0]; //lấy ảnh đại diện
        let trangThai = $("input[name='trangThaiAdd']:checked").val();
        let request = {
            username: tenDangNhap.trim(),
            password: matKhau.trim(),
            email: email,
            hoTen: hoTen.trim(),
            gioiTinh: Number(gioiTinh),
            ngaySinh: formatDateSQL(ngaySinh),
            soDienThoai: soDienThoai.trim(),
            diaChi: diaChi,
            chucDanh: chucDanh,
            chucVu: chucVu,
            maChuyenKhoa: maChuyenKhoa,
            soNamKinhNghiem: soNamKinhNghiem,
            donViCongTac: donViCongTac,
            giaiThuong_NghienCuu: giaiThuongNghienCuu,
            gioiThieu: gioiThieu,
            kinhNghiem: kinhNghiem,
            trangThai: Boolean(Number(trangThai))
        }
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
        if (checkEmptyString(gioiTinh)) {
            showAlert("Giới tính không được để trống", "error");
            return;
        }
        if (checkEmptyString(ngaySinh)) {
            showAlert("Ngày sinh không được để trống", "error");
            return;
        }
        if (checkEmptyString(maChuyenKhoa)) {
            showAlert("Chuyên khoa không được để trống", "error");
            return;
        }
        else {
            $.ajax({
                type: "POST",
                url: APIURL + "/api/ChuyenGiaApi/Add",
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
        $("#maChuyenGiaEdit").val(data.maChuyenGia);
        $("#hoTenEdit").val(data.hoTen);
        $("input[name='gioitinhEdit'][value='" + data.gioiTinh + "']").prop("checked", true);
        $("#ngaySinhEdit").val(formatDate(data.ngaySinh));
        $("#diaChiEdit").val(data.diaChi);
        $("#chucDanhEdit").val(data.chucDanh);
        $("#chucVuEdit").val(data.chucVu);
        $("#chuyenKhoaEdit").val(data.maChuyenKhoa).trigger("change");
        $("#soNamKinhNghiemEdit").val(data.soNamKinhNghiem);
        $("#donViCongTacEdit").val(data.donViCongTac);
        $("#soDienThoaiEdit").val(data.soDienThoai);
        $("#emailEdit").val(data.email);
        $("#giaiThuongNghienCuuEdit").val(data.giaiThuong_NghienCuu);
        $("#gioiThieuEdit").val(data.gioiThieu);
        $("#kinhNghiemEdit").val(data.kinhNghiem);
        $("input[name='trangThaiEdit'][value='" + (data.trangThai ? 1 : 0) + "']").prop("checked", true);
        $("#anhDaiDienEdit").val("");
        //nếu có ảnh thì hiển thị preview, không thì ẩn khối preview
        if (data.anhDaiDien != null && data.anhDaiDien != "") {
            $("#currentAnhDaiDienEdit").attr("src", `${APIURL}/` + data.anhDaiDien);
            $("#anhDaiDienNull").show(); //nếu có ảnh đại diện thì cho xem preview
            $("#maChuyenGiaDeleteAnh").val(data.maChuyenGia);
        } else {
            $("#anhDaiDienNull").hide();
            $("#maChuyenGiaDeleteAnh").val("");
        };
        $("#anhDaiDienChuyenGiaEdit").val("");
        $('#modalEdit').modal('show');
    })


    //update dữ liệu khi click button Lưu
    $("#editData").on('click', function () {
        let maChuyenGia = $("#maChuyenGiaEdit").val();
        let hoTen = $("#hoTenEdit").val();
        let gioiTinh = $("input[name='gioitinhEdit']:checked").val();
        let ngaySinh = $("#ngaySinhEdit").val();
        let diaChi = $("#diaChiEdit").val();
        let chucDanh = $("#chucDanhEdit").val();
        let chucVu = $("#chucVuEdit").val();
        let maChuyenKhoa = $("#chuyenKhoaEdit").val();
        let soNamKinhNghiem = $("#soNamKinhNghiemEdit").val();
        let donViCongTac = $("#donViCongTacEdit").val();
        let giaiThuongNghienCuu = $("#giaiThuongNghienCuuEdit").val();
        let gioiThieu = $("#gioiThieuEdit").val();
        let kinhNghiem = $("#kinhNghiemEdit").val();
        let soDienThoai = $("#soDienThoaiEdit").val();
        let email = $("#emailEdit").val();
        let trangThai = $("input[name='trangThaiEdit']:checked").val();
        let fileInput = $("#anhDaiDienEdit")[0];
        let file = fileInput.files[0];
        let request = {
            maChuyenGia: maChuyenGia,
            hoTen:hoTen,
            gioiTinh: Number(gioiTinh),
            ngaySinh: formatDateSQL(ngaySinh),
            diaChi: diaChi,
            chucDanh: chucDanh,
            chucVu: chucVu,
            maChuyenKhoa: maChuyenKhoa,
            soNamKinhNghiem: soNamKinhNghiem,
            donViCongTac: donViCongTac,
            giaiThuong_NghienCuu: giaiThuongNghienCuu,
            gioiThieu: gioiThieu,
            kinhNghiem: kinhNghiem,
            soDienThoai: soDienThoai,
            email: email,
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
        if (checkEmptyString(maChuyenKhoa)) {
            showAlert("Chuyên khoa không được để trống", "error");
            return;
        }
        else {
            $.ajax({
                type: "PUT",
                url: APIURL + "/api/ChuyenGiaApi/Update",
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
                    console.log(error,"Log lỗi")
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
        $("#maChuyenGiaDelete").val(data.maChuyenGia);
        $('#modalDelete').modal('show');
    })

    //thực hiện xóa dữ liệu khi click button ĐỒNG Ý
    $("#deleteData").on('click', function () {
        let maChuyenGia = $("#maChuyenGiaDelete").val();
        $.ajax({
            type: "DELETE",
            url: APIURL + `/api/ChuyenGiaApi/Delete?MaChuyenGia=${maChuyenGia}`,
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
        let maChuyenGia = $("#maChuyenGiaDeleteAnh").val();
        if (maChuyenGia != "")
        {
            $.ajax({
                type: "DELETE",
                url: APIURL + `/api/ChuyenGiaApi/DeleteAnhDaiDien?MaChuyenGia=${maChuyenGia}`,
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
