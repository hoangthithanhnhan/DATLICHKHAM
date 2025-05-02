// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
function formatInputDate(date) {
    flatpickr(date, {
        dateFormat: "d/m/Y",
        allowInput: true
    });
}

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