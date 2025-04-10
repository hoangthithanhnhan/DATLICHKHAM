APIURL = window.location.origin;
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
