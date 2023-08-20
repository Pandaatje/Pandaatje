/*!
* FitVids 1.1
*
* Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
*/
!function(a){"use strict";a.fn.fitVids=function(t){var i={customSelector:null};if(!document.getElementById("fit-vids-style")){var e=document.head||document.getElementsByTagName("head")[0],r=".fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}",d=document.createElement("div");d.innerHTML='<p>x</p><style id="fit-vids-style">'+r+"</style>",e.appendChild(d.childNodes[1])}return t&&a.extend(i,t),this.each(function(){var t=["iframe[src*='player.vimeo.com']","iframe[src*='youtube.com']","iframe[src*='youtube-nocookie.com']","iframe[src*='kickstarter.com'][src*='video.html']","object","embed"];i.customSelector&&t.push(i.customSelector);var e=a(this).find(t.join(","));(e=e.not("object object")).each(function(){var t=a(this);if(!("embed"===this.tagName.toLowerCase()&&t.parent("object").length||t.parent(".fluid-width-video-wrapper").length)){var e=("object"===this.tagName.toLowerCase()||t.attr("height")&&!isNaN(parseInt(t.attr("height"),10))?parseInt(t.attr("height"),10):t.height())/(isNaN(parseInt(t.attr("width"),10))?t.width():parseInt(t.attr("width"),10));if(!t.attr("id")){var i="fitvid"+Math.floor(999999*Math.random());t.attr("id",i)}t.wrap('<div class="fluid-width-video-wrapper"></div>').parent(".fluid-width-video-wrapper").css("padding-top",100*e+"%"),t.removeAttr("height").removeAttr("width")}})})}}(window.jQuery||window.Zepto);