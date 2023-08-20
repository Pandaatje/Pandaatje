function scroll_speed_number() {
    var e = _4ORMAT_DATA.theme.slide_transition_speed;
    return "Fast" == e ? 300 : "Regular" == e ? 500 : "Slow" == e ? 800 : void 0
}
var MOBILE_BREAKPOINT = 768,
    SCROLL_SPEED = scroll_speed_number(),
    Theme = {
        isMobile: window.matchMedia("(max-width: 767px)").matches,
        isTablet: $("html").hasClass("touch") || "ontouchstart" in window,
        menu: {
            lastScrollTop: 0,
            touchStateY: -1,
            touchState: "displayed",
            init: function() {
                this.header = $("header"), this.content = $("#content"), this.menuButton = $("button.mobile_menu_button"), this.menu = $("nav#menu"), this.hasTouch = "ontouchstart" in window, this.hasTouch || $("body").addClass("no-touch"), Theme.isMobile ? (this.bodyPaddingTop(), this.mobileMenuWidth(), this.attachTouchEvents(), $("header").on("click", this.onClickOutsideMenu.bind(this)), $(window).on("orientationchange", this.onResize.bind(this))) : Menu.update_size(), Theme.isTablet && this.onCategoryClick(), $(window).on("resize", this.onResize.bind(this))
            },
            bodyPaddingTop: function() {
                this.content.css("margin-top", this.header.innerHeight())
            },
            mobileMenuWidth: function() {
                this.menu.css("width", this.header.innerWidth() - 0), this.menu.children(".header_logo").css("width", this.menuButton.position().left - 0 - 0)
            },
            attachTouchEvents: function() {
                $(document).bind("touchstart", this.onTouchStart.bind(this)).bind("touchmove", this.onScrollMove.bind(this)).bind("scroll", this.onScrollMove.bind(this))
            },
            detachTouchEvents: function() {
                $(document).unbind("touchstart", this.onTouchStart.bind(this)).unbind("touchmove", this.onScrollMove.bind(this)).unbind("scroll", this.onScrollMove.bind(this))
            },
            onScrollMove: function() {
                if (Theme.isMobile) {
                    var e = $(document).scrollTop();
                    e > this.lastScrollTop + 10 && 55 < e && "displayed" == this.touchState ? (this.header.addClass("hide"), this.menuButton.addClass("hide"), this.touchState = "hidden") : e < this.lastScrollTop - 10 && "hidden" == this.touchState && (this.header.removeClass("hide"), this.menuButton.removeClass("hide"), this.touchState = "displayed"), this.lastScrollTop = e
                }
            },
            onTouchStart: function(e) {
                this.touchStateY = e.originalEvent.touches[0].clientY
            },
            onClickOutsideMenu: function(e) {
                "header" == e.target.id && $("body").hasClass("is_menu_open") && ($("body").removeClass("is_menu_open"), $(document).off("touchmove"))
            },
            onResize: function() {
                Theme.isMobile = window.matchMedia("(max-width: 767px)").matches, Theme.isMobile ? (this.header = $("header"), this.mobileMenuWidth(), this.bodyPaddingTop(), this.attachTouchEvents()) : (this.header.removeClass("hide"), this.detachTouchEvents())
            },
            onCategoryClick: function() {
                $("nav#menu .menu_list .menu_category > a").on("click", function(e) {
                    e.preventDefault(), $(this).parent().hasClass("show") ? $(this).parent().removeClass("show") : ($("nav#menu .menu_list .menu_category").removeClass("show"), $(this).parent().addClass("show"))
                })
            }
        },
        init: function() {
            this.menu.init()
        }
    },
    Listing = {
        init: function() {
            $(".masonry").length && $(".masonry").masonry()
        },
        resize: function() {
            var e, t = $(".listing_images"),
                n = ["two-columns", "three-columns", "four-columns", "five-columns"],
                i = n.join(" "),
                o = [0, 500, 700, 900],
                s = ["Large", "Medium", "Small", "Auto"].indexOf(_4ORMAT_DATA.theme.listing_thumbnail_size) + 1,
                a = t.width(),
                r = e;
            if (a > o[s]) e = s;
            else
                for (var l = 0; l < 3; l++)
                    if (a >= o[l] && a <= o[l + 1]) {
                        e = l;
                        break
                    } r != e && (t.removeClass(i), t.addClass(n[e]), r = e)
        },
        animation: function() {
            $("._4ORMAT_content_wrapper").removeClass("content-loaded"), $(".listing_image, .listing_title_element").each(function(e) {
                var t = $(this);
                setTimeout(function() {
                    t.addClass("asset-loaded")
                }, 100 * e)
            })
        }
    },
    Gallery = {
        current: null,
        is_ie8: $("html").hasClass("ie8"),
        assets: $("#content .asset"),
        assets_center: $("#content .asset_center"),
        nav_next: $(".js_gallery_navigation .gallery_next"),
        nav_prev: $(".js_gallery_navigation .gallery_prev"),
        images_and_captions: [],
        videos_and_captions: [],
        ie8_hacks: function() {
            $("#content .asset").height($(window).height()), $(".js_gallery_navigation").hide()
        },
        init: function() {
            var e = $("#content .asset" + document.location.hash);
            Gallery.current = e.length ? e : $("#no1"), Thumbs.goToCurrent(), this.lazyload(), setTimeout(function() {
                $("#content").removeClass("is_loading")
            }, 400), Theme.isMobile || (Menu.update_size(), this.init_keyboard()), this.listen_to_scroll(), $("#content").on("click", "a.asset_image_container", function() {
                return Theme.isMobile || Gallery.move("next"), !1
            }), $(".gallery_thumbs").on("click", "a", function(e) {
                e.preventDefault(), Gallery.goTo($(this).attr("href")), Thumbs.goTo($(this).parent("li"))
            }), $(".js_gallery_navigation").on("click", "button", function() {
                var e = $(this).data("action");
                Gallery.move(e)
            }), $(window).on("resize", debounce(function() {
                Gallery.size_assets(), Gallery.center_image(), Thumbs.goToCurrent(), Menu.update_size(), $("html").hasClass("ipad") && Thumbs.goTo(parseInt(document.location.hash.replace("#no", ""), 10))
            }, 200))
        },
        lazyload: function() {
            document.addEventListener("lazybeforeunveil", function(e) {
                $(e.target).parents(".lazyload_container").removeClass("is_loading")
            })
        },
        init_keyboard: function() {
            Mousetrap.bind(["down", "right", "space"], function() {
                return Gallery.move("next"), !1
            }), Mousetrap.bind(["up", "left"], function() {
                return Gallery.move("prev"), !1
            })
        },
        move: function(e) {
            var t = Gallery.current[e]();
            if (!t.length) return !1;
            this.goTo(t[0])
        },
        goTo: function(e) {
            var t = $(e);
            this.set_current(t), this.is_ie8 ? location.replace("#" + Gallery.current[0].id) : window.smoothScroll(Gallery.current[0], SCROLL_SPEED, function() {
                history.replaceState({}, "", "#" + Gallery.current[0].id)
            }), Thumbs.goTo(Number(t[0].id.replace("no", "")))
        },
        update_navigation_status: function() {
            var e = !Gallery.current.next().length,
                t = !Gallery.current.prev().length;
            this.nav_prev.attr("disabled", t), this.nav_next.attr("disabled", e)
        },
        cache_assets_dom_elements: function() {
            $("#content .asset.image").each(function() {
                Gallery.images_and_captions.push({
                    asset: $(this).find("img"),
                    placeholder: $(this).find(".image-placeholder"),
                    caption: $(this).find(".asset_caption")
                })
            }), $("#content .asset.video").each(function() {
                Gallery.videos_and_captions.push({
                    asset: $(this).find(".video_wrapper"),
                    caption: $(this).find(".asset_caption")
                })
            })
        },
        size_assets: function() {
            if (Theme.isMobile) return !1;
            var t = Number($(window).height()) - Number(Menu.menu.outerHeight());
            $.each(Gallery.images_and_captions, function() {
                var e = parseInt(.8 * (t - this.caption.height()), 10);
                this.placeholder.css("max-height", e + "px")
            }), $.each(Gallery.videos_and_captions, function() {
                var e = parseInt(.8 * (t - this.caption.height()), 10) * Number(this.asset.data("video-ratio"));
                this.asset.css("max-width", e + "px")
            })
        },
        listen_to_scroll: function() {
            var n = 0,
                t = new IntersectionObserver(function(e) {
                    e.forEach(function(e) {
                        var t = e.boundingClientRect.y;
                        t < n && e.isIntersecting ? (Gallery.set_current(e.target), Thumbs.goToCurrent()) : n < t && e.isIntersecting && (Gallery.set_current(e.target), Thumbs.goToCurrent())
                    })
                }, {
                    rootMargin: "40%",
                    threshold: 1
                });
            document.querySelectorAll("#content .asset").forEach(function(e) {
                t.observe(e)
            })
        },
        set_current: function(e) {
            this.current = $(e), this.update_navigation_status()
        },
        center_image: function() {
            return !!Gallery.current.length && (!this.is_ie8 && void(Theme.isMobile || $("html").hasClass("ipad") || window.smoothScroll(Gallery.current[0], SCROLL_SPEED, function() {
                history.replaceState({}, "", "#" + Gallery.current[0].id)
            })))
        },
        set_pinning: function(e) {
            $('img[nopin=""]').attr("nopin", "true"), e.find("img").attr("nopin", "")
        }
    },
    Thumbs = {
        elements: $(".gallery_thumbs li"),
        container: $(".gallery_thumbs"),
        is_animating: !1,
        init: function() {
            this.goToCurrent(), setTimeout(function() {
                Thumbs.container.removeClass("is_loading")
            }, 600)
        }
    };
