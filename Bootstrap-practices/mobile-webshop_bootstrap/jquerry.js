// ------ SCROLL NAV --------//

$(document).ready(function() {
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();
        if (scroll > 100) {
            $(".navbar").css("background", "white");
            $(".navbar-nav a").css("color", "grey");
            $(".navbar-nav a:hover").css("color", "rgb(255, 210, 50)");
            $(".navbar-brand").css("color", "rgb(255, 210, 50)");

        } else {
            $(".navbar").css("background-color", "transparent");
            $(".navbar-nav a").css("color", "white");
            $(".navbar-nav a:hover").css("color", "rgb(255, 210, 50)");
            $(".navbar-brand").css("color", "rgb(255, 210, 50)");
            $(".navbar-brand:hover").css("color", "white");

        }
    })
})

// ------ TOOLTIP --------//

$(function() {
    $('[data-toggle="tooltip"]').tooltip()
})