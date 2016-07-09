//= require_tree .

function click_go_to (target) {
    $('.to_' + target).on('click', function(e){
        e.preventDefault();
        $("html, body").animate({scrollTop: $('.' + target).offset().top}, 600);
    });
}

$(document).ready(function(){
    click_go_to('content');
    click_go_to('top');
    click_go_to('p1');
    click_go_to('p2');
    click_go_to('footer');

    $('.handle').on('click', function() {
        $('nav').toggleClass('show');
        $('.fa').toggleClass('fa-bars');
        $('.fa').toggleClass('fa-minus');
    });
});
