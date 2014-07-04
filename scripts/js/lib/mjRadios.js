var checkMJRadio, domRadios, i, radios, selectedIndexes, uncheckMJRadio, __i, _fn, _i, _ref;

selectedIndexes = [];

radios = document.querySelectorAll('.mj-radio');

domRadios = document.querySelectorAll('.dom-radio');

checkMJRadio = function(index) {
  radios[index].classList.add("selected");
  selectedIndexes[index] = 1;
  domRadios[index].setAttribute("checked", "");
  setTimeout(function() {
    $('[data-type="' + radios[index].getAttribute("data-product-type") + '"]').css("opacity", 1);
    $('[data-base="' + radios[index].getAttribute("data-product-type") + '"]').css("opacity", 1);
    return $('[data-flav="' + radios[index].getAttribute("data-product-type") + '"]').css("opacity", 1);
  }, 500);
  $('[data-type="' + radios[index].getAttribute("data-product-type") + '"]').css("width", "260px");
  $('[data-base="' + radios[index].getAttribute("data-product-type") + '"]').css("width", "260px");
  return $('[data-flav="' + radios[index].getAttribute("data-product-type") + '"]').css("width", "260px");
};

uncheckMJRadio = function(index) {
  radios[index].classList.remove("selected");
  selectedIndexes[index] = 0;
  domRadios[index].removeAttribute("checked");
  setTimeout(function() {
    $('[data-type="' + radios[index].getAttribute("data-product-type") + '"]').css("width", 0);
    $('[data-base="' + radios[index].getAttribute("data-product-type") + '"]').css("width", 0);
    return $('[data-flav="' + radios[index].getAttribute("data-product-type") + '"]').css("width", 0);
  }, 500);
  $('[data-type="' + radios[index].getAttribute("data-product-type") + '"]').css("opacity", 0);
  $('[data-base="' + radios[index].getAttribute("data-product-type") + '"]').css("opacity", 0);
  return $('[data-flav="' + radios[index].getAttribute("data-product-type") + '"]').css("opacity", 0);
};

_fn = (function(_this) {
  return function(__i) {
    return radios[__i].addEventListener("click", function(e) {
      var index, _j, _ref1, _results;
      if (radios[__i].parentNode.getAttribute('data-multi') === 'no') {
        checkMJRadio(__i);
        _results = [];
        for (index = _j = 0, _ref1 = selectedIndexes.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; index = 0 <= _ref1 ? ++_j : --_j) {
          if (index !== __i && radios[index].parentNode === radios[__i].parentNode) {
            _results.push(uncheckMJRadio(index));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      } else {
        if (selectedIndexes[__i] === 0) {
          return checkMJRadio(__i);
        } else {
          return uncheckMJRadio(__i);
        }
      }
    });
  };
})(this);
for (i = _i = 0, _ref = radios.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
  selectedIndexes[i] = 1;
  __i = i;
  _fn(__i);
}

/*
//@ sourceMappingURL=mjRadios.map
*/
