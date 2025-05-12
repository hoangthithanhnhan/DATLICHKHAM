APIURL = window.location.origin;
let selectedRating = 0;

$(document).ready(function () {

    let maBenhNhan = $('#maBenhNhan').val();

    danhSachLichHen(maBenhNhan)

    $(document).on('click', '.lichHen-item', function () {
        let maLichHen = $(this).data('malichhen');
        renderLichChiTiet(maLichHen);
        $('.lichHen-item').removeClass('active');
        $(this).addClass('active');
    })

    $(document).on('click', '#huyLich', function () {
        let maLichHen = $(this).data('id');
        $('#maLichHenHuyLich').val(maLichHen);
        $('#lyDoHuyLich').val('');
        $('#modalHuyLich').modal('show');
    })

    $(document).on('click', '#btn-HuyLichHen', function () {
        let maLichHen = $('#maLichHenHuyLich').val();
        let lyDoHuyLich = $('#lyDoHuyLich').val();
        let request = {
            maLichHen: maLichHen,
            lyDoHuyLich: lyDoHuyLich
        }
        console.log(maLichHen, lyDoHuyLich);
        if (checkEmptyString(lyDoHuyLich)) {
            showAlert("Lý do hủy lịch không được để trống", "error");
            return;
        }
        else {
            $.ajax({
                url: APIURL + `/api/LichHenApi/HuyLichHen`,
                type: "PUT",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(request),
                success: function (data) {
                    console.log(data);
                    if (data && data.value) {
                        showAlert("Hủy lịch thành công", "success");
                        $('#modalHuyLich').modal('hide');
                        danhSachLichHen(maBenhNhan, maLichHen);
                    }
                    else {
                        alert("Có lỗi xảy ra, vui lòng thử lại sau");
                    }
                },
                error: function (err) {
                    console.log("Lỗi khi gọi API:", err);
                }
            })
        }
    })

    $(document).on('click', '#danhGia', function () {
        let maLichHen = $(this).data('id'); 
        $('#maLichHenDanhGia').val(maLichHen);
        $('#noiDungDanhGia').val('');
        $('.star').removeClass('selected');
        $('#modalDanhGia').modal('show');
    })

    rating();

    $(document).on('click', '#btn-danhGia', function () {
        let maLichHen = $('#maLichHenDanhGia').val();
        let noiDungDanhGia = $('#noiDungDanhGia').val();
        let soSao = selectedRating; 
        let request = {
            maLichHen: maLichHen,
            noiDung: noiDungDanhGia,
            soSao: soSao
        }
        console.log(request);

        if (checkEmptyString(soSao)) {
            showAlert("Đánh giá sao không được để trống", "error");
            return;
        }
        else {
            $.ajax({
                url: APIURL + `/api/DanhGiaApi/Add`,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(request),
                success: function (data) {
                    console.log(data);
                    if (data && data.value) {
                        showAlert("Cảm ơn bạn vì đã đánh giá dịch vụ của chúng tôi!", "success");
                        $('#modalDanhGia').modal('hide');
                        $('#danhGia').addClass('d-none');
                        renderLichChiTiet(maLichHen);
                    }
                    else {
                        alert("Có lỗi xảy ra, vui lòng thử lại sau");
                    }
                },
                error: function (err) {
                    console.log("Lỗi khi gọi API:", err);
                }
            })
        }
    })

})

function rating() {
   
    $('.star-rating .star').on('mouseenter', function () {
        const hoverValue = $(this).data('value');
        $('.star-rating .star').each(function () {
            $(this).toggleClass('hover', $(this).data('value') <= hoverValue);
        });
    });

    $('.star-rating .star').on('mouseleave', function () {
        $('.star-rating .star').removeClass('hover');
    });

    $('.star-rating .star').on('click', function () {
        selectedRating = $(this).data('value');
        $('.star-rating .star').each(function () {
            $(this).toggleClass('selected', $(this).data('value') <= selectedRating);
        });
        // Gửi rating nếu cần
        console.log("Rating đã chọn:", selectedRating);
    });
}

