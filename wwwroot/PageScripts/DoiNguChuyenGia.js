let APIURL = window.location.origin;

$(document).ready(function () {
    renderChuyenGia();

    // Sự kiện khi người dùng click "Đặt lịch ngay"
    $(document).on('click', '.btn-datKhamNgay', function () {
        const maChuyenGia = $(this).data('id');
        $('#idChuyenGia').val(maChuyenGia);
        $.ajax({
            url: APIURL + `/api/DichVuChuyenGiaApi/GetDichVuByChuyenGia?MaChuyenGia=${maChuyenGia}`,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                if (data?.isSuccess && data.value?.length > 0) {
                    $('#selectDichVu').empty();
                    data.value.map(item => {
                        $('#selectDichVu').append(
                            `<option value="${item.maDichVu}">${item.tenDichVu}</option>`
                        );
                    });
                }
                else {
                    $('#selectDichVu').empty();
                }
            },
            error: function (err) {
                console.error("Lỗi khi gọi API lấy dịch vụ:", err);
            }
        });
    });

    // Sự kiện khi người dùng nhấn "Xác nhận đặt lịch"
    $('#btn-DatLichHen').on('click', function () {
        let maDichVu = $('#selectDichVu').val();
        let maChuyenGia = $('#idChuyenGia').val();
        // Lấy giá trị của dịch vụ đã chọn
        console.log("Mã Dịch Vụ:", maDichVu);
        console.log("Mã Chuyên Gia:", maChuyenGia);

        // Điều hướng tới trang đặt lịch khám và truyền tham số vào URL
        window.location.href = `/DatLichKham?maDichVu=${maDichVu}&maChuyenGia=${maChuyenGia}`;
    });
});

// Hàm render danh sách chuyên gia
function renderChuyenGia(keyword = "") {
    $.ajax({
        url: APIURL + "/api/ChuyenGiaApi/Gets",
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
                                <button href="#" class="btn-datKhamNgay" data-bs-toggle="modal" data-bs-target="#chonDichVu" data-id=${value.maChuyenGia}>Đặt lịch ngay</button>
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
