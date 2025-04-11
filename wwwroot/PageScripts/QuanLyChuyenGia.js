let APIURL = window.location.origin;
$(document).ready(function () {

    formatInputDate("#ngaySinhAdd");

    formatInputDate("#ngaySinhEdit");


    function buildData() {
        let keyword = $('#search').val();
        let request = {
            keyword: keyword,
        }
        return JSON.stringify(request);
    }
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
            url: APIURL + `/api/ChuyenGiaApi/Gets`,
            type: "POST",
            data: buildData,
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
                targets: 6,
                render: function (data, type, row, meta) {
                    return data ? "<span class='text-blue'>Đang làm việc</span>" : "<span class='text-red'>Đã nghỉ việc</span>";
                }
            },
            {
                targets: 7,
                render: function (data, type, row, meta) {
                    return `
                            <button type="button" data-id="${meta.row}" class="button btn-user">
                                <img src="../images/user.png" alt="Alternate Text" />
                            </button> 
                            <button type="button" data-id="${meta.row}" class="button btn-update">
                                <img src="../images/edit_filled.png" alt="Alternate Text" />
                            </button> 
                            <button type="button" data-id="${meta.row}" class="button btn-delete" data-bs-toggle="modal" data-bs-target="#modalDelete">
                                <img src="../images/delete_filled.png" alt="Alternate Text" />
                            </button>`;
                }
            }

        ],
        "columns": [
            { data: "stt", "width": "60px", "className": "text-center" },
            { data: "hoTen", "width": "250px", "className": "fw-bold" },
            { data: "chucDanh", "width": "200px", "className": "text-center" },
            { data: "chucVu", "width": "225px", "className": "text-center fw-bold" },
            { data: "tenChuyenKhoa", "width": "250px", "className": "text-center" },
            { data: "soNamKinhNghiem", "width": "180px", "className": "text-center" },
            { data: "trangThai", "width": "180px", "className": "text-center fw-bold" },
            { data: "maChuyenGia", "width": "auto", "className": "text-center" }
        ]
    })
    //add dữ liệu khi click button Lưu
    $("#saveData").on('click', function () {
        let tenDangNhap = $("#tenDangNhapAdd").val();
        let matKhau = $("#matKhauAdd").val();
        let email = $("#emailAdd").val();
        let hoTen = $("#hotenAdd").val();
        let gioiTinh = $("input[name='gioitinhAdd']:checked").val();
        let ngaySinh = $("#ngaySinhAdd").val();
        let request = {
            username: tenDangNhap.trim(),
            password: matKhau.trim(),
            email: email,
            hoTen: hoTen.trim(),
            gioiTinh: Number(gioiTinh),
            ngaySinh: formatDateSQL(ngaySinh)
        }
        console.log(request)
        if (checkEmptyString(tenDangNhap.trim())) {
            showAlert("Tên đăng nhập không được để trống", "error");
            return;
        }
        if (checkEmptyString(matKhau.trim())) {
            showAlert("Mật khẩu không được để trống", "error");
            return;
        }
        if (checkEmptyString(hoTen)) {
            showAlert("Họ tên không được để trống", "error");
            return;
        }
        else {
            $.ajax({
                type: "POST",
                url: APIURL + "/api/ChuyenGiaApi/Add",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(request),
                success: function (data) {
                    console.log(data)
                    if (!data.isSuccess) {
                        showAlert(data.error, "error");
                    }
                    else {
                        $('#myTable').DataTable().ajax.reload();
                        $('#modalAdd').modal('hide');
                        showAlert("Thêm thành công", "success");
                        //Làm rỗng form sau khi thêm mới
                        resetForm()
                    }
                },
                error: function (error) {
                    showAlert("Thêm không thành công", "error");
                    console.log(error)
                }
            });
        }
    })

    $("#myTable tbody").on('click', '.btn-update', function () {
        let id = $(this).data("id");
        let data = $('#myTable').DataTable().row(id).data();
        console.log(data)
        $("#maChuyenGiaEdit").val(data.maChuyenGia);
        $("#hoTenEdit").val(data.hoTen);
        $("input[name='gioitinhEdit'][value='" + data.gioiTinh + "']").prop("checked", true);
        $("#ngaySinhEdit").val(formatDate(data.ngaySinh));

        $('#modalEdit').modal('show');
    })

    $("#myTable tbody").on('click', '.btn-user', function () {
        let id = $(this).data("id");
        let data = $('#myTable').DataTable().row(id).data();
        console.log(data)
        $("#maChuyenGiaEdit").val(data.maChuyenGia);
        $("#tenDangNhapEdit").val(data.tenDangNhap);
        $("#matKhauEdit").val(data.matKhau);
        console.log(data.tenDangNhap)
        $("#hoTenEdit").val(data.hoTen);
        $("input[name='gioitinhEdit'][value='" + (data.trangThai ? 1 : 0) + "']").prop("checked", true);
        $('#modalEditAccount').modal('show');
    })

    $("#myTable tbody .btn-update").on('click', function () {
        let id = $(this).data("id");
        let data = $('#myTable').DataTable().row(id).data();
        console.log(data)
    })

    //render lại bảng khi click button tìm kiếm
    $("#btn-search").on('click', function () {
        $('#myTable').DataTable().ajax.reload();
    })


    //search khi nhấn enter
    $("#search").on('keydown', function (e) {
        if (e.key === 'Enter') {
            $('#myTable').DataTable().ajax.reload();
        }
    })

    
})
function resetForm() {
    $("#modalAdd input").val("");
    $("#modalAdd textarea").val("");
    $("input[name='trangThaiAdd'][value='1']").prop('checked', true);
}
