let APIURL = window.location.origin;

$(document).ready(function () {

    formatInputDate("#setNgay");
    formatInputDate("#lichHen");

    getMaChuyenGia();

    const today = new Date();
    $('#lichHen').val(formatDate(today));
    $('#setNgay').val(formatDate(today));

    $('#setNgay').on('change', function () {
        renderLichLamViec();
    })

    $('#btn-addThoiGian').on('click', function () {
        addLichLamViec();
    })

    $(document).on('click', '.btn-deleteLichLamViec', function () {
        deleteLichLamViec(this);
    })

    $('#lichHen').on('change', function () {
        let ngayHen = $(this).val();
        let maChuyenGia = $('#maChuyenGia').val();
        renderLichHen(maChuyenGia, ngayHen)
    })

    $(document).on('click', '.thongTinChiTiet', function () {
        let maLichHen = $(this).data('id');
        if (maLichHen) {
            $.ajax({
                url: APIURL + `/api/LichHenApi/Get?MaLichHen=${maLichHen}`,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                        console.log(data)
                    if (data && data.value) {
                        if (data.value.trangThai == 1) {
                            $('#btn-HoanThanh').addClass('d-none');
                        }
                        else {
                            $('#btn-HoanThanh').removeClass('d-none');
                        }
                        $('#getHoTen').text(data.value.tenBenhNhan);
                        $('#getDichVu').text(data.value.tenDichVu);
                        $('#getNgayHen').text(formatDate(data.value.ngayHen));
                        $('#getThoiGian').text(data.value.thoiGianLamViec);
                        $('#getHinhThuc').text(data.value.hinhThucKham = 1 ? 'Trực tiếp' : 'Online');
                        $('#getGhiChu').text(data.value.ghiChu ? data.value.ghiChu:'--');
                        $('#getMaLichHen').val(data.value.maLichHen);
                    }
                    else {
                        $('#thongTinLichHen').html('<p class="thongTin">Không có lịch hẹn</p>');
                    }
                },
                error: function (err) {
                    console.log("Lỗi khi gọi API:", err);
                }
            })
        }
        $('#chiTietLichHen').modal('show');
    })

    $('#btn-HoanThanh').on('click', function () {
        let maLichHen = $('#getMaLichHen').val();
        let ngayHen = $('#lichHen').val();
        let maChuyenGia = $('#maChuyenGia').val();
        $.ajax({
            url: APIURL + `/api/LichHenApi/UpdateTrangThai?MaLichHen=${maLichHen}`,
            type: "PUT",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                $('#chiTietLichHen').modal('hide');
                showAlert("Cập nhật lịch hẹn thành công", "success");
                renderLichHen(maChuyenGia, ngayHen)
            },
            error: function (err) {
                console.log("Lỗi khi gọi API:", err);
            }
        })
    })

});


function renderLichHen(maChuyenGia,ngayHen) {
    $.ajax({
        url: APIURL + `/api/LichHenApi/GetLichHenByChuyenGiaByNgay?MaChuyenGia=${maChuyenGia}&NgayHen=${formatDateSQL(ngayHen)
            }`,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data && data.value && data.value.length > 0) {
                let html = '';
                data.value.forEach(function (item) {
                    html += `
                        <div class="thongTinChiTiet ${item.trangThai != 0 ?'bg-success bg-opacity-10':''}" data-id="${item.maLichHen}"> 
                            <div class="time">
                                <span class="tenBenhNhan">${item.tenBenhNhan}</span>
                                <span>${item.thoiGianLamViec}</span>
                            </div>
                            <div class="thoiDiemDat">
                                <span style="color:grey">1 giờ trước</span>
                                <span class="hinhThuc">${item.hinhThucKham ? 'Trực tiếp' : 'Online'}</span>
                            </div>
                        </div>
                        `
                })
                $('#thongTinLichHen').html(html);
            }
            else {
                $('#thongTinLichHen').html('<p class="thongTin">Không có lịch hẹn</p>');
            }
        },
        error: function (err) {
            console.log("Lỗi khi gọi API:", err);
        }
    })
}

function renderLichLamViec() {
    let ngay = $('#setNgay').val();
    let maChuyenGia = $('#maChuyenGia').val();
    $.ajax({
        url: APIURL + `/api/LichLamViecChuyenGiaApi/GetsLichLamViecChuyenGiaByNgay?Ngay=${formatDateSQL(ngay)
    } & MaChuyenGia=${ maChuyenGia }`,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $('#setThoiGian').empty();
            if (data && data.value && data.value.length > 0) {
                $.each(data.value, function (index, value) {
                    let html = `
                    <div class="thoiGian">
                        <span class="time">${value.thoiGianLamViec}</span> <span class="btn-deleteLichLamViec">
                        <i class="fa fa-times"></i></span> 
                        <input type="text" class="maLichLamViec" value='${value.maLichLamViec}' hidden/>
                    </div>
                `
                    $('#setThoiGian').append(html);
                })
            }
        },
        error: function (err) {
            console.log("Lỗi khi gọi API:", err);
        }
    });
}
function addLichLamViec() {
    let ngay = $('#setNgay').val();
    let maChuyenGia = $('#maChuyenGia').val();
    let thoiGianLamViec = $('#addThoiGian').val();
    let request = {
        ngay: formatDateSQL(ngay),
        thoiGianLamViec: thoiGianLamViec,
        maChuyenGia: maChuyenGia
    }
    console.log(request)
    if (checkEmptyString(thoiGianLamViec)) {
        showAlert("Thời gian làm việc không được để trống", "error");
        return;
    }
    if (checkEmptyString(ngay)) {
        showAlert("Ngày không được để trống", "error");
        return;
    }
    $.ajax({
        url: APIURL + `/api/LichLamViecChuyenGiaApi/Add`,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(request),
        success: function (data) {
            renderLichLamViec();
            $('#addThoiGian').val('');
        },
        error: function (err) {
            console.log("Lỗi khi gọi API:", err);
        }
    });
}
function deleteLichLamViec(btn) {
    let maLichLamViec = $(btn).closest('.thoiGian').find('.maLichLamViec').val();
    console.log("Mã cần xoá:", maLichLamViec);

    $.ajax({
        url: APIURL + `/api/LichLamViecChuyenGiaApi/Delete?MaLichLamViec=${maLichLamViec}`,
        type: "DELETE",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            renderLichLamViec(); // Cập nhật lại giao diện
        },
        error: function (err) {
            console.log("Lỗi khi gọi API:", err);
        }
    });
}
function getMaChuyenGia() {
    $.ajax({
        url: APIURL + `/api/ChuyenGiaApi/user-info`,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            const value = data.value;
            $('#maChuyenGia').val(value.maChuyenGia);
        },
    });
}