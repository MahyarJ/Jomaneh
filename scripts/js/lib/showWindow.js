var allElements, fetchPage, i, localLinkers, localLinks, siteWindow, siteWindowClose, siteWindowContent, __i, _fn, _i, _j, _ref, _ref1;

fetchPage = function(panel) {
  return $.ajax({

		type: 'GET',
		url:  '../pages/window-contents/' + panel + '.php',

	}).done(function(data){

		siteWindowContent.innerHTML = data

	}).fail(function(){

		console.log("Checkout Ajax Failed!");

	});
};

siteWindow = document.querySelector(".window");

siteWindowContent = document.querySelector(".window-content-box-ajax-load");

siteWindowClose = document.querySelector(".window-close");

localLinkers = [];

localLinks = [];

allElements = document.getElementsByTagName("*");

for (i = _i = 0, _ref = allElements.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
  if (allElements[i].getAttribute('data-page')) {
    localLinkers.push(allElements[i]);
    localLinks.push(allElements[i].getAttribute('data-page'));
  }
}

_fn = (function(_this) {
  return function(__i) {
    return localLinkers[__i].addEventListener("click", function(e) {
      siteWindow.style.visibility = "visible";
      fetchPage(localLinks[__i]);
      return siteWindow.style.opacity = 1;
    });
  };
})(this);
for (i = _j = 0, _ref1 = localLinkers.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
  __i = i;
  _fn(__i);
}

siteWindowClose.addEventListener("click", function(e) {
  siteWindow.style.opacity = 0;
  siteWindowContent.innerHTML = "";
  return siteWindow.style.visibility = "hidden";
});

/*
//@ sourceMappingURL=showWindow.map
*/
