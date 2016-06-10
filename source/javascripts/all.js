//= require_tree .

$(document).ready(function(){
    $('.arrow').click(function(){
        $("html, body").animate({scrollTop: $('.content').offset().top}, 600);
    });

    $('.handle').on('click', function() {
        $('nav').toggleClass('show');
        $('.fa').toggleClass('fa-bars');
        $('.fa').toggleClass('fa-minus');
    });
});
