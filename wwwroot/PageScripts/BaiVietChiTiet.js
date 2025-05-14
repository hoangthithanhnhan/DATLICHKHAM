$(document).ready(function () {


    $.ajax({
        type: "GET",
        url: APIURL + `/api/BaiVietApi/Get?MaBaiViet=${MaBaiViet}`,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            console.log(data)
            if (data && data.value) {
                let html = `
                <p id="chuyenMucBaiViet" class="fs-5 fw-bold text-info">${data.value.tenChuyenMuc}</p>
                <h3 id="tieuDeBaiViet">${data.value.tieuDe}</h3>
                <p id="ngayDangBai" class="text-end text-secondary">${formatDate(data.value.thoiGianDangBai)}</p>
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
                            let html = '<h4>Các bài viết liên quan</h4> <div>';
                            $.each(res.value, function (index, item) {
                                if (item.maBaiViet != data.value.maBaiViet) {
                                    html += `
                                            <div class="content-item">
                                                <a class="text-title" href="${linkBaiVietChiTiet}?maBaiViet=${item.maBaiViet}">${item.tieuDe}</a>
                                            </div>
                                            `
                                }
                            })
                            html += '</div>';
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
