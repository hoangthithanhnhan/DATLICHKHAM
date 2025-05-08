APIURL = window.location.origin;

$(document).ready(function () {

    const urlParams = new URLSearchParams(window.location.search);
    const maLichHen = urlParams.get('maLichHen');
    console.log(maLichHen);

    $.ajax({
        url: APIURL + `/api/LichHenApi/Get?MaLichHen=${maLichHen}`,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            console.log(data)
            if (data && data.value) {
                //$('.anhDaiDien').attr('src', data.value.anhDaiDien || '/images/anhdaidien.jpg');
                $('#maLichHen').text(data.value.maLichHen);
                $('#chuyenGia').text(data.value.tenChuyenGia);
                $('#ngay').text(formatDate(data.value.ngayHen));
                $('#thoiGian').text(data.value.thoiGianLamViec);
                $('#dichVu').text(data.value.tenDichVu);
                $('#giaDichVu').text(data.value.giaDichVu.toLocaleString('vi-VN') + ' VNĐ');
                $('#ghiChu').text(data.value.ghiChu ? data.value.ghiChu : "--");
            }
        },
        error: function (err) {
            console.log("Lỗi khi gọi API:", err);
        }
    })

})