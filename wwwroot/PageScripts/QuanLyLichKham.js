$(document).ready(function () {

    formatInputDate("#ngayHenAdd");
    formatInputDate("#ngayHenEdit");
    $.ajax({
        url: APIURL + `/api/BenhNhanApi/Gets?trangThai=true`,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data && data.isSuccess) {
                if (data.value && data.value.length > 0) {
                    let html = "";

                    $.each(data.value, function (index, item) {
                        html += `<option value="${item.maBenhNhan}">${item.hoTen}</option>`;
                    });

                    $("#benhNhanAdd").html(html);
                    $("#benhNhanEdit").html(html);

                    $('#benhNhanAdd').select2({
                        width: "100%",
                        minimumResultsForSearch: 0,
                        placeholder: "Chọn bệnh nhân",
                        dropdownParent: "#modalAdd"
                    });
                    $('#benhNhanEdit').select2({
                        width: "100%",
                        minimumResultsForSearch: 0,
                        placeholder: "Chọn dịch vụ",
                        dropdownParent: "#modalAdd"
                    });
                }
            }
        }
    })
      

    $.ajax({
        url: APIURL + `/api/DichVuApi/Gets`,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({ trangThai: true }),
        success: function (data) {
            if (data && data.isSuccess) {
                if (data.value && data.value.length > 0) {
                    let html = "";

                    $.each(data.value, function (index, item) {
                        html += `<option value="${item.maDichVu}">${item.tenDichVu}</option>`;
                    });

                    $("#dichVuAdd").html(html);
                    $("#dichVuEdit").html(html);

                    $('#dichVuAdd').select2({
                        width: "100%",
                        minimumResultsForSearch: Infinity,
                        placeholder: "Chọn dịch vụ"
                    });
                    $('#dichVuEdit').select2({
                        width: "100%",
                        minimumResultsForSearch: Infinity,
                        placeholder: "Chọn dịch vụ"
                    });
                }
            }
        }
    })


    $('#dichVuAdd, #dichVuEdit').on('change', function () {
        let maDichVu = $(this).val();
        let element = $(this).attr('id') == 'dichVuAdd' ? '#chuyenGiaAdd' : '#chuyenGiaEdit';

        $('#chuyenGiaAdd').html('<option value="">Đang tải chuyên gia...</option>').select2({
            width: "100%",
            placeholder: "Chọn chuyên gia",
            minimumResultsForSearch: Infinity
        });

        if (maDichVu != "" && maDichVu!=null) {
            $.ajax({
                url: APIURL + `/api/ChuyenGiaApi/GetChuyenGiaByDichVu?MaDichVu=${maDichVu}`,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    if (data && data.isSuccess) {
                        if (data.value && data.value.length > 0) {
                            let html = "";
                            $.each(data.value, function (index, item) {
                                html += `<option value="${item.maChuyenGia}">${item.hoTen}</option>`;
                            });
                            $(element).html(html);
                            $(element).select2({
                                width: "100%",
                                placeholder: "Chọn chuyên gia",
                                minimumResultsForSearch: Infinity
                            });
                        }
                    }
                }
            })
        }
    })

    $('#ngayHenAdd, #ngayHenEdit').on('change', function () {
        console.log(123)
        let action = $(this).attr('id') == 'ngayHenAdd' ? 'Add' : 'Edit';
        let maChuyenGia = $(`#chuyenGia${action}`).val();
        let ngayHen = $(this).val();
        let thoiGianHen = action == 'Edit' ? $('#thoiGianHenCurrent').val() : null;
        ngayHen = formatDateSQL(ngayHen);
        if (!checkEmptyString(maChuyenGia) && !checkEmptyString(ngayHen)) {
            getThoiGian(ngayHen, maChuyenGia, false, thoiGianHen, action);
        }
        else {
            $(`#thoiGianHen${action}`).empty();
            $(`#thoiGianHen${action}`).select2({
                width: "100%",
                placeholder: "Chọn thời gian hẹn",
                minimumResultsForSearch: Infinity
            });
        }
    })

    $('#myTable').DataTable({
        dom: '<"top"f>rt<"bottom d-flex justify-content-end" lp>',
        "pageLength": 10,
        "autoWidth": false,
        "ordering": false,
        "bInfo": false,
        "bDestroy": true,
        searching: false,
        lengthMenu: [
            [10, 20, 50, 100],
            [10, 20, 50, 100]
        ],
        language: {
            "sProcessing": "Đang xử lý...",
            "sLengthMenu": "_MENU_",
            "sZeroRecords": "Không có dữ liệu",
            "sEmptyTable": "Bảng trống",
            "sInfo": "Hiện dòng _START_ đến _END_ trong tổng _TOTAL_ dòng",
            "sInfoEmpty": "Hiện dòng 0 đến 0 trong tổng 0 dòng",
            "sSearch": "Tìm kiếm",
            "sLoadingRecords": "Đang tải...",
            "paginate": {
                "first": '<img src="../images/arrow_previous.png" />',
                "previous": '<img src="../images/chevron_left.png" />',
                "next": '<img src="../images/chevron_right.png" />',
                "last": '<img src="../images/arrow_next.png" />'
            }
        },
        "ajax": {
            url: APIURL + `/api/LichHenApi/Gets`,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataSrc: function (data) {
                var result = data.value
                if (result) {
                    for (let i = 0; i < result.length; i++) {
                        result[i].stt = i + 1;
                    }
                    return result;
                }
                return []

            }
        },
        "columnDefs": [
            {
                targets: 1,
                render: function (data, type, row, meta) {
                    return formatDate(data);

                }
            },
            {
                targets: 5,
                render: function (data, type, row, meta) {
                    return data == 1 ? "<span class='text-pink'>Trực tiếp</span>" : "<span class='text-blue'>Online</span>";

                }
            },
            {
                targets: 6,
                render: function (data, type, row, meta) {
                    return data == 0 ? "<span class='text-blue'>Đã đặt lịch</span>" : data == 1 ? "<span class='text-green'>Hoàn thành</span>" : "<span class='text-red'>Đã hủy lịch</span>";

                }
            },
            {
                targets: 8,
                render: function (data, type, row, meta) {
                    return data == 1 ? "<span class='text-blue'>Đã thanh toán</span>" : "<span class='text-red'>Đã hoàn trả tiền</span>";

                }
            },
            {
                targets: 9,
                render: function (data, type, row, meta) {
                    return `<button type="button" data-id="${meta.row}" class="button btn-update">
                                <img src="../images/edit_filled.png" alt="Alternate Text" />
                            </button> 
                            <button type="button" data-id="${meta.row}" class="button btn-delete" data-bs-toggle="modal" data-bs-target="#modalDelete">
                                <img src="../images/delete_filled.png" alt="Alternate Text" />
                            </button>`;

                }
            },

        ],
        "columns": [
            { data: "stt", "width": "60px", "className": "text-center" },
            { data: "ngayHen", "width": "100px", "className": "text-center" },
            { data: "thoiGianLamViec", "width": "150px", "className": "text-center" },
            { data: "tenBenhNhan", "width": "230px", "className": "fw-bold" },
            { data: "tenChuyenGia", "width": "230px", "className": "fw-bold" },
            { data: "hinhThucKham", "width": "100px", "className": "text-center fw-bold" },
            { data: "trangThai", "width": "150px", "className": "text-center fw-bold" },
            { data: "tongTien", "width": "150px", "className": "text-center fw-bold" },
            { data: "trangThaiThanhToan", "width": "200px", "className": "text-center fw-bold" },
            { data: "maLichHen", "width": "auto", "className": "text-center" },
        ]
    })

    $('#saveData').on('click', function () {
        let maBenhNhan = $('#benhNhanAdd').val();
        let maDichVu = $('#dichVuAdd').val();
        let maChuyenGia = $('#chuyenGiaAdd').val();
        let ngayHen = $('#ngayHenAdd').val();
        let thoiGianHen = $('#thoiGianHenAdd').val();
        let ghiChu = $('#ghiChuAdd').val();
        let hinhThucKham = $('input[name="hinhThucAdd"]:checked').val();
        let request = {
            maBenhNhan: maBenhNhan,
            maDichVu: maDichVu,
            maChuyenGia: maChuyenGia,
            ngayHen: formatDateSQL(ngayHen),
            thoiGianHen: thoiGianHen,
            ghiChu: ghiChu,
            hinhThucKham: Boolean(Number(hinhThucKham))
        }
        console.log(request,123)
        if (checkEmptyString(maBenhNhan)) {
            showAlert("Bệnh nhân không được để trống", "error");
            return;
        }
        if (checkEmptyString(maDichVu)) {
            showAlert("Dịch vụ không được để trống", "error");
            return;
        }
        if (checkEmptyString(maChuyenGia)) {
            showAlert("Chuyên gia không được để trống", "error");
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
        if (checkEmptyString(hinhThucKham)) {
            showAlert("Hình thức không được để trống", "error");
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
                    $('#myTable').DataTable().ajax.reload();
                    $('#modalAdd').modal('hide');
                    showAlert("Thêm thành công", "success");
                    //Làm rỗng form sau khi thêm mới
                    resetForm()
                },
                error: function (error) {
                    showAlert("Thêm không thành công", "error");
                }
            });
        }
    })

    $('input[name="trangThaiEdit"]').on('change', function () {
        let trangThai = $(this).val();
        if (trangThai == '2') {
            $('#lyDoHuyLich').removeClass('d-none');
        } else {
            $('#lyDoHuyLich').addClass('d-none');
        }
    })

    $('#myTable').on('click', '.btn-update', function () {
        let id = $(this).data("id");
        let data = $('#myTable').DataTable().row(id).data();
        $('#maLichHenEdit').val(data.maLichHen);
        $('#benhNhanEdit').val(data.maBenhNhan).trigger('change');
        $('#dichVuEdit').val(data.maDichVu).trigger('change');
        $('#chuyenGiaEdit').val(data.maChuyenGia).trigger('change');
        $('#ngayHenEdit').val(formatDate(data.ngayHen));
        $('#thoiGianHenCurrent').val(data.thoiGianHen);
        getThoiGian(data.ngayHen, data.maChuyenGia, false, data.thoiGianHen, 'Edit');
        $('#thoiGianHenEdit').val(data.thoiGianHen).trigger('change');
        $('#ghiChuEdit').val(data.ghiChu);
        $('#lyDoEdit').val(data.lyDoHuyLich);
        $("input[name='hinhThucEdit'][value='" + (data.hinhThucKham ? 1 : 0) + "']").prop("checked", true);
        $("input[name='trangThaiEdit'][value='" + data.trangThai + "']").prop("checked", true);

        if (data.trangThai == 2) {
            $('#lyDoHuyLich').removeClass('d-none');
        }
        else {
            $('#lyDoHuyLich').addClass('d-none');
        }

        $('#modalEdit').modal('show');
    })

    $('#editData').on('click', function () {
        let maLichHen = $('#maLichHenEdit').val();
        let maBenhNhan = $('#benhNhanEdit').val();
        let maDichVu = $('#dichVuEdit').val();
        let maChuyenGia = $('#chuyenGiaEdit').val();
        let ngayHen = $('#ngayHenEdit').val();
        let thoiGianHen = $('#thoiGianHenEdit').val();
        let thoiGianHenCurrent = $('#thoiGianHenCurrent').val();
        let ghiChu = $('#ghiChuEdit').val();
        let lyDo = $('#lyDoEdit').val();
        let hinhThucKham = $('input[name="hinhThucEdit"]:checked').val();
        let trangThai = $('input[name="trangThaiEdit"]:checked').val();
        let request = {
            maLichHen: maLichHen,
            maBenhNhan: maBenhNhan,
            maDichVu: maDichVu,
            maChuyenGia: maChuyenGia,
            ngayHen: formatDateSQL(ngayHen),
            thoiGianHen: thoiGianHen,
            thoiGianHenCurrent: thoiGianHenCurrent,
            ghiChu: ghiChu,
            lyDoHuyLich:lyDo,
            hinhThucKham: Boolean(Number(hinhThucKham)),
            trangThai: Number(trangThai)
        }
        console.log(request)
        if (checkEmptyString(maBenhNhan)) {
            showAlert("Bệnh nhân không được để trống", "error");
            return;
        }
        if (checkEmptyString(maDichVu)) {
            showAlert("Dịch vụ không được để trống", "error");
            return;
        }
        if (checkEmptyString(maChuyenGia)) {
            showAlert("Chuyên gia không được để trống", "error");
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
        if (checkEmptyString(hinhThucKham)) {
            showAlert("Hình thức không được để trống", "error");
            return;
        }
        if (checkEmptyString(trangThai)) {
            showAlert("Trạng thái không được để trống", "error");
            return;
        }
        if (trangThai=='2' && checkEmptyString(lyDo)) {
            showAlert("Lý do hủy lịch không được để trống", "error");
            return;
        }
        else {
            $.ajax({
                type: "PUT",
                url: APIURL + "/api/LichHenApi/Update",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(request),
                success: function (data) {
                    $('#myTable').DataTable().ajax.reload();
                    $('#modalEdit').modal('hide');
                    showAlert("Cập nhật thành công", "success");
                },
                error: function (error) {
                    showAlert("Cập nhật không thành công", "error");
                }
            });
        }
    })
    $('#myTable').on('click', '.btn-delete', function () {
        let id = $(this).data("id");
        let data = $('#myTable').DataTable().row(id).data();
        $('#maLichHenDelete').val(data.maLichHen);
        $('#modalDelete').modal('show');
    })
    $('#deleteData').on('click', function () {
        let maLichHen = $('#maLichHenDelete').val();
        $.ajax({
            type: "DELETE",
            url: APIURL + `/api/LichHenApi/Delete?maLichHen=${maLichHen}`,
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                $('#myTable').DataTable().ajax.reload();
                $('#modalDelete').modal('hide');
                if (data && data.isSuccess) { 
                    showAlert("Xóa thành công", "success");
                } else {
                    showAlert("Xóa không thành công", "error");
                }
            },
            error: function (error) {
                showAlert("Xóa không thành công", "error");
            }
        });
    })
    // clear value khi click button thêm mới
    $('#modalAdd').on('show.bs.modal', function () {
        resetForm();
    });
    //render lại bảng khi click button tìm kiếm
    $("#btn-search").on('click', function () {
        let keyword = $("#search").val();
        $('#myTable').DataTable().ajax.url(APIURL + `/api/LichHenApi/Gets?keyword=${keyword}`).load();
    })
    //render lại bảng khi nhấn phím Enter
    $("#search").on('keyup', function (e) {
        if (e.keyCode === 13) {
            let keyword = $("#search").val();
            $('#myTable').DataTable().ajax.url(APIURL + `/api/LichHenApi/Gets?keyword=${keyword}`).load();
        }
    })
})


