// get data from variable attached to url
url = window.location.href
if(url.includes("x=") & url.includes("y=")){
  init_mx = url.split("x=")[1].split("&")[0]
  init_my = url.split("y=")[1]
  
}else{
  // default position
  init_mx = window.innerWidth/2;
  init_my = 100;//window.innerHeight/2
}
//console.log(init_mx,init_my)

// set initial position cursor ball
document.getElementsByClassName("cursor__ball--big")[0].style.transform = "matrix(0.3, 0, 0, 0.3," + init_mx + " ," + init_my + ")";
document.getElementsByClassName("cursor__ball--small")[0].style.transform = "matrix(0.3, 0, 0, 0.3," + (init_mx - 10)  + " ," + (init_my-10) + ")";

function goToUrl(object_selector,url) {
  var elem = document.querySelector(object_selector);
  var elem_rect = elem.getBoundingClientRect()
  window.location.href = url + "?x=" + elem_rect.x + "&y=" + elem_rect.y;
}

function scaleCursorBalls() {
    TweenMax.to($bigBall, .3, {
      scale: 0.3
    })
    TweenMax.to($smallBall, .3, {
      scale: 0.3,
      transformOrigin: "34.95px 39.9px"
    })
  }
  
  // Move the cursor
  function onMouseMove(e) {
    TweenMax.to($bigBall, .4, {
      x: e.pageX - 25,
      y: e.pageY - 25 - window.scrollY
    })
    TweenMax.to($smallBall, .1, {
      x: e.pageX - 35,
      y: e.pageY - 35 - window.scrollY
    })
  }
  
  // Hover an element
  function onMouseHover(e) {
    TweenMax.to($cursorText, .3, {
      opacity: 1
    })
    TweenMax.to($bigBall, .3, {
      scale: 0.8
    })
    TweenMax.to($smallBall, .3, {
      scale: 0.8
    })
  }
  function onMouseHoverOut(e) {
    TweenMax.to($cursorText, .3, {
      opacity: 0
    })
    TweenMax.to($bigBall, .3, {
      scale: 0.3
    })
    TweenMax.to($smallBall, .3, {
      scale: 0.3
    })
  }
  function onMouseHover_noText(e) {
    TweenMax.to($bigBall, .3, {
      scale: 1.1,
    })
    TweenMax.to($smallBall, .3, {
      scale: 1.1,
    })
  }
  function onMouseHoverOut_noText(e) {
    TweenMax.to($bigBall, .3, {
      scale: 0.3
    })
    TweenMax.to($smallBall, .3, {
      scale: 0.3
    })
  }
  function onMouseHover_large(e) {
    TweenMax.to($bigBall, .3, {
      scale: 1.5,
    })
    TweenMax.to($smallBall, .3, {
      scale: 1.5,
    })
  }
  function onMouseHoverOut_large(e) {
    TweenMax.to($bigBall, .3, {
      scale: 0.3
    })
    TweenMax.to($smallBall, .3, {
      scale: 0.3
    })
  }
  
  const $bigBall = document.querySelector('.cursor__ball--big');
  const $smallBall = document.querySelector('.cursor__ball--small');
  const $hoverables = document.querySelectorAll('.hoverable');
  const $hoverables_noText = document.querySelectorAll('.hoverable_noText');
  const $hoverables_large = document.querySelectorAll('.hoverable_large');
  const $cursorText = document.querySelectorAll('.cursor-text');
  
  // Listeners
  document.body.addEventListener('mousemove', onMouseMove);
  for (let i = 0; i < $hoverables.length; i++) {
    $hoverables[i].addEventListener('mouseenter', onMouseHover);
    $hoverables[i].addEventListener('mouseleave', onMouseHoverOut);
  }
  for (let i = 0; i < $hoverables_large.length; i++) {
    $hoverables_large[i].addEventListener('mouseenter', onMouseHover_large);
    $hoverables_large[i].addEventListener('mouseleave', onMouseHoverOut_large);
  }
  for (let i = 0; i < $hoverables_noText.length; i++) {
    $hoverables_noText[i].addEventListener('mouseenter', onMouseHover_noText);
    $hoverables_noText[i].addEventListener('mouseleave', onMouseHoverOut_noText);
  }
  scaleCursorBalls();
