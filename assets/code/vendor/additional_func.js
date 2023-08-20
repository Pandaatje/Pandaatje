function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
  }

  var getCookie = function(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  };

  var handleCloseInfoClick = function() {
    document.cookie = "G024_info_closed=yes";
    var $info = document.getElementById("g024-info");
    var $mainContainer = document.getElementsByClassName("container")[0];
    var $header = document.getElementsByClassName("header")[0];
    $info.parentNode.removeChild($info);
    $mainContainer.style.marginTop = "0";
    $header.style.top = "0";
  }

  var createComputerSvg = function() {
    var computerSvg = document.createElement("span");
    computerSvg.className ="computer-svg";

    return computerSvg;
  }

  var createContent = function() {
    var content = document.createElement("div");
    content.className = "content";
    var titleText = document.createElement("p");
    titleText.className = "title-text";
    var mainText = document.createElement("p");
    mainText.className = "main-text";

    titleText.textContent = "Your website preview.";
    mainText.textContent = "Log in on your desktop to change the Theme, add content and customize the design."

    content.append(titleText);
    content.append(mainText);

    return content;
  }

  var createCloseIconSvg = function() {
    var closeIconSvg = document.createElement("button");
    closeIconSvg.className = "close-icon-svg";
    closeIconSvg.onclick = handleCloseInfoClick;

    return closeIconSvg;
  }

  document.addEventListener("DOMContentLoaded", function() {
    var cookieVal = getCookie("G024_info_closed");
    var $info = document.getElementById("g024-info");
    var $mainContainer = document.getElementsByClassName("container")[0];
    var $header = document.getElementsByClassName("header")[0];
    if (
      getUrlVars().mobiledeviceinfo === "true" &&
      cookieVal !== "yes" &&
      $(window).width() <= 768
    ) {
      $info.classList.add("g024-info-class");
      $info.appendChild(createComputerSvg());
      $info.appendChild(createContent());
      $info.appendChild(createCloseIconSvg());
      $mainContainer.style.marginTop = "80px";
      $header.style.top = "80px";
    }
  })