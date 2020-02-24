var windowHeight = $(window).height();
var canWheel = true;
var slide = 0;
var maxslide = 2;
var topPosition =  window.pageYOffset || window.scrollY || window.scrollTop || document.getElementsByTagName("html")[0].scrollTop;
console.log(windowHeight);
console.log(topPosition);
window.addEventListener('wheel', checkScrollDirection);

function checkScrollDirection(event) {
  if (canWheel){
    if (checkScrollDirectionIsUp(event)) {
      console.log('Up');
      console.log(topPosition);
      slide = slide - 1;
      if (slide < 0){
        slide = 0;
      }
      console.log(slide)
      window.scrollTo({
        top: slide * windowHeight,
        left: 0,
        behavior: 'smooth'
      });

    } else {
      console.log('Down');
      console.log(topPosition);
      slide = slide + 1;
      if (slide > maxslide){
        slide = maxslide;
      }
      console.log(slide)
      window.scrollTo({
        top: slide * windowHeight,
        left: 0,
        behavior: 'smooth'
      });
    }
    canWheel = false;
    setTimeout(() => {
      canWheel = true;
    }, 1000);
  }
}

function checkScrollDirectionIsUp(event) {
  if (event.wheelDelta) {
    return event.wheelDelta > 0;
  }
  return event.deltaY < 0;
}
