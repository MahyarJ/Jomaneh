var arrowBeater;

arrowBeater = function() {
  $('.arrow').css({
    'opacity': '.2'
  });
  setTimeout(function() {
    return $('.arrow').css({
      'opacity': '.8'
    });
  }, 600);
  return setTimeout(function() {
    return arrowBeater();
  }, 1000);
};

arrowBeater();

/*
//@ sourceMappingURL=repeat.map
*/
