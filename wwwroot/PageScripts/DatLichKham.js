APIURL = window.location.origin;

$(document).ready(function () {
    
    $('.section-ThoiGianHen').on('click', '.thoiGian:not(.unavailble)', function () {
        const _this = $(this);
        if (_this.hasClass('checked')) {
            _this.removeClass('checked');
        } else {
            $('.thoiGian').removeClass('checked');
            _this.addClass('checked');
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const maDichVu = urlParams.get('id');
    const maChuyenGia = urlParams.get('maChuyenGia');

    $.ajax({
        url: APIURL + `/api/ChuyenGiaApi/Get?MaChuyenGia=${maChuyenGia}`,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ keyword: "" }),
        success: function (data) {
            if (data && data.value) {
                $('.anhDaiDien').attr('src', data.value.anhDaiDien || '/images/anhdaidien.jpg');
                $('.tenChuyenGia').text(data.value.chucDanh + ' ' + data.value.hoTen);
                $('.soNam').text(data.value.soNamKinhNghiem ? data.value.soNamKinhNghiem: '');
                $('.valueCongTacTai').text(data.value.donViCongTac ? data.value.donViCongTac : '');
                $('.valueChuyenKhoa').text(data.value.tenChuyenKhoa ? data.value.tenChuyenKhoa : '');
                $('.valueChucVu').text(data.value.chucVu ? data.value.chucVu : '');
                if (data.value.gioiThieu != null && data.value.gioiThieu != '' && data.value.gioiThieu != undefined) {
                    $('.gioiThieu').text(data.value.gioiThieu)
                }
                else {
                    $('.section-gioiThieu').addClass('d-none');
                }
                if (data.value.kinhNghiem != null && data.value.kinhNghiem != '' && data.value.kinhNghiem != undefined) {
                    $('.kinhNghiem').text(data.value.kinhNghiem)
                }
                else {
                    $('.section-KinhNghiem').addClass('d-none');
                }
                if (data.value.giaiThuong_NghienCuu != null && data.value.giaiThuong_NghienCuu != '' && data.value.giaiThuong_NghienCuu != undefined) {
                    $('.giaiThuong').text(data.value.giaiThuong_NghienCuu)
                }
                else {
                    $('.section-GiaiThuongNghienCuu').addClass('d-none');
                }
            }
        },
        error: function (err) {
            console.log("Lỗi khi gọi API:", err);
        }
    })

    $.ajax({
        url: APIURL + `/api/DichVuApi/Get?MaDichVu=${maDichVu}`,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data && data.value ) {
                $('.tenDichVu').text(data.value.tenDichVu);
                $('.giaDichVu').text(data.value.giaDichVu.toLocaleString('vi-VN') + ' VNĐ');
            }
            else {
                $('.tenDichVu').addClass('d-none');
                $('.giaDichVu').addClass('d-none');
            }
        },
        error: function (err) {
            console.log("Lỗi khi gọi API:", err);
        }
    })

    $.ajax({
        url: APIURL + `/api/ChungChiChuyenGiaApi/Gets?MaChuyenGia=${maChuyenGia}`,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data && data.value && data.value.length > 0) {
                let html = ''
                data.value.forEach(function (item) {
                    html += `<div class="chungNhan">
                             <p style="text-align:center; font-weight: 700;font-style: italic;">Chứng chỉ ${item.tenChungChi}</p>
                             <div class="anhChungNhan">
                            `
                    item.tepKemTheo.forEach(function (img) {
                        html += `<img src="${img.duongDan}" alt="Chứng nhận chuyên môn" />`
                    })
                    html += `</div>
                             </div>
                            `
                })
                $('#block-chungNhan').html(html);
            }
            else {
                $('.section-chungNhan').addClass('d-none');
            }
        },
        error: function (err) {
            console.log("Lỗi khi gọi API:", err);
        }
    })


    $('#ngayHenAdd').on('change', function () {
        let ngayHen = $(this).val();
        $.ajax({
            url: APIURL + `/api/LichLamViecChuyenGiaApi/GetsLichLamViecChuyenGiaByNgay?Ngay=${ngayHen}&MaChuyenGia=${maChuyenGia}`,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                console.log(data);
                if (data && data.value && data.value.length>0) {
                    let html=''
                    data.value.forEach(function (item) {
                        html += `<p data-id="${item.maLichLamViec}" class="thoiGian ${item.trangThai ? "unavailble" : ""}">${item.thoiGianLamViec}</p>`
                    })
                    $('.section-ThoiGianHen').html(html);
                }
                else {
                    $('.section-ThoiGianHen').html('<p class="thongTin">Không có lịch hẹn</p>');
                }
            },
            error: function (err) {
                console.log("Lỗi khi gọi API:", err);
            }
        })
    })

    $('#btn-datLichNgay').on('click', function () {
        let maBenhNhan = $('#maBenhNhan').val();
        let maChuyenGia = urlParams.get('maChuyenGia');
        let maDichVu = urlParams.get('id');
        let ngayHen = $('#ngayHenAdd').val();
        let thoiGianHen = $('.thoiGian.checked').data('id');
        let ghiChu = $('#ghiChuAdd').val();
        let hinhThucKham = $('input[name="hinhThucAdd"]:checked').val();
        let request = {
            maBenhNhan: maBenhNhan,
            maChuyenGia: maChuyenGia,
            maDichVu: maDichVu,
            ngayHen: ngayHen,
            thoiGianHen: thoiGianHen,
            ghiChu: ghiChu,
            hinhThucKham: Boolean(Number(hinhThucKham))
        }
        console.log(request);
        if (checkEmptyString(hinhThucKham)) {
            showAlert("Hình thức không được để trống", "error");
            return;
        }
        if (checkEmptyString(ngayHen)) {
            showAlert("Ngày hẹn không được để trống", "error");
            return;
        }
        if (checkEmptyString(thoiGianHen)) {
            showAlert("Thời gian hẹn không được để trống", "error");
            return;
        }
        else {
            $.ajax({
                type: "POST",
                url: APIURL + "/api/LichHenApi/Add",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(request),
                success: function (data) {
                    console.log(data)
                    showAlert("Thêm thành công", "success");
                },
                error: function (error) {
                    showAlert("Thêm không thành công", "error");
                    console.log(error.responseText);
                }
            });
        }
    })

})