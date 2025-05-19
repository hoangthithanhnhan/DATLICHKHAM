let APIURL = window.location.origin;
$(document).ready(function () {
    $.ajax({
        url: APIURL + `/api/ThongKeApi/ThongKe_TongQuat`,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            console.log(data);
            if (data && data.value) {
                let html = `
                    <div class="col-lg-3 col-6">
                        <div class="small-box bg-success">
                            <div class="inner">
                                <h3>${data.value.tongSoBenhNhan}</h3>
                                <p class="fw-bold fs-5">Tổng số bệnh nhân</p>
                            </div>  
                            <div class="icon">
                               <i class="fas fa-users"></i>
                            </div>
                            <a href="/cms/QuanLyBenhNhan" class="small-box-footer">Xem thêm <i class="fas fa-arrow-circle-right"></i></a>
                        </div>
                    </div>
                    <div class="col-lg-3 col-6">
                        <div class="small-box bg-info">
                            <div class="inner">
                                <h3>${data.value.tongSoChuyenGia}</h3>
                                <p class="fw-bold fs-5">Tổng số chuyên gia</p>
                            </div>  
                            <div class="icon">
                               <i class="fas fa-user-md"></i>
                            </div>
                            <a href="/cms/QuanLyChuyenGia" class="small-box-footer">Xem thêm <i class="fas fa-arrow-circle-right"></i></a>
                        </div>
                    </div>
                    <div class="col-lg-3 col-6">
                        <div class="small-box bg-warning">
                            <div class="inner">
                                <h3>${data.value.tongSoLichHen}</h3>
                                <p class="fw-bold fs-5">Tổng số lịch hẹn</p>
                            </div>  
                            <div class="icon">
                               <i class="fas fa-calendar-check"></i>
                            </div>
                            <a href="/cms/QuanLyLichKham" class="small-box-footer">Xem thêm <i class="fas fa-arrow-circle-right"></i></a>
                        </div>
                    </div>
                    <div class="col-lg-3 col-6">
                        <div class="small-box bg-danger">
                            <div class="inner">
                                <h3>${data.value.lichHenHomNay}</h3>
                                <p class="fw-bold fs-5">Lich hẹn hôm nay</p>
                            </div>  
                            <div class="icon">
                               <i class="fas fa-calendar-day"></i>
                            </div>
                            <a href="/cms/QuanLyLichKham" class="small-box-footer">Xem thêm <i class="fas fa-arrow-circle-right"></i></a>
                        </div>
                    </div>
                `;
                $('#thongKeTongQuat').html(html);
            }
        }
    })

    $.ajax({
        url: `/api/ThongKeApi/ThongKe_DoanhThu?Nam=2025`,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            if (res && res.value) {
                const labels = res.value.map(item => 'Tháng ' + item.thang);
                const data = res.value.map(item => item.tongDoanhThu);

                const ctx = $('#doanhThuChart');

                new Chart(ctx, {
                    type: 'line', // bạn có thể đổi thành 'line' nếu muốn
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Tổng doanh thu (VNĐ)',
                            data: data,
                            backgroundColor: 'rgba(60,141,188,0.9)',
                            borderColor: 'rgba(60,141,188,1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function (value) {
                                        return value.toLocaleString('vi-VN') + ' đồng';
                                    }
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        return context.dataset.label + ': ' + context.parsed.y.toLocaleString('vi-VN') + ' đồng';
                                    }
                                }
                            }
                        }
                    }
                });
            } else {
                console.warn('Dữ liệu trả về không hợp lệ');
            }
        },
        error: function (err) {
            console.error("Lỗi AJAX:", err);
        }
    });


})