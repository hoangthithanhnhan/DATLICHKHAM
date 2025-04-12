let APIURL = window.location.origin;
$(document).ready(function () {

    formatInputDate("#ngaySinhAdd");

    formatInputDate("#ngaySinhEdit");

    //đổ dữ liệu vào select2
    $.ajax({
        url: APIURL + `/api/ChuyenKhoaApi/Gets?trangThai=true`,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            //console.log(data)
            if (data && data.isSuccess) {

                console.log(data)
                if (data.value && data.value.length > 0) {
                    let html = "<option>Chọn chuyên khoa</option>";
                    $.each(data.value, function (index, item) {
                        //console.log(item);
                        html += `<option value="${item.maChuyenKhoa}">${item.tenChuyenKhoa}</option>`;
                    });
                    $("#chuyenKhoaEdit").html(html);
                    $('.js-example-basic-single').select2({
                        width: "100%",
                        dropdownParent: $("#modalEdit")
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
                targets: 6,
                render: function (data, type, row, meta) {
                    return data ? "<span class='text-blue'>Đang làm việc</span>" : "<span class='text-red'>Đã nghỉ việc</span>";
                }
            },
            {
                targets: 7,
                render: function (data, type, row, meta) {
                    return `
                            <button type="button" data-id="${meta.row}" class="button btn-user">
                                <img src="../images/user.png" alt="Alternate Text" />
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
        let request = {
            username: tenDangNhap.trim(),
            password: matKhau.trim(),
            email: email,
            hoTen: hoTen.trim(),
            gioiTinh: Number(gioiTinh),
            ngaySinh: formatDateSQL(ngaySinh)
        }
        //console.log(request)
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
        else {
            $.ajax({
                type: "POST",
                url: APIURL + "/api/ChuyenGiaApi/Add",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(request),
                success: function (data) {
                    console.log(data)
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

    //lấy giá trị gán vào các input trong modal edit khi click butotn sửa
    $("#myTable tbody").on('click', '.btn-update', function () {
        let id = $(this).data("id");
        let data = $('#myTable').DataTable().row(id).data();
        console.log(data)
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
        $("#giaiThuongNghienCuuEdit").val(data.giaiThuong_NghienCuu);
        $("#gioiThieuEdit").val(data.gioiThieu);
        $("#kinhNghiemEdit").val(data.kinhNghiem);
        $("input[name='trangThaiEdit'][value='" + data.trangThai + "']").prop("checked", true);
        //nếu có ảnh thì hiển thị preview, không thì ẩn khối preview
        if (data.anhDaiDien != null && data.anhDaiDien != "") {
            $("#currentAnhDaiDienEdit").attr("src", `${APIURL}/` + data.anhDaiDien);
            $("#anhDaiDienNull").show(); //nếu có ảnh đại diện thì cho xem preview
            $("#maChuyenGiaDelete").val(data.maDichVu);
        } else {
            $("#anhDaiDienNull").hide();
            $("#maChuyenGiaDelete").val("");
        };
        $("#anhDaiDienDichVuEdit").val("");
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
        let trangThai = $("input[name='trangThaiEdit']:checked").val();
        let fileInput = $("#anhDaiDienAdd")[0];
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
            trangThai: Boolean(Number(trangThai))
        }
        let formData = new FormData();
        formData.append("data", JSON.stringify(request)); // dữ liệu dạng object
        if (file) {
            formData.append("file", file); // ảnh nếu có
        }
        if (checkEmptyString(hoTen)) {
            showAlert("Họ và tên chuyên gia không được để trống", "error");
            return;
        }
        else {
            console.log(request)
            console.log(file)
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
                }
            });
        }
    })


    $("#myTable tbody").on('click', '.btn-user', function () {
        let id = $(this).data("id");
        let data = $('#myTable').DataTable().row(id).data();
        console.log(data)
        $("#maChuyenGiaEdit").val(data.maChuyenGia);
        $("#tenDangNhapEdit").val(data.tenDangNhap);
        $("#matKhauEdit").val(data.matKhau);
        console.log(data.tenDangNhap)
        $("#hoTenEdit").val(data.hoTen);
        $("input[name='gioitinhEdit'][value='" + (data.trangThai ? 1 : 0) + "']").prop("checked", true);
        $('#modalEditAccount').modal('show');
    })

    $("#myTable tbody .btn-update").on('click', function () {
        let id = $(this).data("id");
        let data = $('#myTable').DataTable().row(id).data();
        console.log(data)
    })

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

    
    //console.log($('.js-example-basic-single').length);
    //console.log(typeof $('.js-example-basic-single').select2);

})
function resetForm() {
    $("#modalAdd input").val("");
    $("#modalAdd textarea").val("");
    $("input[name='trangThaiAdd'][value='1']").prop('checked', true);
}
