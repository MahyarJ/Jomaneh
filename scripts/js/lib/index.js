var aboutusOpen, moveCloud, moveCloudBack;

$('.main-menu').css({
  'right': Math.floor(window.innerWidth / 2 - 150) + 'px',
  'top': Math.floor(window.innerHeight / 2) + 'px'
});

$('.logo').css({
  'right': Math.floor(window.innerWidth / 2 - 200) + 'px',
  'top': (window.innerHeight / 2 - 300) + 'px',
  'opacity': '1'
});

$('.white-box').css({
  'top': window.innerHeight + 'px',
  'height': window.innerHeight + 'px'
});

aboutusOpen = 1;

$('.logo').click(function() {
  if (aboutusOpen === 1) {
    $('.main-menu').animate({
      'top': Math.floor(window.innerHeight / 2 - 100) + 'px',
      'opacity': 0
    });
    $('.aboutus-box').css({
      'right': (window.innerWidth / 7 + 100) + 'px',
      'top': (window.innerHeight / 2 - 200) + 'px'
    });
    setTimeout(function() {
      return $('.logo').animate({
        'right': (window.innerWidth / 7 - 100) + 'px'
      });
    }, 800);
    setTimeout(function() {
      return $('.aboutus-box').animate({
        'width': '800px',
        'height': '450px',
        'opacity': '.8'
      });
    }, 1000);
    setTimeout(function() {
      return $('.aboutus-box p').animate({
        'opacity': '1'
      });
    }, 1800);
    return aboutusOpen = 0;
  }
});

$('.aboutus-box > .close').click(function() {
  $('.aboutus-box-content').animate({
    'opacity': '0'
  });
  setTimeout(function() {
    return $('.aboutus-box').animate({
      'width': '0',
      'height': '0',
      'opacity': '0'
    });
  }, 600);
  setTimeout(function() {
    return $('.logo').animate({
      'right': Math.floor(window.innerWidth / 2 - 200) + 'px'
    });
  }, 1400);
  setTimeout(function() {
    return $('.main-menu').animate({
      'top': Math.floor(window.innerHeight / 2) + 'px',
      'opacity': '1'
    });
  }, 2000);
  return aboutusOpen = 1;
});

moveCloud = function() {
  var length, swap;
  length = window.innerWidth;
  $('.cloud').css("left", "-3577px");
  swap = 0;
  if ((parseInt($('.cloud').css("left")) < length + 100) || swap === 0) {
    return $('.cloud').animate({
      left: window.innerWidth + 100 + 'px'
    }, 30000, function() {
      swap = 1;
      return moveCloud();
    });
  }
};

moveCloud();

moveCloudBack = function() {
  var length, swap;
  length = window.innerWidth;
  $('.cloud-back').css("left", "-4077px");
  swap = 0;
  if ((parseInt($('.cloud-back').css("left")) < length + 100) || swap === 0) {
    return $('.cloud-back').animate({
      left: window.innerWidth + 50 + 'px'
    }, 50000, function() {
      swap = 1;
      return moveCloudBack();
    });
  }
};

moveCloudBack();

/*
//@ sourceMappingURL=index.map
*/
