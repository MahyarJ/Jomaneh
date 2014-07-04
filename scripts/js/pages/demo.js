define(['css'], function(css) {
  var cloud, cloudBack, clouds, i, j, labelI, labelJ, logo, moveClouds, sky;
  window.requestAnimationFrame = (function() {
    if (typeof window.requestAnimationFrame !== 'undefined') {
      return requestAnimationFrame;
    }
    if (typeof window.webkitRequestAnimationFrame !== 'undefined') {
      return webkitRequestAnimationFrame;
    }
    if (typeof window.mozRequestAnimationFrame !== 'undefined') {
      return mozRequestAnimationFrame;
    }
    return function(cb) {
      return setTimeout(cb, 16.66);
    };
  })();
  sky = document.querySelector('.sky');
  clouds = document.querySelector('.clouds');
  cloudBack = document.querySelector('.cloud-back');
  cloud = document.querySelector('.cloud');
  logo = document.querySelector('.logo');
  logo.style.opacity = 0;
  logo.style.webkitTransform = "translateX(90px) rotateY(50deg)";
  i = 1;
  j = 1;
  setTimeout((function(_this) {
    return function() {
      logo.style.webkitTransition = "all 3s";
      logo.style.webkitTransform = "translateX(1px) rotateY(1deg)";
      return logo.style.opacity = 1;
    };
  })(this), 10000);
  labelI = document.getElementById("text-i");
  labelJ = document.getElementById("text-j");
  return (moveClouds = function() {
    css.setTransform(cloud, "scaleX(-1) translateX(" + i + "px)");
    css.setTransform(cloudBack, "translateX(" + (-j / 2) + "px)");
    if (i > 6300) {
      cloud.style.webkitTransform = "scaleX(-1) translateX(0)";
      i = 1;
    }
    if (j > 11100) {
      cloudBack.style.webkitTransform = "translateX(0)";
      j = 1;
    }
    i++;
    j++;
    return requestAnimationFrame(moveClouds);
  })();
});

/*
//@ sourceMappingURL=demo.map
*/
