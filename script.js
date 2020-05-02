var windowHeight = $(window).height();
var canWheel = true;
var slide = 0;
var maxslide = 10;
var topPosition =  window.pageYOffset || window.scrollY || window.scrollTop || document.getElementsByTagName("html")[0].scrollTop;
console.log(windowHeight);
console.log(topPosition);
window.addEventListener('wheel', checkScrollDirection);

function checkScrollDirection(event) {
  if (canWheel){
    canWheel = false;
    if (checkScrollDirectionIsUp(event)) {
      console.log('Up');
      console.log(topPosition);
      slide = slide - 1;
      if (slide < 0){
        slide = 0;
      }
      console.log(slide);
      topPosition = slide * windowHeight;
      window.scrollTo({
        top: slide * windowHeight,
        left: 0,
        behavior: 'smooth'
      });

    } else {
      console.log('Down');
      slide = slide + 1;
      if (slide > maxslide){
        slide = maxslide;
      }
      console.log(slide);
      topPosition = slide * windowHeight;
      window.scrollTo({
        top: slide * windowHeight,
        left: 0,
        behavior: 'smooth'
      });
      console.log(topPosition);
    }
    setTimeout(() => {
      canWheel = true;
    }, 1000);
  }
  else {
    window.scrollTo({
      top: slide * windowHeight,
      left: 0,
      behavior: 'smooth'
    });
  }
}

function checkScrollDirectionIsUp(event) {
  if (event.wheelDelta) {
    return event.wheelDelta > 0;
  }
  return event.deltaY < 0;
}


function popUpOnClick() {
    $(".pop-up-overlay, .popup").fadeToggle();
}
