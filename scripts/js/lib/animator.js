define(['tween'], function(Tween) {
  var Animator;
  return Animator = (function() {
    function Animator() {
      this.from = {
        tX: 0,
        tY: 0,
        tZ: 0,
        rX: 0,
        rY: 0,
        rZ: 0,
        sX: 1,
        sY: 1,
        sZ: 1,
        oP: 1
      };
      this.to = {
        tX: 0,
        tY: 0,
        tZ: 0,
        rX: 0,
        rY: 0,
        rZ: 0,
        sX: 1,
        sY: 1,
        sZ: 1,
        oP: 1
      };
    }

    Animator.prototype.fromState = function(param) {
      return this.from = {
        tX: param.tX || 0,
        tY: param.tY || 0,
        tZ: param.tZ || 0,
        rX: param.rX || 0,
        rY: param.rY || 0,
        rZ: param.rZ || 0,
        sX: param.sX + .001 || 1,
        sY: param.sY + .001 || 1,
        sZ: param.sZ + .001 || 1,
        oP: param.oP + .001 || 1
      };
    };

    Animator.prototype.toState = function(param) {
      return this.to = {
        tX: param.tX || 0,
        tY: param.tY || 0,
        tZ: param.tZ || 0,
        rX: param.rX || 0,
        rY: param.rY || 0,
        rZ: param.rZ || 0,
        sX: param.sX + .001 || 1,
        sY: param.sY + .001 || 1,
        sZ: param.sZ + .001 || 1,
        oP: param.oP + .001 || 1
      };
    };

    Animator.prototype.start = function(el, dur, del) {
      var finishCordination, startCordination;
      this.duration = dur || 1000;
      this.delay = del || 0;
      startCordination = [this.from.tX, this.from.tY, this.from.tZ];
      finishCordination = [this.to.tX, this.to.tY, this.to.tZ];
      this.mover = new Tween(el, startCordination, finishCordination, this.duration, this.delay);
      this.mover.setStart();
      return this.animate();
    };

    Animator.prototype.animate = function() {
      var currentOP, currentRX, currentRY, currentRZ, currentSX, currentSY, currentSZ, currentX, currentY, currentZ, progress;
      progress = this.mover.calculateProgress('quint');
      currentX = this.from.tX + (this.to.tX - this.from.tX) * progress;
      currentY = this.from.tY + (this.to.tY - this.from.tY) * progress;
      currentZ = this.from.tZ + (this.to.tZ - this.from.tZ) * progress;
      currentRX = this.from.rX + (this.to.rX - this.from.rX) * progress;
      currentRY = this.from.rY + (this.to.rY - this.from.rY) * progress;
      currentRZ = this.from.rZ + (this.to.rZ - this.from.rZ) * progress;
      currentSX = this.from.sX + (this.to.sX - this.from.sX) * progress;
      currentSY = this.from.sY + (this.to.sY - this.from.sY) * progress;
      currentSZ = this.from.sZ + (this.to.sZ - this.from.sZ) * progress;
      currentOP = this.from.oP + (this.to.oP - this.from.oP) * progress;
      this.mover.el.style.webkitTransform = ("translate3d(" + (currentX.toFixed(5)) + "px, " + (currentY.toFixed(5)) + "px, " + (currentZ.toFixed(5)) + "px) ") + "perspective(10000) " + ("scale3d(" + (currentSX.toFixed(5)) + ", " + (currentSY.toFixed(5)) + ", " + (currentSZ.toFixed(5)) + ") ") + ("rotate3d(1, 0, 0, " + (currentRX.toFixed(5)) + "deg) ") + ("rotate3d(0, 1, 0, " + (currentRY.toFixed(5)) + "deg) ") + ("rotate3d(0, 0, 1, " + (currentRZ.toFixed(5)) + "deg) ");
      this.mover.el.style.opacity = currentOP;
      if (progress < 1) {
        return webkitRequestAnimationFrame((function(_this) {
          return function() {
            return _this.animate();
          };
        })(this));
      }
    };

    return Animator;

  })();
});

/*
//@ sourceMappingURL=animator.map
*/
