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
                        }
                    
                        html += `<li data-id=${item.maChuyenMuc}>${item.tenChuyenMuc}</li>`
                    }
                })
                $('#chuyenMucBaiViet').html(html);
            }
        },
        error: function (error) {
            showAlert("Lỗi tải chuyên mục không thành công", "error");
        }
    });

    renderBaiViet("baiViet", linkBaiVietChiTiet, maChuyenMuc, 1, 1)
    $(document).on("page", '#pagination', function (evt, page) {
        renderBaiViet('baiViet', linkBaiVietChiTiet, maChuyenMuc, page, 1);
    });

    $(document).on('click', '#chuyenMucBaiViet li', function () { 
        maChuyenMuc = $(this).data('id');   
        renderBaiViet('baiViet', linkBaiVietChiTiet, maChuyenMuc, 1, 1);
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
                    html += `
                        <div class="content-item">
                            <a href="#"><img class="img-cover" src='' alt=""></a>
                            <div class="text">
                                <a class="text-title" href="${linkBaiVietChiTiet}?maBaiViet=${item.maBaiViet}">${item.tieuDe}</a>
                                <a class="text-detail" href="${linkBaiVietChiTiet}?maBaiViet=${item.maBaiViet}">${item.tomTat}</a>
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