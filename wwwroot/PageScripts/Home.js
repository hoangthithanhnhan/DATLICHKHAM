$(document).ready(function () {

    $.ajax({
        url: APIURL + "/api/ChuyenGiaApi/Gets",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ keyword: "" }),
        success: function (data) {
            if (data && data.value && data.value.length > 0) {
                let html = '';
                $.each(data.value, function (index, value) {
                    if (value.trangThai == true) {
                        html += `
                        <div class="card item">
                            <div class="block-img">
                                <img src="${value.anhDaiDien ? value.anhDaiDien : "/images/anhdaidien.jpg"}" class="card-img-top" alt="...">
                            </div>
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title flex-grow-1"><a href="">${value.chucDanh} ${value.hoTen}</a></h5>
                                <p class="card-text flex-grow-1">${value.tenChuyenKhoa}</p>
                            </div>
                        </div>
                    `
                    }
                })
                $('#trinhDienChuyenGia').html(html);
                $('#trinhDienChuyenGia').owlCarousel({
                    loop: true,
                    margin: 8,
                    autoplay: true,
                    autoplayTimeout: 3000,
                    dots: true,
                    responsive: {
                        0: {
                            items: 1
                        },
                        600: {
                            items: 3
                        },
                        1000: {
                            items: 4
                        }
                    }
                })

                let maxHeight = 0;
                $('#trinhDienChuyenGia .item').each(function () {
                    var height = $(this).outerHeight();
                    if (height > maxHeight) {
                        maxHeight = height;
                    }
                });
                $('#trinhDienChuyenGia .item').height(maxHeight);
            }
        },
        error: function (err) {
            console.log("Lỗi khi gọi API:", err);
        }
    });

    $.ajax({
        url: APIURL + "/api/DichVuApi/Gets",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            keyword: "",
            trangThai: true
        }),
        success: function (data) {
            if (data && data.value && data.value.length > 0) {
                let html=''
                $.each(data.value, function (index, value) {
                    html += `
                            <div class="col-2">
                                <div class="block-category h-100">
                                    <img src="${value.anhDaiDien ? value.anhDaiDien : "/images/anhdaidien.jpg"}" alt="">
                                    <a href="/DichVu/DanhSachChuyenGia?maDichVu=${value.maDichVu}" class="title">${value.tenDichVu}</a>
                                </div>
                            </div>
                        `
                })
                $('#trinhDienDichVu').html(html);
            }
        },
        error: function (err) {
            console.log("Lỗi khi gọi API:", err);
        }
    });

    $.ajax({
        type: 'GET',
        url: APIURL + `/api/BaiVietApi/GetsBaiVietByChuyenMuc?&PageIndex=1&PageSize=6`,
        dataType: 'json',
        success: function (data) {
            console.log(data)
            if (data && data.value && data.value.length > 0) {
                let html = `<div class="tinBaiLeft col-7">`;
                $.each(data.value, function (index, item) {
                    if (index == 0) {
                        html +=
                            `<div class="card" style="width: 100%;">
                                <a href='${linkBaiVietChiTiet}?maBaiViet=${item.maBaiViet}' class="img"><img src="${item.anhDaiDien}" class="card-img-top" alt="..."></a>
                                <div class="card-body">
                                    <a class="chuyenMuc">${item.tenChuyenMuc} </a>
                                    <a href='${linkBaiVietChiTiet}?maBaiViet=${item.maBaiViet}' class="tieuDe">${item.tieuDe}</a>
                                    <a href='${linkBaiVietChiTiet}?maBaiViet=${item.maBaiViet}' class="tomTat">${item.tomTat ? item.tomTat : item.noiDung}</a>
                                    <p class="thoiGianDang">${formatDate(item.thoiGianDangBai)} </p>
                                </div>
                            </div>
                            </div >
                            <div class="tinBaiRight col-5">
                        `
                    }
                    else {
                        html += `
                            <div class="card mb-3" style="max-width: 540px;">
                                <div class="row g-0">
                                    <div class="col-md-5">
                                        <a href='${linkBaiVietChiTiet}?maBaiViet=${item.maBaiViet}' class="img"><img src="${item.anhDaiDien}" class="card-img-top" alt="..."></a>
                                    </div>
                                    <div class="col-md-7">
                                        <div class="card-body">
                                            <a class="chuyenMuc">${item.tenChuyenMuc}</a>
                                            <a href='${linkBaiVietChiTiet}?maBaiViet=${item.maBaiViet}' class="tieuDe">${item.tieuDe}</a>
                                            <p class="thoiGianDang">${formatDate(item.thoiGianDangBai)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    `
                    }
                })
                html += `</div>`;
                $(`#baiVietMoiNhat`).html(html);
            }
        },
        error: function (e) {
            console.log(e);
        }
    });

    $.ajax({
        url: APIURL + "/api/DanhGiaApi/GetsTop3DanhGia",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data && data.value && data.value.length > 0) {
                let html = ''
                $.each(data.value, function (index, value) {
                    html += `
                            <div class="card mb-3" style="max-width: 400px;">
                                <div class="card-header">
                                    <img src="/images/rating.png" alt="">
                                    <p class="card-text">
                                        ${value.noiDung}
                                    </p>
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">${value.hoTen}</h5>
                                    <div class="rating">
                                        ${ratingstar(value.soSao)}
                                    </div>
                                </div>
                            </div>
                        `
                })
                $('#danhGia').html(html);
            }
        },
        error: function (err) {
            console.log("Lỗi khi gọi API:", err);
        }
    });

})
function ratingstar(soSao) {
    let html = '';
    for (let i = 0; i < soSao; i++) {
        html += `&#9733;`;
    }
    return html;
}