Thumbs.goTo = debounce(function(e) {
    if (Theme.isMobile) return !1;
    if ("object" == typeof e && null !== e) var t = e;
    else {
        if ("number" != typeof e && e % 1 != 0) throw "Error: Thumbs.goTo() expects an integer";
        t = this.elements.eq(e - 1)
    }
    if (!t.length) return !1;
    var n = window.innerHeight / 2 - t.height() / 2,
        i = -(t.position().top - n);
    emile(this.container[0], "top:" + i + "px", {
        duration: 300
    }), this.elements.removeClass("is_selected"), t.addClass("is_selected")
}, 300), Thumbs.goToCurrent = function() {
    if (Gallery.current[0]) {
        var e = parseInt(Gallery.current[0].id.replace("no", ""), 10);
        //console.log(e) // sh code
        //console.log(_4ORMAT_DATA.page.assets[e].dominant_color) // sh code
        //console.log(_4ORMAT_DATA.page.assets[e].id) // sh code
        $('.cursor-text').text(_4ORMAT_DATA.page.assets[e].title);
        //$("body").css("background-color", _4ORMAT_DATA.page.assets[e].dominant_color);// sh code
        document.body.style.backgroundColor = _4ORMAT_DATA.page.assets[e].dominant_color;
        //document.getElementById("content").style.backgroundColor = _4ORMAT_DATA.page.assets[e].dominant_color;
        Thumbs.goTo(e)
    }
};
var Menu = {
    body: $("body"),
    menu: $("#menu"),
    categories: $(".menu_category"),
    prevScrollTop: 0,
    toggle: function() {
        var e = !this.body.hasClass("is_menu_open"),
            t = 0;
        this.menu.children().each(function() {
            t += $(this).outerHeight(!0)
        }), e && (this.menu[0].scrollTop = 0), e ? ($(document).on("touchmove", function(e) {
            e.preventDefault()
        }), t > this.menu.outerHeight(!0) && this.menu.on("touchmove", function(e) {
            e.stopPropagation()
        })) : ($(document).off("touchmove"), this.menu.off("touchmove")), this.body.toggleClass("is_menu_open")
    },
    update_size: function() {
        var e = 0,
            t = $("body").hasClass("gallery_page");
        e = _4ORMAT_DATA.theme.enable_menu_background ? $("header").outerHeight() + 20 : t ? Menu.menu.outerHeight() : $("header").outerHeight(), Theme.isMobile ? Gallery.assets_center.css("padding-top", 0) : _4ORMAT_DATA.theme.enable_fixed_menu && (t ? Gallery.assets_center.css("padding-top", e + "px") : $("#content").css("padding-top", e + "px"))
    },
    check_dropdowns: function() {
        var t = $(window).width();
        Menu.categories.each(function() {
            var e = $(this).offset().left + $(this).find(".menu_dropdown").width();
            t - 20 < e && $(this).addClass("is_dropdown_left")
        })
    }
};
Gallery.cache_assets_dom_elements(), Gallery.size_assets(), Menu.check_dropdowns(), $(window).on("resize", debounce(Menu.check_dropdowns, 200)), $(window).resize(function() {
    "listing" == _4ORMAT_DATA.page.type && Listing.resize()
}), $(document).ready(function() {
    Theme.init(), $(".mobile_menu_button").on("mousedown", $.proxy(Menu.toggle, Menu)), "gallery" == _4ORMAT_DATA.page.type && (Gallery.init.call(Gallery), Thumbs.init()), "listing" == _4ORMAT_DATA.page.type && (Listing.resize(), Listing.init(), Listing.animation())
});