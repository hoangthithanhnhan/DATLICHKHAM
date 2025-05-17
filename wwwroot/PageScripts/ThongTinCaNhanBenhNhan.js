APIURL = window.location.origin;

$(document).ready(function () {

    let maBenhNhan = $('#maBenhNhan').val();
    console.log(maBenhNhan);

    renderThongTin(maBenhNhan);

    $(document).on('click', '#editInfoCaNhan', function () {
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
        let ngheNghiep = $('#ngheNghiep').text();
        $('#ngheNghiepEdit').val(ngheNghiep);
        let tienSuBenh = $('#tienSuBenh').text();
        $('#tienSuBenhEdit').val(tienSuBenh);
        let thoiQuenSinhHoat = $('#thoiQuenSinhHoat').text();
        $('#thoiQuenSinhHoatEdit').val(thoiQuenSinhHoat);
        let tinhTrangHonNhan = $('#tinhTrangHonNhan').text();
        $('#tinhTrangHonNhanEdit').val(tinhTrangHonNhan);
        let thuocDangDung = $('#thuocDangDung').text();
        $('#thuocDangDungEdit').val(thuocDangDung);
        let ghiChuKhac = $('#ghiChuKhac').text();
        $('#ghiChuKhacEdit').val(ghiChuKhac);
        let anhDaiDien = $('#anhDaiDien').attr('src');
        $('#anhDaiDienEdit').attr('src', anhDaiDien);
        $('#modalThongTinEdit').modal('show');

    })
    $('#btn-SaveThongTin').on('click', function () {
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
        let fileInput = $("#upload-avatar")[0];
        let file = fileInput.files[0];
        let request = {
            maBenhNhan: maBenhNhan,
            hoTen: hoTen,
            gioiTinh: Number(gioiTinh),
            ngaySinh: ngaySinh,
            diaChi: diaChi,
            soDienThoai: soDienThoai,
            email: email,
            tienSuBenh: tienSuBenh,
            thoiQuenSinhHoat: thoiQuenSinhHoat,
            ngheNghiep: ngheNghiep,
            tinhTrangHonNhan: tinhTrangHonNhan,
            thuocDangDung: thuocDangDung,
            ghiChuKhac: ghiChuKhac
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
                    renderThongTin(maBenhNhan);
                    $('#modalThongTinEdit').modal('hide');
                    showAlert("Cập nhật thành công", "success");
                },
                error: function (error) {
                    showAlert("Cập nhật không thành công", "error");
                    console.log(error, "Log lỗi")
                }
            });
        }
    })
})

function renderThongTin(maBenhNhan) {
    $.ajax({
        type: "GET",
        url: APIURL + `/api/BenhNhanApi/Get?MaBenhNhan=${maBenhNhan}`,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            console.log(data);
            if (data && data.value) {
                let html = `
                    <img id="anhDaiDien" src="${data.value.anhDaiDien ? data.value.anhDaiDien : "/images/anhdaidien.jpg"}" alt="Avatar" class="rounded-circle avatar-img" width="200" height="200" style="margin-bottom:20px;"/> 
                    <button id="editInfoCaNhan">Chỉnh sửa thông tin</button>

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
                            <p class="heading">Nghề nghiệp</p>
                            <p id="ngheNghiep">${data.value.ngheNghiep}</p >
                        </div>
                        <div class='col-6'>
                            <p class="heading">Tình trạng hôn nhân</span>
                            <p id="tinhTrangHonNhan">${data.value.tinhTrangHonNhan}</p>
                        </div>
                    </div>
                    <div class='row w-100'>
                        <div class='col'>
                            <p class="heading">Tiền sử bệnh</p>
                            <p id="tienSuBenh">${data.value.tienSuBenh}</p >
                        </div>
                    </div>
                    <div class='row w-100'>
                        <div class='col'>
                            <p class="heading">Thói quen sinh hoạt</p>
                            <p id="thoiQuenSinhHoat">${data.value.thoiQuenSinhHoat}</p >
                        </div>
                    </div>
                    <div class='row w-100'>
                        <div class='col'>
                            <p class="heading">Thuốc đang dùng</p>
                            <p id="thuocDangDung">${data.value.thuocDangDung}</p >
                        </div>
                    </div>
                    <div class='row w-100'>
                        <div class='col'>
                            <p class="heading">Ghi chú khác</p>
                            <p id="ghiChuKhac">${data.value.ghiChuKhac}</p >
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