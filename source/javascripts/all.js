//= require_tree .

function click_go_to (target) {
    $('.to_' + target).on('click', function(e){
        e.preventDefault();
        $("html, body").animate({scrollTop: $('.' + target).offset().top}, 600);
    });
}

function toggleBottomClass() {
    var offset_to_bottom = $(document).height() - $(window).scrollTop();

    // ele min-height: 400
    if ( offset_to_bottom <= 400 || offset_to_bottom <= $(window).height()) {
        $('.nav.top_button').addClass('bottom');
    } else {
        $('.nav.top_button').removeClass('bottom');
    }
}

$(document).ready(function(){
    click_go_to('content');
    click_go_to('top');
    click_go_to('p1');
    click_go_to('p2');
    click_go_to('p3');
    click_go_to('p4');
    click_go_to('footer');

    $(window).scroll( function() {
        // ele min-height: 400
        var offset_to_top = $(window).height() > 400 ? $(window).height() : 400;
        if ($(window).scrollTop() >= offset_to_top) {
            toggleBottomClass();
            $('.top_button').fadeIn(200);
        } else {
            $('.top_button').fadeOut(200);
        }

    });

    $('.handle').on('click', function() {
        $('nav').toggleClass('show');
        $('.fa').toggleClass('fa-bars');
        $('.fa').toggleClass('fa-minus');
    });
});
