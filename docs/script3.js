var windowHeight = $(window).height();
var canWheel = false;
var slide = 0;
var maxslide = 10;


window.addEventListener('wheel', ( evt ) => {
  console.timeStamp()
  if (checkScrollDirectionIsUp(event)) {
    console.log('Up');
    console.log(slide);
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
    console.log(slide);
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
}, _.throttle(callback, 1000, {trailing: false, leading: true }));



function checkScrollDirectionIsUp(event) {
  if (event.wheelDelta) {
    return event.wheelDelta > 0;
  }
  return event.deltaY < 0;
}


function popUpOnClick() {
    $(".pop-up-overlay, .popup").fadeToggle();
}
