let APIURL = window.location.origin;
$(document).ready(function () {
    let currentURL = new URLSearchParams(window.location.search);
    let id = currentURL.get('id');
    renderTenDichVu(id);
    renderChuyenGiaByDichVu(id);
})
function renderChuyenGiaByDichVu(id) {
    $.ajax({
        url: APIURL + `/api/ChuyenGiaApi/GetChuyenGiaByDichVu?MaDichVu=${id}`,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            console.log(data)
            if (data && data.value && data.value.length > 0) {
                $.each(data.value, function (index, value) {
                    let html = `
                    <div class="chuyenGia card">
                        <div class="chuyenGiaAvatar">
                            <img class="anhDaiDienChuyenGia" src="${value.anhDaiDien ? value.anhDaiDien : "/images/anhdaidien.jpg"}" alt="Alternate Text" />
                        </div>
                        <div class="chuyenGiaInfo">
                            <p class="tenChuyenGia">${value.chucDanh} ${value.hoTen}</p>
                            <p class="gioiThieuChuyenGia"><span class="thongtinChuyenGia">Chuyên khoa </span>${value.tenChuyenKhoa}</p>
                            <p class="gioiThieuChuyenGia"><span class="thongtinChuyenGia">Chức vụ </span>${value.chucVu}</p>
                            <p class="gioiThieuChuyenGia"><span class="thongtinChuyenGia">Dịch vụ </span>${value.dichVu}</p>
                            <p class="gioiThieuChuyenGia"><span class="thongtinChuyenGia">Đơn vị công tác </span>${value.donViCongTac} </p>
                        </div>
                        <div class="datKhamNgay">
                            <a href="/DatLichKham?maDichVu=${id}&maChuyenGia=${value.maChuyenGia}" class="btn-datKhamNgay">Đặt khám ngay</a>
                        </div>
                    </div>
                `
                    $('#renderChuyenGia').append(html);
                })
            }
        },
        error: function (err) {
            console.log("Lỗi khi gọi API:", err);
        }
    });
}
function renderTenDichVu(id) {
    $.ajax({
        url: APIURL + `/api/DichVuApi/Get?MaDichVu=${id}`,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
                let html = `
                    <div class="line"></div>
                    <h2 style="color:var(--pink);">${data.value.tenDichVu}</h2>
                    <div class="line"></div>
                    `
                $('#blockTitleDichVu').append(html);
        },
        error: function (err) {
            console.log("Lỗi khi gọi API:", err);
        }
    });
}
