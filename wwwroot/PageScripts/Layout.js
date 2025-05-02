APIURL = window.location.origin;

$(document).ready(function () {
    let URL = window.location.pathname;
    $('.nav-sidebar .nav-link').each(function () {
        console.log($(this).attr('href'));
        if ($(this).attr('href') == URL) {
            $(this).addClass('active');
            $(this).parents('.nav-item').addClass('menu-open');
            $(this).parents('.nav-treeview').addClass('menu-open');
            $(this).parents('.nav-treeview').css("display", "block");
        }
    });
})

function formatDate(date) {
    if (date != null && date != "") {
        var d = new Date(date),
            month = (d.getMonth() + 1),
            day = d.getDate(),
            year = d.getFullYear()
        if (month < 10) month = '0' + month
        if (day < 10) day = '0' + day
        return `${day}/${month}/${year}`;
    }
    return "";
};

function formatDateSQL(date) {
    if (date != null && date != "") {
        //var d = new Date(date),
        //    month = (d.getMonth() + 1),
        //    day = d.getDate(),
        //    year = d.getFullYear()
        //if (month < 10) month = '0' + month
        //if (day < 10) day = '0' + day
        let dateSplit = date.trim().split("/");
        return `${dateSplit[2]}-${dateSplit[1]}-${dateSplit[0]}`;
    }
    return "";
};

function formatInputDate(date) {
    flatpickr(date, {
        dateFormat: "d/m/Y",
        allowInput: true
    });
}
function formatTime(time) {
    if (time != null && time != "") {
        t = time.substring(11, 19)
        return t;
    }
    return "";
};
function showAlert(message, type) {
    Swal.fire({
        text: message,
        icon: type,
        confirmButtonText: 'OK',
        timer: 3000
    });
}

function checkEmptyString(str) {
    if (str == null || str.toString().trim() == "") {
        return true;
    }
    return false;
}

