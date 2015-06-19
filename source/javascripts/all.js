//= require_tree .

$(document).ready(function(){
  $('.arrow').click(function(){
    $("html, body").animate({scrollTop: $('.content').offset().top}, 600);
  });
})
