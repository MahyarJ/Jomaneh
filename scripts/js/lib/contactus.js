var contactusOpen;

contactusOpen = 1;

$('.contactus').click(function() {
  if (contactusOpen === 1) {
    $('.contactus-box').css({
      'left': (window.innerWidth / 7 + 100) + 'px',
      'top': (window.innerHeight / 2 - 200) + 'px'
    });
    $('.main-menu').animate({
      'top': Math.floor(window.innerHeight / 2 - 100) + 'px',
      'opacity': 0
    });
    setTimeout(function() {
      return $('.logo').animate({
        'right': (6 * window.innerWidth / 7 - 300) + 'px'
      });
    }, 800);
    setTimeout(function() {
      return $('.contactus-box').animate({
        'width': '800px',
        'height': '450px',
        'opacity': '.8'
      });
    }, 1000);
    setTimeout(function() {
      return $('.contactus-box p').animate({
        'opacity': '1'
      });
    }, 1800);
    return contactusOpen = 0;
  }
});

$('.contactus-box > .close').click(function() {
  $('.contactus-box p').animate({
    'opacity': '0'
  });
  setTimeout(function() {
    return $('.contactus-box').animate({
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
  return contactusOpen = 1;
});

/*
//@ sourceMappingURL=contactus.map
*/
