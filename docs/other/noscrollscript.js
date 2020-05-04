function popUpOnClick() {
    $(".pop-up-overlay, .popup").fadeToggle();
}
var windowHeight = $(window).height();
var something = windowHeight *5.1;
$(document).scroll(function() {
  var y = $(this).scrollTop();
  if (y > something) {
    $('.secret').fadeIn();
  } else {
    $('.secret').fadeOut();
  }
});
