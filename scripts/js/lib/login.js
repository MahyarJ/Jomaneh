var cloud, cloudBack, clouds, sky;

sky = document.querySelector('.sky');

clouds = document.querySelector('.clouds');

cloudBack = document.querySelector('.cloud-back');

cloud = document.querySelector('.cloud');

cloud.style.left = "2000px";

$('.cloud').animate({
  left: '-1000px'
}, 16000);

cloudBack.style.left = "3000px";

$('.cloud-back').animate({
  left: '-2000px'
}, 15000);

setTimeout(function() {
  return $('.login-box').animate({
    opacity: .8
  }, 3000);
}, 5000);

/*
//@ sourceMappingURL=login.map
*/
