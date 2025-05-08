$(document).ready(function () {
    $('#chuyenMuc').owlCarousel({
        loop:false,
        margin: 10,
        autoplay: false,
        nav:true,
        responsive:{
            0:{
            items:1
            },
        600:{
            items:3
            },
        1000:{
            items:5
            }
        }
    })
})