let APIURL = window.location.origin;
$(document).ready(function () {
    $.ajax({
        url: APIURL + `/api/ThongKeApi/ThongKeTongQuat`,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
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
                                <p class="fw-bold fs-5">Lịch hẹn hôm nay</p>
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
        url: `/api/ThongKeApi/ThongKeDoanhThu?Nam=2025`,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            if (res && res.value) {
                const labels = res.value.map(item => 'Tháng ' + item.thang);
                const data = res.value.map(item => item.tongDoanhThu);

                const ctx = $('#doanhThuChart');

                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Tổng doanh thu (VNĐ)',
                            data: data,
                            backgroundColor: 'transparent',
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
                console.log('Dữ liệu trả về không hợp lệ');
            }
        },
        error: function (err) {
            console.error("Lỗi AJAX:", err);
        }
    });


    $.ajax({
        url: `/api/ThongKeApi/ThongKeLichHen?Nam=2025`,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            if (res && res.value) {
                const labels = res.value.map(item => 'Tháng ' + item.thang);
                const dataDaDat = res.value.map(item => item.daDat);
                const dataDaHuy = res.value.map(item => item.daHuy);
                let stackedChartData = {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Đã đặt',
                            backgroundColor: 'rgba(60,141,188,0.9)',
                            borderColor: 'rgba(60,141,188,0.8)',
                            pointRadius: false,
                            pointColor: '#3b8bba',
                            pointStrokeColor: 'rgba(60,141,188,1)',
                            pointHighlightFill: '#fff',
                            pointHighlightStroke: 'rgba(60,141,188,1)',
                            data: dataDaDat
                        },
                        {
                            label: 'Đã hủy',
                            backgroundColor: 'rgba(210, 214, 222, 1)',
                            borderColor: 'rgba(210, 214, 222, 1)',
                            pointRadius: false,
                            pointColor: 'rgba(210, 214, 222, 1)',
                            pointStrokeColor: '#c1c7d1',
                            pointHighlightFill: '#fff',
                            pointHighlightStroke: 'rgba(220,220,220,1)',
                            data: dataDaHuy
                        },
                    ]
                }
                var barChartData = $.extend(true, {}, stackedChartData)


                var stackedBarChartCanvas = $('#stackedBarChart').get(0).getContext('2d')
                var stackedBarChartData = $.extend(true, {}, barChartData)


                var stackedBarChartOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                            stacked: true,
                        }],
                        yAxes: [{
                            stacked: true
                        }]
                    }
                }

                new Chart(stackedBarChartCanvas, {
                    type: 'bar',
                    data: stackedBarChartData,
                    options: stackedBarChartOptions
                })
            }
            else {
                console.log('Dữ liệu trả về không hợp lệ');
            }
        },
        error: function (err) {
            console.error("Lỗi AJAX:", err);
        }
    });

    $.ajax({
        url: `/api/ThongKeApi/ThongKeDichVu`,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            console.log(res);
            if (res && res.value) {
                let html = '';
                res.value.forEach(item => {
                    console.log(item);
                    html += `
                        <tr>
                            <td>
                                ${item.tenDichVu}
                            </td>
                            <td>${(item.doanhThu).toLocaleString('vi-VN')}</td>
                        </tr>
                    `
                });
                $('#tableDichVu tbody').html(html)
            }
            else {
                console.log('Dữ liệu trả về không hợp lệ');
            }
        },
        error: function (err) {
            console.error("Lỗi AJAX:", err);
        }
    });
    
    $.ajax({
        url: `/api/ThongKeApi/ThongKeChuyenGia`,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            console.log(res);
            if (res && res.value) {
                let html = '';
                res.value.forEach(item => {
                    html += `
                        <li>
                            <img src="${item.avatar}" alt="User Image">
                            <a class="users-list-name fs-6 fw-bold text-info mt-2" href="#">${item.hoTen}</a>
                            <span class="users-list-date fw-bold text-dark fs-6">Số lịch hẹn: ${item.soLanDat}</span>
                        </li>
                    `
                })
                $('#listChuyenGia').html(html)
            }
            else {
                console.log('Dữ liệu trả về không hợp lệ');
            }
        },
        error: function (err) {
            console.error("Lỗi AJAX:", err);
        }
    });
    $.ajax({
        url: `/api/ThongKeApi/ThongKeDanhGia `,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (res) {
            console.log(res);
            if (res && res.value) {
                let html = '';
                res.value.forEach(item => {
                    html += `
                        <div class="col-md-3" style="max-width: 400px;">
                            <div class="card">
                                <div class="card-header">
                                    <div class="text-center"><img src="/images/rating.png" alt=""></div>
                                    <p class="card-text text-center">
                                        ${item.noiDung}
                                    </p>
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">${item.hoTen}</h5>
                                    <div class="rating text-right text-warning fs-5">
                                        ${ratingstar(item.soSao)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                })
                $('#listDanhGia').html(html)
            }
            else {
                console.log('Dữ liệu trả về không hợp lệ');
            }
        },
        error: function (err) {
            console.error("Lỗi AJAX:", err);
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