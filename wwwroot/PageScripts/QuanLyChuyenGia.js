let APIURL = window.location.origin;
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
                        minimumResultsForSearch: Infinity
                    });
                    $('#chuyenKhoaEdit').select2({
                        width: "100%",
                        minimumResultsForSearch: Infinity
                    });
                }
            }
        }
    })
    
    $.ajax({
        url: APIURL + `/api/DichVuApi/Gets`,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ trangThai:true }),
        success: function (data) {
            if (data && data.isSuccess) {
                if (data.value && data.value.length > 0) {
                    let html = "";

                    $.each(data.value, function (index, item) {
                        html += `<option value="${item.maDichVu}">${item.tenDichVu}</option>`;
                    });

                    $("#dichVuAdd").html(html);
                    $("#dichVuEdit").html(html);

                    $('#dichVuAdd').select2({
                        width: "100%",
                        minimumResultsForSearch: Infinity,
                        placeholder: "Chọn dịch vụ"
                    });
                    $('#dichVuEdit').select2({
                        width: "100%",
                        minimumResultsForSearch: Infinity,
                        placeholder: "Chọn dịch vụ"
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
                            <button type="button" data-id="${meta.row}" class="button btn-ListChungChi">
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
        let listDichVu = $("#dichVuAdd").val();
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
        if (checkEmptyString(gioiTinh)) {
            showAlert("Giới tính không được để trống", "error");
            return;
        }
        if (checkEmptyString(soDienThoai)) {
            showAlert("Số điện thoại không được để trống", "error");
            return;
        }
        let phonePattern = /^\d{10}$/;
        if (!phonePattern.test(soDienThoai)) {
            showAlert("Số điện thoại phải là 10 chữ số và chỉ chứa số", "error");
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
        if (!listDichVu || listDichVu.length === 0) {
            showAlert("Phải chọn ít nhất một dịch vụ", "error");
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
                success: async function (data) {
                    console.log(data)
                    if (!data.isSuccess) {
                        showAlert(data.error, "error");
                    }
                    else {
                        $('#myTable').DataTable().ajax.reload();
                        
                        if (listDichVu.length > 0) {
                            let listApi = []
                            listDichVu.forEach((item, index) => {
                                let request = {
                                    "maDichVu": Number(item),
                                    "maChuyenGia": data.value.maChuyenGia
                                }
                                listApi.push(getDataWithApi("POST", "/api/DichVuChuyenGiaApi/Add", JSON.stringify(request)))
                            })

                            if (listApi.length > 0) {
                                await Promise.all(listApi)
                                    .then((res) => {
                                        if (res.length > 0) {
                                            $('#modalAdd').modal('hide');
                                            showAlert("Thêm thành công", "success");
                                        }
                                    })
                                    .catch((err) => {
                                        console.log(err)
                                    })
                            }
                        }
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
        $("#dichVuEdit").val("").trigger("change")
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

        $.ajax({
            url: APIURL + `/api/DichVuChuyenGiaApi/GetDichVuByChuyenGia?MaChuyenGia=${data.maChuyenGia}`,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data && data.isSuccess) {
                    if (data.value && data.value.length > 0) {
                        let listDichVu = []
                        data.value.forEach((item, index) => {
                            listDichVu.push(item.maDichVu)
                        })

                        $("#dichVuEdit").val(listDichVu).trigger("change")
                    }
                }
            }
        })

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
        let listDichVu = $("#dichVuEdit").val();
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
        if (checkEmptyString(soDienThoai)) {
            showAlert("Số điện thoại không được để trống", "error");
            return;
        }
        if (checkEmptyString(ngaySinh)) {
            showAlert("Ngày sinh không được để trống", "error");
            return;
        }
        if (checkEmptyString(chucDanh)) {
            showAlert("Chức danh không được để trống", "error");
            return;
        }
        if (checkEmptyString(chucVu)) {
            showAlert("Chức vụ không được để trống", "error");
            return;
        }
        if (checkEmptyString(soNamKinhNghiem)) {
            showAlert("Số năm kinh nghiệm không được để trống", "error");
            return;
        }
        if (checkEmptyString(maChuyenKhoa)) {
            showAlert("Chuyên khoa không được để trống", "error");
            return;
        }
        if (!listDichVu || listDichVu.length === 0) {
            showAlert("Phải chọn ít nhất một dịch vụ", "error");
            return;
        }
        if (checkEmptyString(donViCongTac)) {
            showAlert("Đơn vị công tác không được để trống", "error");
            return;
        }
        else {
            $.ajax({
                type: "PUT",
                url: APIURL + "/api/ChuyenGiaApi/Update",
                processData: false,  // Không xử lý dữ liệu thành query string
                contentType: false,  // Không đặt Content-Type, để browser tự thêm multipart
                data: formData,
                success: async function (data) {
                    if (!data.isSuccess) {
                        showAlert(data.error, "error");
                    }
                    else {
                        $('#myTable').DataTable().ajax.reload();

                            if (listDichVu.length > 0) {
                                let listApi = []
                                listDichVu.forEach((item, index) => {
                                    let request = {
                                        "maDichVu": Number(item),
                                        "maChuyenGia": data.value.maChuyenGia
                                    }
                                    listApi.push(getDataWithApi("POST", "/api/DichVuChuyenGiaApi/Add", JSON.stringify(request)))
                                })

                                if (listApi.length > 0) {
                                    await Promise.all(listApi)
                                        .then((res) => {
                                            console.log(res)
                                            if (res.length > 0) {
                                                $('#modalEdit').modal('hide');
                                                showAlert("Thêm thành công", "success");
                                            }

                                        })
                                        .catch((err) => {
                                            console.log(err)
                                        })
                                }
                            }

                        $('#modalEdit').modal('hide');
                        showAlert("Cập nhật thành công", "success");
                    }
                },
                error: function (error) {
                    showAlert("Cập nhật không thành công", "error");
                    console.log(error,"Log lỗi")
                }
            });
        }
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

    //chỉ xóa ảnh đại diện
    $("#deleteAnhDaiDien").on('click', function () { 
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


    //show modal list chứng chỉ khi click btn chứng chỉ ở trên table
    $("#myTable tbody").on('click', '.btn-ListChungChi', function () {
        $('#AddChungChi').addClass('d-none');
        $('#EditChungChi').addClass('d-none');
        $("#previewAnhChungChi > div").empty();
        let id = $(this).data("id");
        let data = $('#myTable').DataTable().row(id).data();
        console.log(data.maChuyenGia)
        $('#maChuyenGiaChungChiAdd').val(data.maChuyenGia);
        let arrData = getChungChi(data.maChuyenGia);
        $('#tableChungChi').DataTable().clear().rows.add(arrData).draw();
        $('#modalListChungChi').modal('show');
    })


    //Render bảng - show chứng chỉ
    $('#tableChungChi').DataTable({
        dom: '<"top"f>rt<"bottom d-flex justify-content-end" lp>',
        "pageLength": 5,
        "autoWidth": false,
        "ordering": false,
        //"scrollY": "400px",
        //"scrollCollapse": true,
        //"bPaginate": true,
        "bInfo": false,
        "bDestroy": true,
        searching: false,
        lengthMenu: [
            [5, 10, 20, 50, 100],
            [5, 10, 20, 50, 100]
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
        data: [],
        "columnDefs": [
            {
                targets: 4,
                render: function (data, type, row, meta) {
                    return formatDate(data);
                }
            },
            {
                targets: 5,
                render: function (data, type, row, meta) {
                    return formatDate(data);
                }
            },
            {
                targets: 6,
                render: function (data, type, row, meta) {
                    if (data.length > 0) {
                        let html = '<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">';

                        data.forEach(item => {
                            if (item.duongDan != "" && item.duongDan) {
                                html += `<img src="${item.duongDan}" style="width: 100px; height: 100px; object-fit: cover;" />`;
                            }
                        });
                        html += '</div>';
                        return html;
                    } else {
                        return "";
                    }
                }
            },
            {
                targets: 7,
                render: function (data, type, row, meta) {
                    return `
                            <button type="button" style=" border:none; background:none;" data-id="${meta.row}" class="button btn-update">
                                <img src="../images/edit_filled.png" alt="Alternate Text" />
                            </button> 
                            <button type="button" style=" border:none; background:none;" data-id="${meta.row}" class="button btn-delete" id="btn-modalDeleteChungChi">
                                <img src="../images/delete_filled.png" alt="Alternate Text" />
                            </button>`;
                }
            }
        ],
        "columns": [
            { data: "stt", "width": "50px", "className": "text-center" },
            { data: "tenChungChi", "width": "170px", "className": "fw-bold" },
            { data: "soHieuChungChi", "width": "170px", "className": "text-center" },
            { data: "toChucCap", "width": "130px", "className": "text-center fw-bold" },
            { data: "ngayCap", "width": "130px", "className": "text-center" },
            { data: "ngayHetHan", "width": "130px", "className": "text-center" },
            { data: "tepKemTheo", "width": "200px", "className": "text-center fw-bold" },
            { data: "maChungChi", "width": "auto", "className": "text-center" }
        ]
    })

    $('#btn-createChungChi').on('click', function () {
        resetForm();
        $('#AddChungChi').removeClass('d-none');
        $('#EditChungChi').addClass('d-none');
    });
    $('#modalListChungChi .btn-cancel').on('click', function () {
        $('#AddChungChi').addClass('d-none');
        $('#EditChungChi').addClass('d-none');
    });

    //Thêm mới chứng chỉ
    $("#saveChungChi").on('click', function () {
        let maChuyenGia = $("#maChuyenGiaChungChiAdd").val();
        console.log(maChuyenGia);
        let tenChungChi = $("#tenChungChiAdd").val();
        let soHieuChungChi = $("#soHieuChungChiAdd").val();
        let toChucCap = $("#toChucCapAdd").val();
        let ngayCap = $("#ngayCapAdd").val();
        let ngayHetHan = $("#ngayHetHanAdd").val();
        let fileInput = $("#anhChungChiAdd")[0];
        let files = fileInput.files; // Trả về đối tượng file kiểu object
        console.log(files, 123)
        let request = {
            maChuyenGia: maChuyenGia,
            tenChungChi: tenChungChi,
            soHieuChungChi: soHieuChungChi,
            toChucCap: toChucCap,
            ngayCap: formatDateSQL(ngayCap),
            ngayHetHan: formatDateSQL(ngayHetHan)
        }
        let formData = new FormData();
        formData.append("data", JSON.stringify(request));// dữ liệu dạng object
        if (files) { 
            $.each(files, function (index, item) {
                formData.append("files", item); // ảnh nếu có
            });
        }
        
        if (checkEmptyString(tenChungChi)) {
            showAlert("Tên chứng chỉ không được để trống", "error");
            return;
        }
        if (!files || files.length === 0) {
            showAlert("Phải chọn ít nhất một ảnh chứng chỉ", "error");
            return;
        }
        else {
            $.ajax({
                type: "POST",
                url: APIURL + "/api/ChungChiChuyenGiaApi/Add",
                contentType: false,
                processData: false,
                data: formData,
                success: function (data) {
                    console.log(data)
                    let arrData = getChungChi(maChuyenGia);
                    $('#tableChungChi').DataTable().clear().rows.add(arrData).draw();
                    $('#AddChungChi').addClass('d-none');
                    showAlert("Thêm thành công", "success");
                    resetFormChungChi()
                },
                error: function (error) {
                    showAlert("Thêm không thành công", "error");
                    console.log(error)
                }
            });
        }
    })

    $('#tableChungChi tbody').on('click','.btn-delete', function () {
        let id = $(this).data("id");
        let data = $('#tableChungChi').DataTable().row(id).data();
        console.log(data)
        $('#maChuyenGia').val(data.maChuyenGia);
        $('#maDeleteChungChi').val(data.maChungChi);
        $('#modalDeleteChungChi').modal('show');
    })

    $('#btn-deleteChungChi').on('click', function () {
        let maChungChi = $("#maDeleteChungChi").val();
        let maChuyenGia = $("#maChuyenGia").val();  
        $.ajax({
            type: "DELETE",
            async: false,
            url: APIURL + `/api/ChungChiChuyenGiaApi/Delete?MaChungChi=${maChungChi}`,
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                $('#modalDeleteChungChi').modal('hide');
                if (data && data.isSuccess) {
                    let arrData = getChungChi(maChuyenGia);
                    $('#tableChungChi').DataTable().clear().rows.add(arrData).draw();
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

    $('#tableChungChi tbody').on('click', '.btn-update', function () {
        let id = $(this).data("id");
        let data = $('#tableChungChi').DataTable().row(id).data();
        console.log(data)
        $('#maChuyenGiaChungChiEdit').val(data.maChuyenGia);
        $('#maChungChiEdit').val(data.maChungChi);
        $('#AddChungChi').addClass('d-none');
        $('#EditChungChi').removeClass('d-none');
        $('#tenChungChiEdit').val(data.tenChungChi);
        $('#soHieuChungChiEdit').val(data.soHieuChungChi);
        $('#toChucCapEdit').val(data.toChucCap);
        $('#ngayCapEdit').val(formatDate(data.ngayCap));
        $('#ngayHetHanEdit').val(formatDate(data.ngayHetHan));
        $('#anhChungChiEdit').val("");

        if (data.tepKemTheo.length > 0) {
            let html = '<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">';
            data.tepKemTheo.forEach(item => {
                html += `<div class="item-image" id="item-image-${item.maTepDinhKem}">
                            <img src="${item.duongDan}" style="width: 150px; height: 150px; object-fit: cover;" />
                            <button type="button" style=" border:none; background:none;" data-id="${item.maTepDinhKem}" class="button btn-deleteAnhChungChi" fdprocessedid="8bdhz7">
                                <img src="../images/delete_filled.png" alt="Alternate Text">
                            </button>
                        </div>`;
            });
            html += '</div>';
            $('#previewAnhChungChi').html(html);
        } else {
            $('#previewAnhChungChi').empty();
        }
    })

    $('#editChungChi').on('click', function () {
        let maChuyenGia = $("#maChuyenGiaChungChiEdit").val(); 
        let maChungChi = $("#maChungChiEdit").val(); 
        let tenChungChi = $("#tenChungChiEdit").val();
        let soHieuChungChi = $("#soHieuChungChiEdit").val();
        let toChucCap = $("#toChucCapEdit").val();
        let ngayCap = $("#ngayCapEdit").val();
        let ngayHetHan = $("#ngayHetHanEdit").val();
        let fileInput = $("#anhChungChiEdit")[0];
        console.log(fileInput, checkEmptyString(fileInput))
        let files = fileInput.files; // Trả về đối tượng file kiểu object
        console.log(files, 123)
        let request = {
            maChuyenGia: maChuyenGia,
            maChungChi: maChungChi,
            tenChungChi: tenChungChi,
            soHieuChungChi: soHieuChungChi,
            toChucCap: toChucCap,
            ngayCap: formatDateSQL(ngayCap),
            ngayHetHan: formatDateSQL(ngayHetHan)
        }
        let formData = new FormData();
        formData.append("data", JSON.stringify(request));// dữ liệu dạng object
        if (files) {

            // Đối tượng files truyền vào là List, lặp qua các phần tử của mảng đối tượng files để append vào formData
            // => List file
            $.each(files, function (index, item) {
                formData.append("files", item); // ảnh nếu có
            });
        }
        if (checkEmptyString(tenChungChi)) {
            showAlert("Tên chứng chỉ không được để trống", "error");
            return;
        }
        if (files.length == 0 && $("#previewAnhChungChi .item-image").length == 0) {
            showAlert("Phải chọn ít nhất một ảnh chứng chỉ", "error");
            return;
        }
        else {
            $.ajax({
                type: "PUT",
                url: APIURL + "/api/ChungChiChuyenGiaApi/Update",
                contentType: false,
                processData: false,
                data: formData,
                success: function (data) {
                    if (!data.isSuccess) {
                        showAlert(data.error, "error");
                    }
                    else {
                        let arrData = getChungChi(maChuyenGia);
                        $('#tableChungChi').DataTable().clear().rows.add(arrData).draw();
                        $('#EditChungChi').addClass('d-none');
                        showAlert("Cập nhật thành công", "success");
                        $('#anhChungChiEdit').val("");
                    }
                },
                error: function (error) {
                    showAlert("Cập nhật không thành công", "error");
                    $('#anhChungChiEdit').val("");
                }
            });
            $('#anhChungChiEdit').val("");
        }
    })


    $(document).on('click', '.btn-deleteAnhChungChi', function () {
        let id = $(this).data("id");
        console.log(id);
        $("#maChungChiDeleteAnh").val(id);
        $("#modalDeleteAnhChungChi").modal('show');
    })

    //chỉ xóa ảnh CHỨNG CHỈ
    $("#deleteAnhChungChi").on('click', function () {
        let maAnhChungChi = $("#maChungChiDeleteAnh").val();
        let maChuyenGia = $("#maChuyenGiaChungChiEdit").val();
        if ($("#previewAnhChungChi .item-image").length == 1) {
            showAlert("Phải có ít nhất 1 ảnh chứng chỉ", "error");
            $('#modalDeleteAnhChungChi').modal('hide');
            return;
        }
        if (maAnhChungChi != "") {
            $.ajax({
                type: "DELETE",
                url: APIURL + `/api/ChungChiChuyenGiaApi/DeleteAnhChungChi?MaTepDinhKem=${maAnhChungChi}`,
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    console.log(data, 111)
                    if (data && data.isSuccess) {
                        let arrData = getChungChi(maChuyenGia);
                        $('#tableChungChi').DataTable().clear().rows.add(arrData).draw();
                        showAlert("Xóa thành công", "success");
                        $('#modalDeleteAnhChungChi').modal('hide');
                        $(`#item-image-${maAnhChungChi}`).remove();
                    } else {
                        showAlert("Xóa không thành công", "error");
                        $('#modalDeleteAnhChungChi').modal('hide');

                    }
                },
                error: function (error) {
                    showAlert("Xóa không thành công", "error");
                },

            });
        }
    })



    $('#modalAddChungChi').on('hidden.bs.modal', function () {
        $('#modalListChungChi').modal('show');
    });


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

function getChungChi(maChuyenGia) {
    let arrData = [];
    $.ajax({
        url: APIURL + `/api/ChungChiChuyenGiaApi/Gets?MaChuyenGia=${maChuyenGia}`,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        async: false,
        success: function (data) {
            var result = data.value
            if (result) {
                for (let i = 0; i < result.length; i++) {
                    result[i].stt = i + 1;
                    arrData.push(result[i]);
                }
            }
        }
    })
    return arrData;
}

function resetForm() {
    $("#modalAdd input:not([type='radio'])").val("");
    $("#modalAdd textarea").val("");
    $("#modalAdd select").val("").trigger("change");
    $('input[name="gioitinhAdd"]').prop('checked', false);
}

function resetFormChungChi() {
    $('#AddChungChi input:not(#maChuyenGiaChungChiAdd)').val("");
}

function getDataWithApi(method, uri, data) {
    if (data) {
        return $.ajax({
            type: method,
            contentType: 'application/json; charset=utf-8',
            url: APIURL + uri,
            data: data
        });
    }

    return $.ajax({
        type: method,
        contentType: 'application/json; charset=utf-8',
        url: APIURL + uri,
    });
};

