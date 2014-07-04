define(function() {
  var Keyboard;
  return Keyboard = (function() {
    function Keyboard() {
      this.downListeners = {};
      this.upListeners = {};
      this.activeKeys = {};
      document.addEventListener('keydown', (function(_this) {
        return function(e) {
          var keyCode;
          keyCode = e.keyCode;
          if (!_this.downListeners[keyCode]) {
            return;
          }
          if (_this.activeKeys[keyCode]) {
            return;
          }
          _this.activeKeys[keyCode] = true;
          return _this.downListeners[keyCode](e);
        };
      })(this));
      document.addEventListener('keyup', (function(_this) {
        return function(e) {
          var keyCode;
          keyCode = e.keyCode;
          if (!_this.upListeners[keyCode]) {
            return;
          }
          if (_this.activeKeys[keyCode]) {
            _this.activeKeys[keyCode] = false;
          }
          return _this.upListeners[keyCode](e);
        };
      })(this));
    }

    Keyboard.prototype.onDown = function(keyCode, func) {
      return this.downListeners[keyCode] = func;
    };

    Keyboard.prototype.onUp = function(keyCode, func) {
      return this.upListeners[keyCode] = func;
    };

    return Keyboard;

  })();
});

/*
//@ sourceMappingURL=keyboard.map
*/