function getThoiGian(ngayHen, maChuyenGia, trangThai, maLichLamViec, action) {
    $.ajax({
        url: APIURL + `/api/LichLamViecChuyenGiaApi/GetsLichLamViecChuyenGiaByNgay?Ngay=${ngayHen}&MaChuyenGia=${maChuyenGia}&TrangThai=${trangThai}${maLichLamViec ? `&MaLichLamViec=${maLichLamViec}` : ""}`,
        async: false,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data && data.isSuccess) {
                if (data.value && data.value.length > 0) {
                    let html = "";
                    $.each(data.value, function (index, item) {
                        html += `<option value="${item.maLichLamViec}">${item.thoiGianLamViec}</option>`;
                    });
                    $(`#thoiGianHen${action}`).html(html);
                    $(`#thoiGianHen${action}`).select2({
                        width: "100%",
                        placeholder: "Chọn thời gian hẹn",
                        minimumResultsForSearch: Infinity
                    });
                }
                else {
                    $(`#thoiGianHen${action}`).empty();
                    $(`#thoiGianHen${action}`).select2({
                        width: "100%",
                        placeholder: "Chọn thời gian hẹn",
                        minimumResultsForSearch: Infinity
                    });
                }
            }
        },
        error: function () {
            $('#lichHenContainer').html('<p>Có lỗi khi tải lịch hẹn.</p>');
        }
    });
}
function resetForm() {
    $("#modalAdd input:not([type='radio'])").val("");
    $("#modalAdd textarea").val("");
    $("#modalAdd select").val("").trigger("change");
    $('#modalAdd input[name="hinhThucAdd"][value=1]').prop('checked', true);
    $('#modalAdd input[name="trangThaiAdd"][value=0]').prop('checked', true);
}
