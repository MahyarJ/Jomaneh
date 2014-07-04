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
      return $('.logo').animate({
        'right': '30px'
      }, 'slow');
    }, 1600);
    setTimeout(function() {
      return $('.products-panel').animate({
        'height': '800px',
        'opacity': '.9'
      });
    }, 2000);
    setTimeout(function() {
      return $('.products-box').animate({
        'height': '800px',
        'opacity': '1'
      });
    }, 2400);
    setTimeout(function() {
      return $('.products-box-content').animate({
        'opacity': '1'
      });
    }, 2500);
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
//@ sourceMappingURL=products.map
*/
