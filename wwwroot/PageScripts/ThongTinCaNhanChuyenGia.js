APIURL = window.location.origin;

$(document).ready(function () {

    let maChuyenGia = $('#maChuyenGia').val();
    console.log(maChuyenGia);

    $.ajax({
        url: APIURL + `/api/ChuyenKhoaApi/Gets?trangThai=true`,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            console.log(data);
            if (data && data.isSuccess) {
                if (data.value && data.value.length > 0) {
                    let html = "<option value=''>Chọn chuyên khoa</option>";

                    $.each(data.value, function (index, item) {
                        html += `<option value="${item.maChuyenKhoa}">${item.tenChuyenKhoa}</option>`;
                    });

                    $("#chuyenKhoaEdit").html(html);

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
        data: JSON.stringify({ trangThai: true }),
        success: function (data) {
            if (data && data.isSuccess) {
                if (data.value && data.value.length > 0) {
                    let html = "";

                    $.each(data.value, function (index, item) {
                        html += `<option value="${item.maDichVu}">${item.tenDichVu}</option>`;
                    });

                    $("#dichVuEdit").html(html);

                    $('#dichVuEdit').select2({
                        width: "100%",
                        minimumResultsForSearch: Infinity,
                        placeholder: "Chọn dịch vụ"
                    });
                }
            }
        }
    })

    renderThongTin(maChuyenGia)


    $(document).on('click', '#editInfoCaNhan', function () {
        maBenhNhan = $(this).data('id');
        let hoTen = $('#hoTen').text();
        $('#hoTenEdit').val(hoTen);
        let gioiTinh = $('#gioiTinh').data("gt");
        $("input[name='gioitinhEdit'][value='" + gioiTinh + "']").prop("checked", true);
        let ngaySinh = $('#ngaySinh').text();
        $('#ngaySinhEdit').val(formatDateSQL(ngaySinh));
        let soDienThoai = $('#soDienThoai').text();
        $('#soDienThoaiEdit').val(soDienThoai);
        let email = $('#email').text();
        $('#emailEdit').val(email);
        let diaChi = $('#diaChi').text();
        $('#diaChiEdit').val(diaChi);
        let chucDanh = $('#chucDanh').text();
        $('#chucDanhEdit').val(chucDanh);
        let chucVu = $('#chucVu').text();
        $('#chucVuEdit').val(chucVu);
        let soNamKinhNghiem = $('#soNamKinhNghiem').text();
        $('#soNamKinhNghiemEdit').val(soNamKinhNghiem);
        let maChuyenKhoa = $('#tenChuyenKhoa').data('ck');
        $('#chuyenKhoaEdit').val(maChuyenKhoa).trigger("change");
        let donViCongTac = $('#donViCongTac').text();
        $('#donViCongTacEdit').val(donViCongTac);
        let giaiThuong_NghienCuu = $('#giaiThuong_NghienCuu').text();
        $('#giaiThuongNghienCuuEdit').val(giaiThuong_NghienCuu);
        let gioiThieu = $('#gioiThieu').text();
        $('#gioiThieuEdit').val(gioiThieu);
        let kinhNghiem = $('#kinhNghiem').text();
        $('#kinhNghiemEdit').val(kinhNghiem);
        let anhDaiDien = $('#anhDaiDien').attr('src');
        $('#anhDaiDienEdit').attr('src', anhDaiDien);
        $.ajax({
            url: APIURL + `/api/DichVuChuyenGiaApi/GetDichVuByChuyenGia?MaChuyenGia=${maChuyenGia}`,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                console.log(data);
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
        $('#modalThongTinEdit').modal('show');

    })
    $('#btn-SaveThongTin').on('click', function () {
        let hoTen = $("#hoTenEdit").val();
        let gioiTinh = $("input[name='gioitinhEdit']:checked").val();
        let ngaySinh = $("#ngaySinhEdit").val();
        let diaChi = $("#diaChiEdit").val();
        let soDienThoai = $("#soDienThoaiEdit").val();
        let email = $("#emailEdit").val();
        let chucDanh = $("#chucDanhEdit").val();
        let chucVu = $("#chucVuEdit").val();
        let maChuyenKhoa = $("#chuyenKhoaEdit").val();
        let soNamKinhNghiem = $("#soNamKinhNghiemEdit").val();
        let donViCongTac = $("#donViCongTacEdit").val();
        let giaiThuongNghienCuu = $("#giaiThuongNghienCuuEdit").val();
        let gioiThieu = $("#gioiThieuEdit").val();
        let kinhNghiem = $("#kinhNghiemEdit").val();
        let listDichVu = $("#dichVuEdit").val();
        let fileInput = $("#upload-avatar")[0];
        let file = fileInput.files[0];
        let request = {
            maChuyenGia: maChuyenGia,
            hoTen: hoTen,
            gioiTinh: Number(gioiTinh),
            ngaySinh: ngaySinh,
            diaChi: diaChi,
            soDienThoai: soDienThoai,
            email: email,
            chucDanh: chucDanh,
            chucVu: chucVu,
            maChuyenKhoa: maChuyenKhoa,
            soNamKinhNghiem: soNamKinhNghiem,
            donViCongTac: donViCongTac,
            giaiThuong_NghienCuu: giaiThuongNghienCuu,
            gioiThieu: gioiThieu,
            kinhNghiem: kinhNghiem,
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
                        renderThongTin(maChuyenGia)
                        if (listDichVu.length > 0) {
                            let listApi = []
                            listDichVu.forEach((item, index) => {
                                let request = {
                                    "maDichVu": Number(item),
                                    "maChuyenGia":maChuyenGia
                                }
                                listApi.push(getDataWithApi("POST", "/api/DichVuChuyenGiaApi/Add", JSON.stringify(request)))
                            })

                            if (listApi.length > 0) {
                                await Promise.all(listApi)
                                    .then((res) => {
                                        console.log(res)
                                        if (res.length > 0) {
                                            $('#modalThongTinEdit').modal('hide');
                                            showAlert("Thêm thành công", "success");
                                        }

                                    })
                                    .catch((err) => {
                                        console.log(err)
                                    })
                            }
                        }
                        renderThongTin(maChuyenGia)
                        $('#modalThongTinEdit').modal('hide');
                        showAlert("Cập nhật thành công", "success");
                    }
                },
                error: function (error) {
                    showAlert("Cập nhật không thành công", "error");
                    console.log(error, "Log lỗi")
                }
            });
        }
    })


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
        "ajax": {
            url: APIURL + `/api/ChungChiChuyenGiaApi/Gets?MaChuyenGia=${maChuyenGia}`,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            async: false,
            dataSrc: function (data) {
                console.log(data);
                let arrData = [];
                var result = data.value
                if (result) {
                    for (let i = 0; i < result.length; i++) {
                        result[i].stt = i + 1;
                        arrData.push(result[i]);
                    }
                    return arrData;
                }
                return [];
            }
        },
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
            { data: "tenChungChi", "width": "200px", "className": "fw-bold text-left" },
            { data: "soHieuChungChi", "width": "170px", "className": "text-center" },
            { data: "toChucCap", "width": "200px", "className": "text-center fw-bold" },
            { data: "ngayCap", "width": "130px", "className": "text-center" },
            { data: "ngayHetHan", "width": "130px", "className": "text-center" },
            { data: "tepKemTheo", "width": "230px", "className": "text-center fw-bold" },
            { data: "maChungChi", "width": "auto", "className": "text-center" }
        ]
    })
})

