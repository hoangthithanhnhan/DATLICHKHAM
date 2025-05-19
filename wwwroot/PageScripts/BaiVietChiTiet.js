$(document).ready(function () {


    $.ajax({
        type: "GET",
        url: APIURL + `/api/BaiVietApi/Get?MaBaiViet=${MaBaiViet}`,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            console.log(data)
            if (data && data.value) {
                let html = `
                <p id="chuyenMucBaiViet" class="fs-5 fw-bold" style="color:var(--lightblue);">${data.value.tenChuyenMuc}</p>
                <h3 id="tieuDeBaiViet">${data.value.tieuDe}</h3>
                <p id="ngayDangBai" class="text-end text-secondary">Ngày đăng: ${formatDate(data.value.thoiGianDangBai)}</p>
                <p id="tomTatBaiViet" class="fst-italic" style="text-align:justify;">
                    ${data.value.tomTat}
                </p>
                <div class="anhDaiDien text-center mb-3"><img id="anhDaiDienBaiViet" src="${data.value.anhDaiDien}" alt="..."></div>
                <div id="noiDungBaiViet" style="text-align:justify;">
                    ${data.value.noiDung}
                </div>
                `
                $('#baiVietChiTiet').html(html);
                $.ajax({
                    type: 'GET',
                    url: APIURL + `/api/BaiVietApi/GetsBaiVietByChuyenMuc?MaChuyenMuc=${data.value.maChuyenMuc}&PageIndex=1&PageSize=5`,
                    dataType: 'json',
                    success: function (res) {
                        if (res && res.value && res.value.length > 0) {
                            let html = '<h4><i class="fa-solid fa-file-lines"></i> Các bài viết liên quan</h4> <div><ul>';
                            $.each(res.value, function (index, item) {
                                if (item.maBaiViet != data.value.maBaiViet) {
                                    html += `
                                    <li><a class="text-title" href="${linkBaiVietChiTiet}?maBaiViet=${item.maBaiViet}">${item.tieuDe} <span class="ngayDang">(${formatDate(data.value.thoiGianDangBai)})</span></a></li>
                                            `
                                }
                            })
                            html += '</ul></div>';
                            $(`#cacBaiVietKhac`).html(html);
                        }
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
            }
            else {
                $('#baiVietChiTiet').html('<p>Không có dữ liệu</p>');
            }
        },
        error: function (error) {
            showAlert("Xóa không thành công", "error");

        }
    });

})
