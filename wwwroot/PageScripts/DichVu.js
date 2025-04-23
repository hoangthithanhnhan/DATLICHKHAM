let APIURL = window.location.origin;
$(document).ready(function () {
    renderDichVu();
})
function renderDichVu(keyword = "") {
    $.ajax({
        url: APIURL + "/api/DichVuApi/Gets",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            keyword: keyword,
            trangThai: true
        }),
        success: function (data) {
            if (data && data.value && data.value.length > 0) {
                $.each(data.value, function (index, value) {
                    if (value.trangThai == true) {
                        let html = `
                                <div class="dichVu card">
                                    <div class="dichVuAvatar">
                                        <img class="anhDaiDienDichVu" src="${value.anhDaiDien ? value.anhDaiDien : "/images/anhdaidien.jpg"}" alt="Alternate Text" />
                                    </div>
                                    <div class="dichVu-right">
                                        <div class="dichVuInfo">
                                            <p class="tenDichVu">${value.tenDichVu}</p>
                                            <p class="motaDichVu">${value.moTa}</p>
                                        </div>
                                        <div class="timChuyenGia">
                                            <a href="/DichVu/DanhSachChuyenGia?id=${value.maDichVu}" class="btn-timChuyenGia">Tìm chuyên gia <img src="./images/right.png" alt="Alternate Text" /></a>
                                        </div>
                                    </div>
                                </div>
                            `
                        $('#renderDichVu').append(html);
                    }
                    
                })
            }
        },
        error: function (err) {
            console.log("Lỗi khi gọi API:", err);
        }
    });
}
