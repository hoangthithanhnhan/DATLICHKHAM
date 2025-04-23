let APIURL = window.location.origin;
$(document).ready(function () {
    renderChuyenGia();
})
function renderChuyenGia(keyword = "") {
    $.ajax({
        url: APIURL+ "/api/ChuyenGiaApi/Gets",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ keyword: keyword }),
        success: function (data) {
            console.log(data)
            if (data && data.value && data.value.length > 0) {
                $.each(data.value, function (index, value) {
                    if (value.trangThai == true) {
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
                                <a href="#" class="btn-datKhamNgay">Đặt khám ngay</a>
                            </div>
                        </div>
                    `
                        $('#renderChuyenGia').append(html);
                    }
                })
            }   
        },
        error: function (err) {
            console.log("Lỗi khi gọi API:", err);
        }
    });
}