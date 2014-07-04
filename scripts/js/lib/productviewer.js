var productsOpen;

productsOpen = 1;

$('.products').click(function() {
  if (productsOpen === 1) {
    $('.main-menu').animate({
      'opacity': 0,
      'top': Math.floor(window.innerHeight / 2 - 100) + 'px'
    });
    setTimeout(function() {
      return $('.logo').animate({
        'top': '30px'
      }, 'slow');
    }, 600);
    setTimeout(function() {
      return $('.products-box').animate({
        'opacity': '.8'
      });
    }, 1200);
    setTimeout(function() {
      return $('.products-box-content').animate({
        'opacity': '1'
      });
    }, 1800);
    return productsOpen = 0;
  }
});

$('.products-box > .close').click(function() {
  $('.products-content-box').animate({
    'opacity': '0'
  });
  setTimeout(function() {
    return $('.products-box').animate({
      'opacity': '0',
      'height': '0'
    });
  }, 600);
  setTimeout(function() {
    return $('.logo').animate({
      'top': (window.innerHeight / 2 - 300) + 'px'
    });
  }, 1400);
  setTimeout(function() {
    return $('.main-menu').animate({
      'opacity': '1',
      'top': Math.floor(window.innerHeight / 2) + 'px'
    });
  }, 1800);
  return productsOpen = 1;
});

/*
//@ sourceMappingURL=productviewer.map
*/
