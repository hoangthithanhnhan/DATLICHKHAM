$(document).ready(function () {

    formatInputDate("#ngayHenAdd");
    formatInputDate("#ngayHenEdit");


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
                targets: 2,
                render: function (data, type, row, meta) {
                    return formatDate(data);

                }
            },
            {
                targets: 6,
                render: function (data, type, row, meta) {
                    return data == 1 ? "<span class='text-pink'>Trực tiếp</span>" : "<span class='text-blue'>Online</span>";

                }
            },
            {
                targets: 7,
                render: function (data, type, row, meta) {
                    return data == 0 ? "<span class='text-blue'>Đã đặt lịch</span>" : data == 1 ? "<span class='text-green'>Hoàn thành</span>" : "<span class='text-red'>Đã hủy lịch</span>";

                }
            },
            {
                targets: 8,
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
            { data: "maLichHen", "width": "175px", "className": "text-center" },
            { data: "ngayHen", "width": "140px", "className": "text-center" },
            { data: "thoiGianHen", "width": "200px", "className": "text-center" },
            { data: "tenBenhNhan", "width": "230px", "className": "fw-bold" },
            { data: "tenChuyenGia", "width": "230px", "className": "fw-bold" },
            { data: "hinhThucKham", "width": "150px", "className": "text-center fw-bold" },
            { data: "trangThai", "width": "150px", "className": "text-center fw-bold" },
            { data: "maLichHen", "width": "auto", "className": "text-center" },
        ]
    })

    $('#saveData').on('click', function () {
        let maDichVu = $('#dichVuAdd').val();
        let maChuyenGia = $('#chuyenGiaAdd').val();
        let ngayHen = $('#ngayHenAdd').val();
        let thoiGianHen = $('#thoiGianHenAdd').val();
        let ghiChu = $('#ghiChuAdd').val();
        let hinhThucKham = $('input[name="hinhThucAdd"]:checked').val();
        let trangThai = $('input[name="trangThaiAdd"]:checked').val();
        let request = {
            maDichVu: maDichVu,
            maChuyenGia: maChuyenGia,
            ngayHen: ngayHen,
            thoiGianHen: thoiGianHen,
            ghiChu: ghiChu,
            hinhThucKham: Number(hinhThucKham),
            trangThai: Boolean(Number(trangThai))
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
                url: APIURL + "/api/LicHenApi/Add",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(request),
                success: function (data) {
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

    $('#myTable').on('click', '.btn-update', function () {
        let id = $(this).data("id");
        let data = $('#myTable').DataTable().row(id).data();
        $('#maLichHenEdit').val(data.maLichHen);
        $('#chuyenGiaEdit').val(data.maChuyenGia);
        $('#dichVuEdit').val(data.maDichVu);
        $('#ngayHenEdit').val(formatDate(data.ngayHen));
        $('#thoiGianHenEdit').val(data.thoiGianHen);
        $('#ghiChuEdit').val(data.ghiChu);
        $('#lyDoHuyLichEdit').val(data.lyDoHuyLich);
        $("input[name='hinhThucEdit'][value='" + (data.hinhThucKham ? 1 : 0) + "']").prop("checked", true);
        $("input[name='trangThaiEdit'][value='" + data.trangThai + "']").prop("checked", true);
        $('#editAdd').modal('show');
    })

    $('#editData').on('click', function () {
        let maLichHen = $('#maLichHenEdit').val();
        let maDichVu = $('#dichVuEdit').val();
        let maChuyenGia = $('#chuyenGiaEdit').val();
        let ngayHen = $('#ngayHenEdit').val();
        let thoiGianHen = $('#thoiGianHenEdit').val();
        let ghiChu = $('#ghiChuEdit').val();
        let lyDoHuyLich = $('#lyDoHuyLichEdit').val();
        let hinhThucKham = $('input[name="hinhThucEdit"]:checked').val();
        let trangThai = $('input[name="trangThaiEdit"]:checked').val();
        let request = {
            maLichHen: maLichHen,
            maDichVu: maDichVu,
            maChuyenGia: maChuyenGia,
            ngayHen: ngayHen,
            thoiGianHen: thoiGianHen,
            ghiChu: ghiChu,
            lyDoHuyLich: lyDoHuyLich,
            hinhThucKham: Number(hinhThucKham),
            trangThai: Boolean(Number(trangThai))
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
        if (checkEmptyString(hinhThucKham)) {
            showAlert("Hình thức không được để trống", "error");
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
function resetForm() {
    $("#modalAdd input").val("");
    $("#modalAdd textarea").val("");
    $("#modalAdd select").val("").trigger("change");
    $('input[name="hinhThucAdd"]').prop('checked', false);
    $('input[name="trangThaiAdd"]').prop('checked', false);
}