function renderThongTin(maChuyenGia) {
    $.ajax({
        type: "GET",
        url: APIURL + `/api/ChuyenGiaApi/Get?MaChuyenGia=${maChuyenGia}`,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            console.log(data);
            if (data && data.value) {
                let html = `
                    <img id="anhDaiDien" src="${data.value.anhDaiDien ? data.value.anhDaiDien : "/images/anhdaidien.jpg"}" alt="Avatar" class="rounded-circle avatar-img" width="200" height="200" style="margin-bottom:20px;"/> 
                    <button id="editInfoCaNhan" data-id=${maChuyenGia}>Chỉnh sửa thông tin</button>
                    <div class='row w-100'>
                        <div class='col-6'>
                            <p class="heading">Họ và tên</p>
                            <p id="hoTen">${data.value.hoTen}</p>
                        </div>
                        <div class='col-6'>
                            <p class="heading">Giới tính</p>
                            <p id="gioiTinh" data-gt=${data.value.gioiTinh}>${data.value.gioiTinh == 1 ? "Nữ" : data.value.gioiTinh == 0 ? "Nam" : "Khác"}</p>
                        </div>
                    </div>
                    <div class='row w-100'>
                        <div class='col-6'>
                            <p class="heading">Ngày sinh</p>
                            <p id="ngaySinh">${formatDate(data.value.ngaySinh)}</p >
                        </div>
                        <div class='col-6'>
                            <p class="heading">Số điện thoại</span>
                            <p id="soDienThoai">${data.value.soDienThoai}</p>
                        </div>
                    </div>
                    <div class='row w-100'>
                        <div class='col-6'>
                            <p class="heading">Email</p>
                            <p id="email">${data.value.email}</p >
                        </div>
                        <div class='col-6'>
                            <p class="heading">Địa chỉ</span>
                            <p id="diaChi">${data.value.diaChi}</p>
                        </div>
                    </div>
                    <div class='row w-100'>
                        <div class='col-6'>
                            <p class="heading">Chức danh</p>
                            <p id="chucDanh">${data.value.chucDanh}</p >
                        </div>
                        <div class='col-6'>
                            <p class="heading">Chức vụ</span>
                            <p id="chucVu">${data.value.chucVu}</p>
                        </div>
                    </div>
                    <div class='row w-100'>
                        <div class='col-6'>
                            <p class="heading">Số năm kinh nghiệm</p>
                            <p id="soNamKinhNghiem">${data.value.soNamKinhNghiem}</p >
                        </div>
                        <div class='col-6'>
                            <p class="heading">Đơn vị công tác</span>
                            <p id="donViCongTac">${data.value.donViCongTac}</p>
                        </div>
                    </div>
                    <div class='row w-100'>
                        <div class='col-6'>
                            <p class="heading">Chuyên khoa</p>
                            <p id="tenChuyenKhoa" data-ck=${data.value.maChuyenKhoa}>${data.value.tenChuyenKhoa}</p >
                        </div>
                        <div class='col-6'>
                            <p class="heading">Dịch vụ</p>
                            <p id="dichVu">${data.value.dichVu}</p >
                        </div>
                    </div>
                    <div class='row w-100'>
                        <div class='col'>
                            <p class="heading">Giải thưởng nghiên cứu</p>
                            <p id="giaiThuong_NghienCuu">${data.value.giaiThuong_NghienCuu}</p >
                        </div>
                    </div>
                    <div class='row w-100'>
                        <div class='col'>
                            <p class="heading">Giới thiệu</p>
                            <p id="gioiThieu">${data.value.gioiThieu}</p >
                        </div>
                    </div>
                    <div class='row w-100'>
                        <div class='col'>
                            <p class="heading">Kinh nghiệm</p>
                            <p id="kinhNghiem">${data.value.kinhNghiem}</p >
                        </div>
                    </div>
                `
                $('#thongTin').html(html);
            }
        },
        error: function (error) {
            showAlert("Thêm không thành công", "error");
            console.log(error)
        }
    });
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