function danhSachLichHen(maBenhNhan,maLichHen) {
    $.ajax({
        url: APIURL + `/api/LichHenApi/GetLichHenByBenhNhan?MaBenhNhan=${maBenhNhan}`,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            console.log(data, 123);
            if (data && data.value && data.value.length > 0) {
                let html = '';
                data.value.forEach(function (item, index) {
                    html += `
                        <div class="lichHen-item ${(maLichHen != null && maLichHen != undefined && maLichHen == item.maLichHen) || (index == 0 && (maLichHen == null || maLichHen == undefined)) ? "active" : ""}" data-malichhen="${item.maLichHen }">
                            <p class="chuyenGia-item">${item.chucDanh} ${item.tenChuyenGia}</p>
                            <p class="thoiGianHen-item">${item.thoiGianLamViec} - ${formatDate(item.ngayHen)}</p>
                            <p class="trangThai-item ${item.trangThai == 0 ? "daDatLich" : item.trangThai == 1 ? "hoanThanh" : "daHuyLich"}">${item.trangThai == 0 ? "Đã đặt lịch" : item.trangThai == 1 ? "Hoàn thành" : "Đã hủy lịch"}</p>
                        </div>
                        `
                })
                $('.lichHenLeft').html(html);

                renderLichChiTiet(maLichHen ? maLichHen : data.value[0].maLichHen);
            }
            else {
                $('.lichHenCaNhan').html('<p class="col-md-12 thongTin">Không có lịch hẹn</p>');
            }
        },
        error: function (err) {
            console.log("Lỗi khi gọi API:", err);
        }
    })
}


function renderLichChiTiet(maLichHen) {
    $.ajax({
        url: APIURL + `/api/LichHenApi/Get?MaLichHen=${maLichHen}`,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            console.log(data);
            if (data && data.value) {
                $('#anhDaiDien').attr("src", data.value.anhDaiDien);
                $('#chucDanh').text(data.value.chucDanh);
                $('#tenChuyenGia').text(data.value.tenChuyenGia)
                let html = `
                        <p>${data.value.maLichHen}</p>
                        <p>${formatDate(data.value.ngayHen)}</p>
                        <p>${data.value.thoiGianLamViec}</p>
                        <p>${data.value.hinhThucKham = 1 ? "Khám trực tiếp " : "Khám online"}</p>
                        <p>${data.value.tenBenhNhan}</p>
                        <p>${data.value.soDienThoai}</p>
                        <p>${data.value.tenDichVu}</p>
                        <p style="color:var(--red);">${data.value.giaDichVu.toLocaleString('vi-VN')} VNĐ</p>
                        <p>${data.value.ghiChu ? data.value.ghiChu : "--"}</p>
                        <p ${data.value.trangThai == 0 ? "style='color:var(--blue);'" : data.value.trangThai == 1 ? "style='color:var(--green);'" : "style='color:var(--red);'"}>${data.value.trangThai == 0 ? "Đã đặt lịch" : data.value.trangThai == 1 ? "Hoàn thành" : "Đã hủy lịch"}</p>
                        ${data.value.trangThai == 1 ? `<p class="valueDanhGia text-warning">${ratingstar(data.value.soSao)}</p>
                                                       ${data.value.noiDungDanhGia ? `<i>${data.value.noiDungDanhGia}</i>` : ""}`
                        : ""}
                        ${data.value.trangThai == 2 ? `<p style="color:var(--red);">${data.value.lyDoHuyLich}</p>` : ""}
                        ${data.value.trangThai == 0 && checkThoiGianHuyLich(data.value.ngayHen, data.value.thoiGianLamViec) ? `<button id="huyLich" data-id="${data.value.maLichHen}">Hủy lịch</button>` : ""}
                        ${data.value.trangThai == 1 && data.value.soSao == null ? `<button class='' id="danhGia" data-id="${data.value.maLichHen}">Đánh giá</button>` : ""}
                    `;
                $('.item-right').html(html);

                if (data.value.trangThai == 1 && data.value.soSao!=null) {
                    $('.titleDanhGia').removeClass('d-none');
                }
                else {
                    $('.titleDanhGia').addClass('d-none');
                }


                if (data.value.trangThai == 2) {
                    $('.titleHuyLich').removeClass('d-none');
                }
                else {
                    $('.titleHuyLich').addClass('d-none');
                }

                $("#qrcode").empty();
                qrcode = new QRCode($("#qrcode")[0], {
                    text: `${maLichHen}`,
                    width: 100,
                    height: 100
                });


            }
            else {
                $('.lichHenRight').html('<p class="thongTin">Không có lịch hẹn</p>');
            }
        },
        error: function (err) {
            console.log("Lỗi khi gọi API:", err);
        }
    })
}

function ratingstar(soSao) {
    let html = '';
    for (let i = 0; i < soSao; i++) {
        html += `&#9733;`;
    }
    return html;
}

function checkThoiGianHuyLich(ngayHen,thoiGianHen) {
    let ngay = new Date(ngayHen);
    let gio = thoiGianHen.split('-')[0];
    let ngayGio = new Date(`${ngay.getFullYear()}-${ngay.getMonth()+1}-${ngay.getDate()} ${gio}`);
    ngayGio.setHours(ngayGio.getHours() - 12);
    let gioHienTai = new Date();
    if (ngayGio > gioHienTai) {
        return true;
    }
    return false;
}