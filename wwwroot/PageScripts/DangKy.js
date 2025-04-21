APIURL = window.location.origin;

$(document).ready(function () {
    $('#saveData').on('click', function () {
        let tenDangNhap = $("#tenDangNhapAdd").val();
        let matKhau = $("#matKhauAdd").val();
        let hoTen = $("#hotenAdd").val();
        let soDienThoai = $("#soDienThoaiAdd").val();
        let email = $("#emailAdd").val();
        let request = {
            username: tenDangNhap.trim(),
            password: matKhau.trim(),
            email: email,
            hoTen: hoTen.trim(),
            soDienThoai: soDienThoai,
        }
        let formData = new FormData();
        formData.append("data", JSON.stringify(request));
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
        if (checkEmptyString(soDienThoai)) {
            showAlert("Số điện thoại không được để trống", "error");
            return;
        }
        else {
            $.ajax({
                type: "POST",
                url: APIURL + "/api/BenhNhanApi/Add",
                contentType: "application/json; charset=utf-8",
                data: formData,
                processData: false,  //bắt buộc khi dùng FormData
                contentType: false,  //không cho jQuery set header kiểu `application/x-www-form-urlencoded`
                success: function (data) {
                    if (!data.isSuccess) {
                        showAlert (data.error, "error");
                    }
                    else {
                        showAlert("Thêm thành công", "success");
                        //Làm rỗng form sau khi thêm mới
                        setTimeout(function () {
                            window.location.href = "/Identity/Account/Login";
                        }, 300);
                    }
                },
                error: function (error) {
                    showAlert("Thêm không thành công", "error");
                    console.log(error)
                }
            });
        }
    })
})