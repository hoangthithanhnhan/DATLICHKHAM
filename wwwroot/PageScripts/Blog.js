$(document).ready(function () {

    let maChuyenMuc;

    $.ajax({
        type: "POST",
        url: APIURL + `/api/ChuyenMucApi/Gets`,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ keyword: null }),
        async: false,
        success: function (data) {
            console.log(data)
            if (data && data.value && data.value.length > 0) {
                let count = 0;
                let html = '';
                data.value.forEach(function (item) {
                    if (item.trangThai) {
                        count++;
                        if (count == 1) {
                            maChuyenMuc = item.maChuyenMuc;
                            html += `<li class="active" data-id="${item.maChuyenMuc}">${item.tenChuyenMuc}</li>`;
                        }
                        else {
                            html += `<li  data-id=${item.maChuyenMuc}>${item.tenChuyenMuc}</li>`
                        }
                    }
                })
                $('#chuyenMucBaiViet').html(html);
            }
        },
        error: function (error) {
            showAlert("Lỗi tải chuyên mục không thành công", "error");
        }
    });

    renderBaiViet("baiViet", linkBaiVietChiTiet, maChuyenMuc, 1, 10)
    $(document).on("page", '#pagination', function (evt, page) {
        renderBaiViet('baiViet', linkBaiVietChiTiet, maChuyenMuc, page, 10);
    });

    $(document).on('click', '#chuyenMucBaiViet li', function () { 
        maChuyenMuc = $(this).data('id');   
        renderBaiViet('baiViet', linkBaiVietChiTiet, maChuyenMuc, 1, 10);
        $('#chuyenMucBaiViet li').removeClass('active');
        $(this).addClass('active');
    })

    console.log(linkBaiVietChiTiet)

})

function renderBaiViet(element,linkBaiVietChiTiet,maChuyenMuc, pageIndex, pageSize) {
    $.ajax({
        type: 'GET',
        url: APIURL + `/api/BaiVietApi/GetsBaiVietByChuyenMuc?MaChuyenMuc=${maChuyenMuc}&PageIndex=${pageIndex}&PageSize=${pageSize}`,
        dataType: 'json', 
        success: function (data) {
            if (data && data.value && data.value.length > 0) {
                let html = '';
                $.each(data.value, function (index, item) {
                    console.log(item)
                    html += `
                        <div class="content-item">
                            <a href="${linkBaiVietChiTiet}?maBaiViet=${item.maBaiViet}"><img class="img-cover" src='${item.anhDaiDien}' alt=""></a>
                            <div class="text">
                                <a class="text-title" href="${linkBaiVietChiTiet}?maBaiViet=${item.maBaiViet}">${item.tieuDe}</a>
                                <a class="text-detail" href="${linkBaiVietChiTiet}?maBaiViet=${item.maBaiViet}">${item.tomTat ? item.tomTat : item.noiDung}</a>
                                <p class="text-date text-end">${formatDate( item.thoiGianDangBai)}</p >
                            </div>
                        </div>
                    `
                })
                $(`#${element}`).html(html);

                if ($('#pagination').data("twbsPagination") != null) {
                    $('#pagination').twbsPagination('destroy');
                }
                $('#pagination').twbsPagination({
                    totalPages: Math.ceil(data.value[0].totalRows / pageSize),
                    visiblePages: 3,
                    initiateStartPageClick: false,
                    startPage: pageIndex,
                    hideOnlyOnePage: true,
                    first: '<img src="/images/arrow_previous.png" alt="">',
                    prev: '<img src="/images/chevron_left.png" alt="">',
                    next: '<img src="/images/chevron_right.png" alt="">',
                    last: '<img src="/images/arrow_next.png" alt="">'
                });
            }
        },
        error: function (e) {
            console.log(e);
        }
    });
}