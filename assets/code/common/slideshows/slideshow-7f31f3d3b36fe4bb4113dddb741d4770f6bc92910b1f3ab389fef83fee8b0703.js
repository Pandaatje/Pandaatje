(function() {
    var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
  
    (function() {
      var $, DEFAULT_TRANSITION_SPEED, GALLERY_SETTINGS, SLIDESHOWS_THAT_LOOP, assignAnimationClasses, clearAnimationClasses, convertTransitionSpeedStringToMs, getNextSlide, getPreviousSlide, getSlideCSS, getTransitionDirection, initializeSlideshows;
      $ = this.jQuery;
      GALLERY_SETTINGS = {
        items: 1,
        mode: "gallery",
        controls: true,
        autoplayButtonOutput: false,
        autoplayHoverPause: false,
        animateIn: "in",
        animateOut: "out",
        mouseDrag: false,
        preventScrollOnTouch: "auto"
      };
      DEFAULT_TRANSITION_SPEED = 700;
      SLIDESHOWS_THAT_LOOP = ["slideshow_01"];
      initializeSlideshows = (function(_this) {
        return function() {
          return $('.format-slideshow').each(function(domIndex, domElement) {
            var $arrowLeft, $arrowRight, $nav, $slideshow, allowClickableSlides, designVariables, loopSlides, ref, showDots, slideCSS, slider, slides, transitionSpeed;
            $slideshow = $(domElement);
            slides = domElement.querySelectorAll('.format-slideshow__slide');
            if (!(slides.length > 1)) {
              return;
            }
            $nav = $slideshow.find(".format-slideshow__dots")[0];
            $arrowLeft = $slideshow.find('.format-slideshow__arrow--left');
            $arrowRight = $slideshow.find('.format-slideshow__arrow--right');
            designVariables = $slideshow.data();
            loopSlides = (ref = designVariables.slideshowTag, indexOf.call(SLIDESHOWS_THAT_LOOP, ref) >= 0);
            showDots = designVariables.pageCountStyle === "dots" || designVariables.slideshowTag === "slideshow_05";
            allowClickableSlides = designVariables.slideshowTag === "slideshow_02";
            slideCSS = getSlideCSS($slideshow);
            if (!loopSlides) {
              $arrowLeft.prop('disabled', true);
            }
            if (slideCSS) {
              transitionSpeed = convertTransitionSpeedStringToMs(slideCSS["transition-duration"]);
            } else {
              transitionSpeed = DEFAULT_TRANSITION_SPEED;
            }
            slider = tns($.extend({
              container: $slideshow.find(".slider")[0]
            }, GALLERY_SETTINGS, {
              prevButton: $arrowLeft[0],
              nextButton: $arrowRight[0],
              autoplay: designVariables.autoPlaySpeed !== false,
              autoplayTimeout: designVariables.autoPlaySpeed * 1000,
              nav: showDots,
              navContainer: $nav,
              speed: transitionSpeed,
              loop: loopSlides
            }));
            if (allowClickableSlides) {
              $(slides).click(function(event) {
                if (event.target.tagName !== "A") {
                  slider.pause();
                  slider.play();
                  return slider.goTo(event.currentTarget.dataset.index - 1);
                }
              });
            }
            slider.events.on("transitionStart", function(event) {
              slides = Array.from(event.slideItems);
              clearAnimationClasses(slides);
              assignAnimationClasses(slides, event.index, event.indexCached, loopSlides);
              $slideshow.addClass("transitioning");
              $arrowLeft.prop('disabled', true);
              return $arrowRight.prop('disabled', true);
            });
            return slider.events.on("transitionEnd", function(event) {
              $slideshow.removeClass("transitioning");
              $arrowLeft.prop('disabled', false);
              $arrowRight.prop('disabled', false);
              if (!loopSlides) {
                if (event.index === 0) {
                  return $arrowLeft.prop('disabled', true);
                } else if (event.index === event.slideCount - 1) {
                  return $arrowRight.prop('disabled', true);
                }
              }
            });
          });
        };
      })(this);
      clearAnimationClasses = function(slides) {
        var allAnimationClasses;
        allAnimationClasses = ['entering-from-left', 'entering-from-right', 'entering-from-far-right', 'entering-from-far-left', 'on-stage', 'exiting-to-left', 'exiting-to-right', 'exiting-to-far-left', 'exiting-to-far-right'];
        return slides.forEach(function(slide) {
          return allAnimationClasses.forEach(function(className) {
            return slide.classList.remove(className);
          });
        });
      };
      assignAnimationClasses = function(slides, currentSlideIndex, previousSlideIndex, loopSlides) {
        var currentSlide, direction, exitingSlide, farExitingSlide, farLeftSlide, farRightSlide, leftSlide, rightSlide;
        direction = getTransitionDirection(currentSlideIndex, previousSlideIndex, slides.length);
        currentSlide = slides[currentSlideIndex];
        exitingSlide = slides[previousSlideIndex];
        rightSlide = getNextSlide(currentSlide, slides, loopSlides);
        leftSlide = getPreviousSlide(currentSlide, slides, loopSlides);
        farRightSlide = getNextSlide(rightSlide, slides, loopSlides);
        farLeftSlide = getPreviousSlide(leftSlide, slides, loopSlides);
        if (direction === "left") {
          farExitingSlide = getPreviousSlide(exitingSlide, slides, loopSlides);
        } else {
          farExitingSlide = getNextSlide(exitingSlide, slides, loopSlides);
        }
        currentSlide.classList.add("on-stage");
        exitingSlide.classList.add("exiting-to-" + direction);
        if (rightSlide) {
          rightSlide.classList.add("entering-from-right");
        }
        if (leftSlide) {
          leftSlide.classList.add("entering-from-left");
        }
        if (farRightSlide) {
          farRightSlide.classList.add('entering-from-far-right');
        }
        if (farLeftSlide) {
          farLeftSlide.classList.add('entering-from-far-left');
        }
        if (farExitingSlide) {
          return farExitingSlide.classList.add("exiting-to-far-" + direction);
        }
      };
      getTransitionDirection = function(currentIndex, previousIndex, count) {
        var direction;
        if (previousIndex === 0 && currentIndex > 1) {
          direction = "right";
        } else if (currentIndex === 0 && previousIndex === count - 1) {
          direction = "left";
        } else if (currentIndex < previousIndex) {
          direction = "right";
        } else if (currentIndex > previousIndex) {
          direction = "left";
        }
        return direction;
      };
      getNextSlide = function(currentSlide, slides, loopSlides) {
        var currentSlideIndex, nextIndex;
        currentSlideIndex = currentSlide ? currentSlide.dataset.index - 1 : void 0;
        if (loopSlides) {
          nextIndex = (currentSlideIndex + 1) % slides.length;
        } else if (!currentSlide || currentSlideIndex === slides.length) {
          return false;
        } else {
          nextIndex = currentSlideIndex + 1;
        }
        return slides[nextIndex];
      };
      getPreviousSlide = function(currentSlide, slides, loopSlides) {
        var currentSlideIndex, previousIndex;
        currentSlideIndex = currentSlide ? currentSlide.dataset.index - 1 : void 0;
        if (loopSlides) {
          previousIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
        } else if (!currentSlide || currentSlideIndex === 0) {
          return false;
        } else {
          previousIndex = currentSlideIndex - 1;
        }
        return slides[previousIndex];
      };
      getSlideCSS = function($slideshow) {
        var $firstSlide;
        $firstSlide = $slideshow.find(".format-slideshow__inner").children()[0];
        if (!$firstSlide) {
          return null;
        }
        return typeof window.getComputedStyle === "function" ? window.getComputedStyle($firstSlide) : void 0;
      };
      convertTransitionSpeedStringToMs = function(transitionSpeedString) {
        var transitionSeconds;
        if (!transitionSpeedString) {
          return 0;
        }
        transitionSeconds = parseFloat(transitionSpeedString.slice(0, transitionSpeedString.length - 1), 10);
        return transitionSeconds * 1000;
      };
      return $(initializeSlideshows);
    }).call(_4ORMAT);
  
  }).call(this);
  