define(['transitions'], function(Transitions) {
  var Tween;
  return Tween = (function() {
    function Tween(el, from, to, duration, delay) {
      this.el = el;
      this.from = from;
      this.to = to;
      this.duration = duration;
      this.delay = delay;
    }

    Tween.prototype.setStart = function() {
      return this.startTime = Date.now() + this.delay;
    };

    Tween.prototype.calculateProgress = function(action) {
      var now, progress;
      this.action = action;
      now = Date.now();
      if ((now - this.startTime) < 0) {
        progress = 0;
      } else {
        progress = (now - this.startTime) / this.duration;
      }
      return this.createCurve(progress);
    };

    Tween.prototype.createCurve = function(progressRatio) {
      var __result;
      if (this.action === 'quint') {
        __result = Transitions.quint.easeOut(progressRatio);
      }
      if (this.action === 'cosine') {
        __result = Math.cos(progressRatio * Math.PI / 2);
      }
      return __result;
    };

    return Tween;

  })();
});

/*
//@ sourceMappingURL=tween.map
*/
