var i, imagePreloader, imageSourceURL, index, pageNum, thumbnails, _i, _ref;

imagePreloader = function(parent, imageSource, width, height) {
  var img;
  img = new Image;
  img.style.width = width + "px";
  img.style.height = height + "px";
  img.src = imageSource;
  parent.style.opacity = 0;
  img.onload = function() {
    return parent.style.opacity = 1;
  };
  return img;
};

thumbnails = document.querySelectorAll('.thumbnail');

pageNum = location.pathname[location.pathname.length - 8] + location.pathname[location.pathname.length - 7] + location.pathname[location.pathname.length - 6] + location.pathname[location.pathname.length - 5];

for (i = _i = 1, _ref = thumbnails.length; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
  index = '' + i;
  if (i < 10) {
    index = '0' + i;
  }
  imageSourceURL = '../files/archive/' + pageNum + '/' + index + '.jpg';
  console.log(imageSourceURL);
  thumbnails[i - 1].appendChild(imagePreloader(thumbnails[i - 1], imageSourceURL, 200, 300));
}

/*
//@ sourceMappingURL=preloader.map
*/
