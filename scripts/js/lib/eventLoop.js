define(function() {
  var EventLoop, raf;
  raf = typeof requestAnimationFrame !== "undefined" && requestAnimationFrame !== null ? requestAnimationFrame : mozRequestAnimationFrame;
  return EventLoop = (function() {
    function EventLoop() {
      this._callbacks = [];
      this._boundFireFrame = this._fireFrame.bind(this);
    }

    EventLoop.prototype.animate = function() {
      raf(this._boundFireFrame);
      return this;
    };

    EventLoop.prototype.onNextFrame = function(cb) {
      this._callbacks.push(cb);
      return this;
    };

    EventLoop.prototype._fireFrame = function() {
      var cb, cbs, _i, _len;
      cbs = this._callbacks;
      this._callbacks = [];
      for (_i = 0, _len = cbs.length; _i < _len; _i++) {
        cb = cbs[_i];
        cb();
      }
      return this.animate();
    };

    return EventLoop;

  })();
});

/*
//@ sourceMappingURL=eventLoop.map
*/
