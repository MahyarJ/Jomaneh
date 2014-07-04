!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(e):"undefined"!=typeof window?window.Foxie=e():"undefined"!=typeof global?global.Foxie=e():"undefined"!=typeof self&&(self.Foxie=e())}(function(){var define,module,exports;
return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Transformation, copyStack, emptyStack, perspective, rotation, scale, translation;

perspective = require('./transformation/perspective');

translation = require('./transformation/translation');

rotation = require('./transformation/rotation');

scale = require('./transformation/scale');

emptyStack = function() {
  var a;
  a = new Float64Array(16);
  a[0] = 0;
  a[1] = 0;
  a[2] = 0;
  a[3] = 1;
  a[4] = 1;
  a[5] = 1;
  a[6] = 10000;
  a[7] = 0;
  a[8] = 0;
  a[9] = 0;
  a[10] = 0;
  a[11] = 0;
  a[12] = 0;
  a[13] = 0;
  a[14] = 0;
  a[15] = 0;
  return a;
};

copyStack = function(from, to) {
  to[0] = from[0];
  to[1] = from[1];
  to[2] = from[2];
  to[3] = from[3];
  to[4] = from[4];
  to[5] = from[5];
  to[6] = from[6];
  to[7] = from[7];
  to[8] = from[8];
  to[9] = from[9];
  to[10] = from[10];
  to[11] = from[11];
  to[12] = from[12];
  to[13] = from[13];
  to[14] = from[14];
  to[15] = from[15];
};

module.exports = Transformation = (function() {
  Transformation._emptyStack = emptyStack;

  function Transformation() {
    this._main = emptyStack();
    this._temp = emptyStack();
    this._current = this._main;
    this._has = {
      movement: false,
      perspective: false,
      rotation: false,
      scale: false,
      localMovement: false,
      localRotation: false
    };
    this._tempMode = false;
  }

  Transformation.prototype.temporarily = function() {
    copyStack(this._main, this._temp);
    this._current = this._temp;
    this._tempMode = true;
    return this;
  };

  Transformation.prototype.commit = function() {
    if (this._tempMode) {
      copyStack(this._temp, this._main);
      this._current = this._main;
      this._tempMode = false;
    }
    return this;
  };

  Transformation.prototype.rollBack = function() {
    if (this._tempMode) {
      this._current = this._main;
      this._tempMode = false;
    }
    return this;
  };

  Transformation.prototype.toPlainCss = function() {
    var css;
    if (this._has.movement) {
      css = translation.toPlainCss(this._current[0], this._current[1], this._current[2]);
    } else {
      css = '';
    }
    if (this._has.perspective) {
      css += perspective.toPlainCss(this._current[6]);
    }
    if (this._has.rotation) {
      css += rotation.toPlainCss(this._current[7], this._current[8], this._current[9]);
    }
    if (this._has.localMovement) {
      css += translation.toPlainCss(this._current[10], this._current[11], this._current[12]);
    }
    if (this._has.localRotation) {
      css += rotation.toPlainCss(this._current[13], this._current[14], this._current[15]);
    }
    if (this._has.scale) {
      css += scale.toPlainCss(this._current[3], this._current[4], this._current[5]);
    }
    return css;
  };

  /*
  	Movement
  */


  Transformation.prototype.resetMovement = function() {
    this._has.movement = false;
    this._current[0] = 0;
    this._current[1] = 0;
    this._current[2] = 0;
    return this;
  };

  Transformation.prototype.movement = function() {
    return {
      x: this._current[0],
      y: this._current[1],
      z: this._current[2]
    };
  };

  Transformation.prototype.moveTo = function(x, y, z) {
    this._has.movement = true;
    this._current[0] = x;
    this._current[1] = y;
    this._current[2] = z;
    return this;
  };

  Transformation.prototype.moveXTo = function(x) {
    this._has.movement = true;
    this._current[0] = x;
    return this;
  };

  Transformation.prototype.moveYTo = function(y) {
    this._has.movement = true;
    this._current[1] = y;
    return this;
  };

  Transformation.prototype.moveZTo = function(z) {
    this._has.movement = true;
    this._current[2] = z;
    return this;
  };

  Transformation.prototype.move = function(x, y, z) {
    this._has.movement = true;
    this._current[0] += x;
    this._current[1] += y;
    this._current[2] += z;
    return this;
  };

  Transformation.prototype.moveX = function(x) {
    this._has.movement = true;
    this._current[0] += x;
    return this;
  };

  Transformation.prototype.moveY = function(y) {
    this._has.movement = true;
    this._current[1] += y;
    return this;
  };

  Transformation.prototype.moveZ = function(z) {
    this._has.movement = true;
    this._current[2] += z;
    return this;
  };

  /*
  	Scale
  */


  Transformation.prototype.resetScale = function() {
    this._has.scale = false;
    this._current[3] = 1;
    this._current[4] = 1;
    this._current[5] = 1;
    return this;
  };

  Transformation.prototype.getScale = function() {
    return {
      x: this._current[3],
      y: this._current[4],
      z: this._current[5]
    };
  };

  Transformation.prototype.scaleTo = function(x, y, z) {
    this._has.scale = true;
    this._current[3] = x;
    this._current[4] = y;
    this._current[5] = z;
    return this;
  };

  Transformation.prototype.scaleXTo = function(x) {
    this._has.scale = true;
    this._current[3] = x;
    return this;
  };

  Transformation.prototype.scaleYTo = function(y) {
    this._has.scale = true;
    this._current[4] = y;
    return this;
  };

  Transformation.prototype.scaleZTo = function(z) {
    this._has.scale = true;
    this._current[5] = z;
    return this;
  };

  Transformation.prototype.scale = function(x, y, z) {
    this._has.scale = true;
    this._current[3] *= x;
    this._current[4] *= y;
    this._current[5] *= z;
    return this;
  };

  Transformation.prototype.scaleAllTo = function(x) {
    if (x === 1) {
      this._has.scale = false;
    } else {
      this._has.scale = true;
    }
    this._current[3] = this._current[4] = this._current[5] = x;
    return this;
  };

  Transformation.prototype.scaleX = function(x) {
    this._has.scale = true;
    this._current[3] *= x;
    return this;
  };

  Transformation.prototype.scaleY = function(y) {
    this._has.scale = true;
    this._current[4] *= y;
    return this;
  };

  Transformation.prototype.scaleZ = function(z) {
    this._has.scale = true;
    this._current[5] *= z;
    return this;
  };

  /*
  	Perspective
  */


  Transformation.prototype.resetPerspective = function() {
    this._current[6] = 0;
    this._has.perspective = false;
    return this;
  };

  Transformation.prototype.perspective = function(d) {
    this._current[6] = d;
    if (d) {
      this._has.perspective = true;
    }
    return this;
  };

  /*
  	Rotation
  */


  Transformation.prototype.resetRotation = function() {
    this._has.rotation = false;
    this._current[7] = 0;
    this._current[8] = 0;
    this._current[9] = 0;
    return this;
  };

  Transformation.prototype.rotation = function() {
    return {
      x: this._current[7],
      y: this._current[8],
      z: this._current[9]
    };
  };

  Transformation.prototype.rotateTo = function(x, y, z) {
    this._has.rotation = true;
    this._current[7] = x;
    this._current[8] = y;
    this._current[9] = z;
    return this;
  };

  Transformation.prototype.rotateXTo = function(x) {
    this._has.rotation = true;
    this._current[7] = x;
    return this;
  };

  Transformation.prototype.rotateYTo = function(y) {
    this._has.rotation = true;
    this._current[8] = y;
    return this;
  };

  Transformation.prototype.rotateZTo = function(z) {
    this._has.rotation = true;
    this._current[9] = z;
    return this;
  };

  Transformation.prototype.rotate = function(x, y, z) {
    this._has.rotation = true;
    this._current[7] += x;
    this._current[8] += y;
    this._current[9] += z;
    return this;
  };

  Transformation.prototype.rotateX = function(x) {
    this._has.rotation = true;
    this._current[7] += x;
    return this;
  };

  Transformation.prototype.rotateY = function(y) {
    this._has.rotation = true;
    this._current[8] += y;
    return this;
  };

  Transformation.prototype.rotateZ = function(z) {
    this._has.rotation = true;
    this._current[9] += z;
    return this;
  };

  /*
  	Local Movement
  */


  Transformation.prototype.resetLocalMovement = function() {
    this._has.localMovement = false;
    this._current[10] = 0;
    this._current[11] = 0;
    this._current[12] = 0;
    return this;
  };

  Transformation.prototype.localMovement = function() {
    return {
      x: this._current[10],
      y: this._current[11],
      z: this._current[12]
    };
  };

  Transformation.prototype.localMoveTo = function(x, y, z) {
    this._has.localMovement = true;
    this._current[10] = x;
    this._current[11] = y;
    this._current[12] = z;
    return this;
  };

  Transformation.prototype.localMoveXTo = function(x) {
    this._has.localMovement = true;
    this._current[10] = x;
    return this;
  };

  Transformation.prototype.localMoveYTo = function(y) {
    this._has.localMovement = true;
    this._current[11] = y;
    return this;
  };

  Transformation.prototype.localMoveZTo = function(z) {
    this._has.localMovement = true;
    this._current[12] = z;
    return this;
  };

  Transformation.prototype.localMove = function(x, y, z) {
    this._has.localMovement = true;
    this._current[10] += x;
    this._current[11] += y;
    this._current[12] += z;
    return this;
  };

  Transformation.prototype.localMoveX = function(x) {
    this._has.localMovement = true;
    this._current[10] += x;
    return this;
  };

  Transformation.prototype.localMoveY = function(y) {
    this._has.localMovement = true;
    this._current[11] += y;
    return this;
  };

  Transformation.prototype.localMoveZ = function(z) {
    this._has.localMovement = true;
    this._current[12] += z;
    return this;
  };

  /*
  	Local Rotation
  */


  Transformation.prototype.resetLocalRotation = function() {
    this._has.localRotation = false;
    this._current[13] = 0;
    this._current[14] = 0;
    this._current[15] = 0;
    return this;
  };

  Transformation.prototype.localRotation = function() {
    return {
      x: this._current[13],
      y: this._current[14],
      z: this._current[15]
    };
  };

  Transformation.prototype.localRotateTo = function(x, y, z) {
    this._has.localRotation = true;
    this._current[13] = x;
    this._current[14] = y;
    this._current[15] = z;
    return this;
  };

  Transformation.prototype.localRotateXTo = function(x) {
    this._has.localRotation = true;
    this._current[13] = x;
    return this;
  };

  Transformation.prototype.localRotateYTo = function(y) {
    this._has.localRotation = true;
    this._current[14] = y;
    return this;
  };

  Transformation.prototype.localRotateZTo = function(z) {
    this._has.localRotation = true;
    this._current[15] = z;
    return this;
  };

  Transformation.prototype.localRotate = function(x, y, z) {
    this._has.localRotation = true;
    this._current[13] += x;
    this._current[14] += y;
    this._current[15] += z;
    return this;
  };

  Transformation.prototype.localRotateX = function(x) {
    this._has.localRotation = true;
    this._current[13] += x;
    return this;
  };

  Transformation.prototype.localRotateY = function(y) {
    this._has.localRotation = true;
    this._current[14] += y;
    return this;
  };

  Transformation.prototype.localRotateZ = function(z) {
    this._has.localRotation = true;
    this._current[15] += z;
    return this;
  };

  Transformation.prototype.resetAll = function() {
    this.resetMovement();
    this.resetScale();
    this.resetPerspective();
    this.resetRotation();
    this.resetLocalMovement();
    return this.resetLocalRotation();
  };

  return Transformation;

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhbnNmb3JtYXRpb24uanMiLCJzb3VyY2VSb290IjoiLi5cXC4uIiwic291cmNlcyI6WyJjb2ZmZWVcXGxpYlxcVHJhbnNmb3JtYXRpb24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU1BLElBQUEsNEVBQUE7O0FBQUEsQ0FBQSxFQUFjLElBQUEsSUFBZCxtQkFBYzs7QUFDZCxDQURBLEVBQ2MsSUFBQSxJQUFkLG1CQUFjOztBQUNkLENBRkEsRUFFVyxJQUFBLENBQVgsbUJBQVc7O0FBQ1gsQ0FIQSxFQUdRLEVBQVIsRUFBUSxpQkFBQTs7QUFFUixDQUxBLEVBS2EsTUFBQSxDQUFiO0NBRUMsS0FBQTtDQUFBLENBQUEsQ0FBUSxDQUFBLFFBQUE7Q0FBUixDQUVBLENBQU87Q0FGUCxDQUdBLENBQU87Q0FIUCxDQUlBLENBQU87Q0FKUCxDQU1BLENBQU87Q0FOUCxDQU9BLENBQU87Q0FQUCxDQVFBLENBQU87Q0FSUCxDQVVBLENBQU8sRUFWUDtDQUFBLENBWUEsQ0FBTztDQVpQLENBYUEsQ0FBTztDQWJQLENBY0EsQ0FBTztDQWRQLENBZ0JBLENBQVE7Q0FoQlIsQ0FpQkEsQ0FBUTtDQWpCUixDQWtCQSxDQUFRO0NBbEJSLENBb0JBLENBQVE7Q0FwQlIsQ0FxQkEsQ0FBUTtDQXJCUixDQXNCQSxDQUFRO0NBeEJJLFFBMEJaO0NBMUJZOztBQTRCYixDQWpDQSxDQWlDbUIsQ0FBUCxDQUFBLEtBQVo7Q0FFQyxDQUFBLENBQVEsQ0FBSztDQUFiLENBQ0EsQ0FBUSxDQUFLO0NBRGIsQ0FFQSxDQUFRLENBQUs7Q0FGYixDQUlBLENBQVEsQ0FBSztDQUpiLENBS0EsQ0FBUSxDQUFLO0NBTGIsQ0FNQSxDQUFRLENBQUs7Q0FOYixDQVFBLENBQVEsQ0FBSztDQVJiLENBVUEsQ0FBUSxDQUFLO0NBVmIsQ0FXQSxDQUFRLENBQUs7Q0FYYixDQVlBLENBQVEsQ0FBSztDQVpiLENBY0EsQ0FBUyxDQUFLO0NBZGQsQ0FlQSxDQUFTLENBQUs7Q0FmZCxDQWdCQSxD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LENBQWhCLElBQVU7Q0FKSyxVQU1mO0NBL2dCRCxFQXlnQmdCOztDQXpnQmhCLEVBaWhCZ0IsTUFBQyxLQUFqQjtDQUVDLEVBQXNCLENBQXRCLFNBQUE7Q0FBQSxDQUVVLENBQU0sQ0FBaEIsSUFBVTtDQUpLLFVBTWY7Q0F2aEJELEVBaWhCZ0I7O0NBamhCaEIsRUF5aEJnQixNQUFDLEtBQWpCO0NBRUMsRUFBc0IsQ0FBdEIsU0FBQTtDQUFBLENBRVUsQ0FBTSxDQUFoQixJQUFVO0NBSkssVUFNZjtDQS9oQkQsRUF5aEJnQjs7Q0F6aEJoQixDQWlpQmlCLENBQUosTUFBQyxFQUFkO0NBRUMsRUFBc0IsQ0FBdEIsU0FBQTtDQUFBLENBRVUsRUFBVixJQUFVO0NBRlYsQ0FHVSxFQUFWLElBQVU7Q0FIVixDQUlVLEVBQVYsSUFBVTtDQU5FLFVBUVo7Q0F6aUJELEVBaWlCYTs7Q0FqaUJiLEVBMmlCYyxNQUFDLEdBQWY7Q0FFQyxFQUFzQixDQUF0QixTQUFBO0NBQUEsQ0FFVSxFQUFWLElBQVU7Q0FKRyxVQU1iO0NBampCRCxFQTJpQmM7O0NBM2lCZCxFQW1qQmMsTUFBQyxHQUFmO0NBRUMsRUFBc0IsQ0FBdEIsU0FBQTtDQUFBLENBRVUsRUFBVixJQUFVO0NBSkcsVUFNYjtDQXpqQkQsRUFtakJjOztDQW5qQmQsRUEyakJjLE1BQUMsR0FBZjtDQUVDLEVBQXNCLENBQXRCLFNBQUE7Q0FBQSxDQUVVLEVBQVYsSUFBVTtDQUpHLFVBTWI7Q0Fqa0JELEVBMmpCYzs7Q0EzakJkLEVBbWtCVSxLQUFWLENBQVU7Q0FFVCxHQUFHLFNBQUg7Q0FBQSxHQUNHLE1BQUg7Q0FEQSxHQUVHLFlBQUg7Q0FGQSxHQUdHLFNBQUg7Q0FIQSxHQUlHLGNBQUg7Q0FDSSxHQUFBLE9BQUQsT0FBSDtDQTFrQkQsRUFta0JVOztDQW5rQlY7O0NBN0REIiwic291cmNlc0NvbnRlbnQiOlsiIyBUaGlzIHVzZWQgdG8gYmUgYSBjb21wbGV0ZSAzZCB0cmFuc2Zvcm1hdGlvbiBsaWJyYXJ5LFxuIyBidXQgSSdtIGN1dHRpbmcgaXQgZG93biB0byBhIGJhc2ljIDNkIHRyYW5zZm9ybWF0aW9uXG4jIGdldC9zZXQgYXBpLlxuI1xuIyBJJ2xsIGxlYXZlIHRoZSBtYXRyaXggY2FsY3VsYXRpb25zIHRvIGFuIGV4dGVybmFsIGxpYi5cblxucGVyc3BlY3RpdmUgPSByZXF1aXJlICcuL3RyYW5zZm9ybWF0aW9uL3BlcnNwZWN0aXZlJ1xudHJhbnNsYXRpb24gPSByZXF1aXJlICcuL3RyYW5zZm9ybWF0aW9uL3RyYW5zbGF0aW9uJ1xucm90YXRpb24gPSByZXF1aXJlICcuL3RyYW5zZm9ybWF0aW9uL3JvdGF0aW9uJ1xuc2NhbGUgPSByZXF1aXJlICcuL3RyYW5zZm9ybWF0aW9uL3NjYWxlJ1xuXG5lbXB0eVN0YWNrID0gLT5cblxuXHRhID0gbmV3IEZsb2F0NjRBcnJheSAxNlxuXG5cdGFbMF0gPSAwXG5cdGFbMV0gPSAwXG5cdGFbMl0gPSAwXG5cblx0YVszXSA9IDFcblx0YVs0XSA9IDFcblx0YVs1XSA9IDFcblxuXHRhWzZdID0gMTAwMDBcblxuXHRhWzddID0gMFxuXHRhWzhdID0gMFxuXHRhWzldID0gMFxuXG5cdGFbMTBdID0gMFxuXHRhWzExXSA9IDBcblx0YVsxMl0gPSAwXG5cblx0YVsxM10gPSAwXG5cdGFbMTRdID0gMFxuXHRhWzE1XSA9IDBcblxuXHRhXG5cbmNvcHlTdGFjayA9IChmcm9tLCB0bykgLT5cblxuXHR0b1swXSA9IGZyb21bMF1cblx0dG9bMV0gPSBmcm9tWzFdXG5cdHRvWzJdID0gZnJvbVsyXVxuXG5cdHRvWzNdID0gZnJvbVszXVxuXHR0b1s0XSA9IGZyb21bNF1cblx0dG9bNV0gPSBmcm9tWzVdXG5cblx0dG9bNl0gPSBmcm9tWzZdXG5cblx0dG9bN10gPSBmcm9tWzddXG5cdHRvWzhdID0gZnJvbVs4XVxuXHR0b1s5XSA9IGZyb21bOV1cblxuXHR0b1sxMF0gPSBmcm9tWzEwXVxuXHR0b1sxMV0gPSBmcm9tWzExXVxuXHR0b1sxMl0gPSBmcm9tWzEyXVxuXG5cdHRvWzEzXSA9IGZyb21bMTNdXG5cdHRvWzE0XSA9IGZyb21bMTRdXG5cdHRvWzE1XSA9IGZyb21bMTVdXG5cblx0cmV0dXJuXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVHJhbnNmb3JtYXRpb25cblxuXHRAX2VtcHR5U3RhY2s6IGVtcHR5U3RhY2tcblxuXHRjb25zdHJ1Y3RvcjogLT5cblxuXHRcdEBfbWFpbiA9IGVtcHR5U3RhY2soKVxuXHRcdEBfdGVtcCA9IGVtcHR5U3RhY2soKVxuXG5cdFx0QF9jdXJyZW50ID0gQF9tYWluXG5cblx0XHRAX2hhcyA9XG5cblx0XHRcdG1vdmVtZW50OiBub1xuXG5cdFx0XHRwZXJzcGVjdGl2ZTogbm9cblxuXHRcdFx0cm90YXRpb246IG5vXG5cblx0XHRcdHNjYWxlOiBub1xuXG5cdFx0XHRsb2NhbE1vdmVtZW50OiBub1xuXG5cdFx0XHRsb2NhbFJvdGF0aW9uOiBub1xuXG5cdFx0QF90ZW1wTW9kZSA9IG5vXG5cblx0dGVtcG9yYXJpbHk6IC0+XG5cblx0XHRjb3B5U3RhY2sgQF9tYWluLCBAX3RlbXBcblx0XHRAX2N1cnJlbnQgPSBAX3RlbXBcblxuXHRcdEBfdGVtcE1vZGUgPSB5ZXNcblxuXHRcdEBcblxuXHRjb21taXQ6IC0+XG5cblx0XHRpZiBAX3RlbXBNb2RlXG5cblx0XHRcdGNvcHlTdGFjayBAX3RlbXAsIEBfbWFpblxuXHRcdFx0QF9jdXJyZW50ID0gQF9tYWluXG5cblx0XHRcdEBfdGVtcE1vZGUgPSBub1xuXG5cdFx0QFxuXG5cdHJvbGxCYWNrOiAtPlxuXG5cdFx0aWYgQF90ZW1wTW9kZVxuXG5cdFx0XHRAX2N1cnJlbnQgPSBAX21haW5cblxuXHRcdFx0QF90ZW1wTW9kZSA9IG5vXG5cblx0XHRAXG5cblx0dG9QbGFpbkNzczogLT5cblxuXHRcdCMgbW92ZW1lbnRcblx0XHRpZiBAX2hhcy5tb3ZlbWVudFxuXG5cdFx0XHRjc3MgPSB0cmFuc2xhdGlvbi50b1BsYWluQ3NzIEBfY3VycmVudFswXSwgQF9jdXJyZW50WzFdLCBAX2N1cnJlbnRbMl1cblxuXHRcdGVsc2VcblxuXHRcdFx0Y3NzID0gJydcblxuXHRcdCMgcGVyc3BlY3RvdmVcblx0XHRpZiBAX2hhcy5wZXJzcGVjdGl2ZVxuXG5cdFx0XHRjc3MgKz0gcGVyc3BlY3RpdmUudG9QbGFpbkNzcyBAX2N1cnJlbnRbNl1cblxuXHRcdCMgcm90YXRpb25cblx0XHRpZiBAX2hhcy5yb3RhdGlvblxuXG5cdFx0XHRjc3MgKz0gcm90YXRpb24udG9QbGFpbkNzcyBAX2N1cnJlbnRbN10sIEBfY3VycmVudFs4XSwgQF9jdXJyZW50WzldXG5cblx0XHQjIHRyYW5zbGF0aW9uXG5cdFx0aWYgQF9oYXMubG9jYWxNb3ZlbWVudFxuXG5cdFx0XHRjc3MgKz0gdHJhbnNsYXRpb24udG9QbGFpbkNzcyBAX2N1cnJlbnRbMTBdLCBAX2N1cnJlbnRbMTFdLCBAX2N1cnJlbnRbMTJdXG5cblx0XHQjIHJvdGF0aW9uXG5cdFx0aWYgQF9oYXMubG9jYWxSb3RhdGlvblxuXG5cdFx0XHRjc3MgKz0gcm90YXRpb24udG9QbGFpbkNzcyBAX2N1cnJlbnRbMTNdLCBAX2N1cnJlbnRbMTRdLCBAX2N1cnJlbnRbMTVdXG5cblx0XHQjIHNjYWxlXG5cdFx0aWYgQF9oYXMuc2NhbGVcblxuXHRcdFx0Y3NzICs9IHNjYWxlLnRvUGxhaW5Dc3MgQF9jdXJyZW50WzNdLCBAX2N1cnJlbnRbNF0sIEBfY3VycmVudFs1XVxuXG5cdFx0Y3NzXG5cblx0IyMjXG5cdE1vdmVtZW50XG5cdCMjI1xuXG5cdHJlc2V0TW92ZW1lbnQ6IC0+XG5cblx0XHRAX2hhcy5tb3ZlbWVudCA9IG5vXG5cblx0XHRAX2N1cnJlbnRbMF0gPSAwXG5cdFx0QF9jdXJyZW50WzFdID0gMFxuXHRcdEBfY3VycmVudFsyXSA9IDBcblxuXHRcdEBcblxuXHRtb3ZlbWVudDogLT5cblxuXHRcdHtcblx0XHRcdHg6IEBfY3VycmVudFswXVxuXHRcdFx0eTogQF9jdXJyZW50WzFdXG5cdFx0XHR6OiBAX2N1cnJlbnRbMl1cblx0XHR9XG5cblx0bW92ZVRvOiAoeCwgeSwgeikgLT5cblxuXHRcdEBfaGFzLm1vdmVtZW50ID0geWVzXG5cblx0XHRAX2N1cnJlbnRbMF0gPSB4XG5cdFx0QF9jdXJyZW50WzFdID0geVxuXHRcdEBfY3VycmVudFsyXSA9IHpcblxuXHRcdEBcblxuXHRtb3ZlWFRvOiAoeCkgLT5cblxuXHRcdEBfaGFzLm1vdmVtZW50ID0geWVzXG5cblx0XHRAX2N1cnJlbnRbMF0gPSB4XG5cblx0XHRAXG5cblx0bW92ZVlUbzogKHkpIC0+XG5cblx0XHRAX2hhcy5tb3ZlbWVudCA9IHllc1xuXG5cdFx0QF9jdXJyZW50WzFdID0geVxuXG5cdFx0QFxuXG5cdG1vdmVaVG86ICh6KSAtPlxuXG5cdFx0QF9oYXMubW92ZW1lbnQgPSB5ZXNcblxuXHRcdEBfY3VycmVudFsyXSA9IHpcblxuXHRcdEBcblxuXHRtb3ZlOiAoeCwgeSwgeikgLT5cblxuXHRcdEBfaGFzLm1vdmVtZW50ID0geWVzXG5cblx0XHRAX2N1cnJlbnRbMF0gKz0geFxuXHRcdEBfY3VycmVudFsxXSArPSB5XG5cdFx0QF9jdXJyZW50WzJdICs9IHpcblxuXHRcdEBcblxuXHRtb3ZlWDogKHgpIC0+XG5cblx0XHRAX2hhcy5tb3ZlbWVudCA9IHllc1xuXG5cdFx0QF9jdXJyZW50WzBdICs9IHhcblxuXHRcdEBcblxuXHRtb3ZlWTogKHkpIC0+XG5cblx0XHRAX2hhcy5tb3ZlbWVudCA9IHllc1xuXG5cdFx0QF9jdXJyZW50WzFdICs9IHlcblxuXHRcdEBcblxuXHRtb3ZlWjogKHopIC0+XG5cblx0XHRAX2hhcy5tb3ZlbWVudCA9IHllc1xuXG5cdFx0QF9jdXJyZW50WzJdICs9IHpcblxuXHRcdEBcblxuXHQjIyNcblx0U2NhbGVcblx0IyMjXG5cblx0cmVzZXRTY2FsZTogLT5cblxuXHRcdEBfaGFzLnNjYWxlID0gbm9cblxuXHRcdEBfY3VycmVudFszXSA9IDFcblx0XHRAX2N1cnJlbnRbNF0gPSAxXG5cdFx0QF9jdXJyZW50WzVdID0gMVxuXG5cdFx0QFxuXG5cdGdldFNjYWxlOiAtPlxuXG5cdFx0e1xuXHRcdFx0eDogQF9jdXJyZW50WzNdXG5cdFx0XHR5OiBAX2N1cnJlbnRbNF1cblx0XHRcdHo6IEBfY3VycmVudFs1XVxuXHRcdH1cblxuXHRzY2FsZVRvOiAoeCwgeSwgeikgLT5cblxuXHRcdEBfaGFzLnNjYWxlID0geWVzXG5cblx0XHRAX2N1cnJlbnRbM10gPSB4XG5cdFx0QF9jdXJyZW50WzRdID0geVxuXHRcdEBfY3VycmVudFs1XSA9IHpcblxuXHRcdEBcblxuXHRzY2FsZVhUbzogKHgpIC0+XG5cblx0XHRAX2hhcy5zY2FsZSA9IHllc1xuXG5cdFx0QF9jdXJyZW50WzNdID0geFxuXG5cdFx0QFxuXG5cdHNjYWxlWVRvOiAoeSkgLT5cblxuXHRcdEBfaGFzLnNjYWxlID0geWVzXG5cblx0XHRAX2N1cnJlbnRbNF0gPSB5XG5cblx0XHRAXG5cblx0c2NhbGVaVG86ICh6KSAtPlxuXG5cdFx0QF9oYXMuc2NhbGUgPSB5ZXNcblxuXHRcdEBfY3VycmVudFs1XSA9IHpcblxuXHRcdEBcblxuXHRzY2FsZTogKHgsIHksIHopIC0+XG5cblx0XHRAX2hhcy5zY2FsZSA9IHllc1xuXG5cdFx0QF9jdXJyZW50WzNdICo9IHhcblx0XHRAX2N1cnJlbnRbNF0gKj0geVxuXHRcdEBfY3VycmVudFs1XSAqPSB6XG5cblx0XHRAXG5cblx0c2NhbGVBbGxUbzogKHgpIC0+XG5cblx0XHRpZiB4IGlzIDFcblxuXHRcdFx0QF9oYXMuc2NhbGUgPSBub1xuXG5cdFx0ZWxzZVxuXG5cdFx0XHRAX2hhcy5zY2FsZSA9IHllc1xuXG5cdFx0QF9jdXJyZW50WzNdID0gQF9jdXJyZW50WzRdID0gQF9jdXJyZW50WzVdID0geFxuXG5cdFx0QFxuXG5cdHNjYWxlWDogKHgpIC0+XG5cblx0XHRAX2hhcy5zY2FsZSA9IHllc1xuXG5cdFx0QF9jdXJyZW50WzNdICo9IHhcblxuXHRcdEBcblxuXHRzY2FsZVk6ICh5KSAtPlxuXG5cdFx0QF9oYXMuc2NhbGUgPSB5ZXNcblxuXHRcdEBfY3VycmVudFs0XSAqPSB5XG5cblx0XHRAXG5cblx0c2NhbGVaOiAoeikgLT5cblxuXHRcdEBfaGFzLnNjYWxlID0geWVzXG5cblx0XHRAX2N1cnJlbnRbNV0gKj0gelxuXG5cdFx0QFxuXG5cdCMjI1xuXHRQZXJzcGVjdGl2ZVxuXHQjIyNcblxuXHRyZXNldFBlcnNwZWN0aXZlOiAtPlxuXG5cdFx0QF9jdXJyZW50WzZdID0gMFxuXG5cdFx0QF9oYXMucGVyc3BlY3RpdmUgPSBub1xuXG5cdFx0QFxuXG5cdHBlcnNwZWN0aXZlOiAoZCkgLT5cblxuXHRcdEBfY3VycmVudFs2XSA9IGRcblxuXHRcdGlmIGRcblxuXHRcdFx0QF9oYXMucGVyc3BlY3RpdmUgPSB5ZXNcblxuXHRcdEBcblxuXHQjIyNcblx0Um90YXRpb25cblx0IyMjXG5cblx0cmVzZXRSb3RhdGlvbjogLT5cblxuXHRcdEBfaGFzLnJvdGF0aW9uID0gbm9cblxuXHRcdEBfY3VycmVudFs3XSA9IDBcblx0XHRAX2N1cnJlbnRbOF0gPSAwXG5cdFx0QF9jdXJyZW50WzldID0gMFxuXG5cdFx0QFxuXG5cdHJvdGF0aW9uOiAtPlxuXG5cdFx0e1xuXHRcdFx0eDogQF9jdXJyZW50WzddXG5cdFx0XHR5OiBAX2N1cnJlbnRbOF1cblx0XHRcdHo6IEBfY3VycmVudFs5XVxuXHRcdH1cblxuXHRyb3RhdGVUbzogKHgsIHksIHopIC0+XG5cblx0XHRAX2hhcy5yb3RhdGlvbiA9IHllc1xuXG5cdFx0QF9jdXJyZW50WzddID0geFxuXHRcdEBfY3VycmVudFs4XSA9IHlcblx0XHRAX2N1cnJlbnRbOV0gPSB6XG5cblx0XHRAXG5cblx0cm90YXRlWFRvOiAoeCkgLT5cblxuXHRcdEBfaGFzLnJvdGF0aW9uID0geWVzXG5cblx0XHRAX2N1cnJlbnRbN10gPSB4XG5cblx0XHRAXG5cblx0cm90YXRlWVRvOiAoeSkgLT5cblxuXHRcdEBfaGFzLnJvdGF0aW9uID0geWVzXG5cblx0XHRAX2N1cnJlbnRbOF0gPSB5XG5cblx0XHRAXG5cblx0cm90YXRlWlRvOiAoeikgLT5cblxuXHRcdEBfaGFzLnJvdGF0aW9uID0geWVzXG5cblx0XHRAX2N1cnJlbnRbOV0gPSB6XG5cblx0XHRAXG5cblx0cm90YXRlOiAoeCwgeSwgeikgLT5cblxuXHRcdEBfaGFzLnJvdGF0aW9uID0geWVzXG5cblx0XHRAX2N1cnJlbnRbN10gKz0geFxuXHRcdEBfY3VycmVudFs4XSArPSB5XG5cdFx0QF9jdXJyZW50WzldICs9IHpcblxuXHRcdEBcblxuXHRyb3RhdGVYOiAoeCkgLT5cblxuXHRcdEBfaGFzLnJvdGF0aW9uID0geWVzXG5cblx0XHRAX2N1cnJlbnRbN10gKz0geFxuXG5cdFx0QFxuXG5cdHJvdGF0ZVk6ICh5KSAtPlxuXG5cdFx0QF9oYXMucm90YXRpb24gPSB5ZXNcblxuXHRcdEBfY3VycmVudFs4XSArPSB5XG5cblx0XHRAXG5cblx0cm90YXRlWjogKHopIC0+XG5cblx0XHRAX2hhcy5yb3RhdGlvbiA9IHllc1xuXG5cdFx0QF9jdXJyZW50WzldICs9IHpcblxuXHRcdEBcblxuXHQjIyNcblx0TG9jYWwgTW92ZW1lbnRcblx0IyMjXG5cblx0cmVzZXRMb2NhbE1vdmVtZW50OiAtPlxuXG5cdFx0QF9oYXMubG9jYWxNb3ZlbWVudCA9IG5vXG5cblx0XHRAX2N1cnJlbnRbMTBdID0gMFxuXHRcdEBfY3VycmVudFsxMV0gPSAwXG5cdFx0QF9jdXJyZW50WzEyXSA9IDBcblxuXHRcdEBcblxuXHRsb2NhbE1vdmVtZW50OiAtPlxuXG5cdFx0e1xuXHRcdFx0eDogQF9jdXJyZW50WzEwXVxuXHRcdFx0eTogQF9jdXJyZW50WzExXVxuXHRcdFx0ejogQF9jdXJyZW50WzEyXVxuXHRcdH1cblxuXHRsb2NhbE1vdmVUbzogKHgsIHksIHopIC0+XG5cblx0XHRAX2hhcy5sb2NhbE1vdmVtZW50ID0geWVzXG5cblx0XHRAX2N1cnJlbnRbMTBdID0geFxuXHRcdEBfY3VycmVudFsxMV0gPSB5XG5cdFx0QF9jdXJyZW50WzEyXSA9IHpcblxuXHRcdEBcblxuXHRsb2NhbE1vdmVYVG86ICh4KSAtPlxuXG5cdFx0QF9oYXMubG9jYWxNb3ZlbWVudCA9IHllc1xuXG5cdFx0QF9jdXJyZW50WzEwXSA9IHhcblxuXHRcdEBcblxuXHRsb2NhbE1vdmVZVG86ICh5KSAtPlxuXG5cdFx0QF9oYXMubG9jYWxNb3ZlbWVudCA9IHllc1xuXG5cdFx0QF9jdXJyZW50WzExXSA9IHlcblxuXHRcdEBcblxuXHRsb2NhbE1vdmVaVG86ICh6KSAtPlxuXG5cdFx0QF9oYXMubG9jYWxNb3ZlbWVudCA9IHllc1xuXG5cdFx0QF9jdXJyZW50WzEyXSA9IHpcblxuXHRcdEBcblxuXHRsb2NhbE1vdmU6ICh4LCB5LCB6KSAtPlxuXG5cdFx0QF9oYXMubG9jYWxNb3ZlbWVudCA9IHllc1xuXG5cdFx0QF9jdXJyZW50WzEwXSArPSB4XG5cdFx0QF9jdXJyZW50WzExXSArPSB5XG5cdFx0QF9jdXJyZW50WzEyXSArPSB6XG5cblx0XHRAXG5cblx0bG9jYWxNb3ZlWDogKHgpIC0+XG5cblx0XHRAX2hhcy5sb2NhbE1vdmVtZW50ID0geWVzXG5cblx0XHRAX2N1cnJlbnRbMTBdICs9IHhcblxuXHRcdEBcblxuXHRsb2NhbE1vdmVZOiAoeSkgLT5cblxuXHRcdEBfaGFzLmxvY2FsTW92ZW1lbnQgPSB5ZXNcblxuXHRcdEBfY3VycmVudFsxMV0gKz0geVxuXG5cdFx0QFxuXG5cdGxvY2FsTW92ZVo6ICh6KSAtPlxuXG5cdFx0QF9oYXMubG9jYWxNb3ZlbWVudCA9IHllc1xuXG5cdFx0QF9jdXJyZW50WzEyXSArPSB6XG5cblx0XHRAXG5cblx0IyMjXG5cdExvY2FsIFJvdGF0aW9uXG5cdCMjI1xuXG5cdHJlc2V0TG9jYWxSb3RhdGlvbjogLT5cblxuXHRcdEBfaGFzLmxvY2FsUm90YXRpb24gPSBub1xuXG5cdFx0QF9jdXJyZW50WzEzXSA9IDBcblx0XHRAX2N1cnJlbnRbMTRdID0gMFxuXHRcdEBfY3VycmVudFsxNV0gPSAwXG5cblx0XHRAXG5cblx0bG9jYWxSb3RhdGlvbjogLT5cblxuXHRcdHtcblx0XHRcdHg6IEBfY3VycmVudFsxM11cblx0XHRcdHk6IEBfY3VycmVudFsxNF1cblx0XHRcdHo6IEBfY3VycmVudFsxNV1cblx0XHR9XG5cblx0bG9jYWxSb3RhdGVUbzogKHgsIHksIHopIC0+XG5cblx0XHRAX2hhcy5sb2NhbFJvdGF0aW9uID0geWVzXG5cblx0XHRAX2N1cnJlbnRbMTNdID0geFxuXHRcdEBfY3VycmVudFsxNF0gPSB5XG5cdFx0QF9jdXJyZW50WzE1XSA9IHpcblxuXHRcdEBcblxuXHRsb2NhbFJvdGF0ZVhUbzogKHgpIC0+XG5cblx0XHRAX2hhcy5sb2NhbFJvdGF0aW9uID0geWVzXG5cblx0XHRAX2N1cnJlbnRbMTNdID0geFxuXG5cdFx0QFxuXG5cdGxvY2FsUm90YXRlWVRvOiAoeSkgLT5cblxuXHRcdEBfaGFzLmxvY2FsUm90YXRpb24gPSB5ZXNcblxuXHRcdEBfY3VycmVudFsxNF0gPSB5XG5cblx0XHRAXG5cblx0bG9jYWxSb3RhdGVaVG86ICh6KSAtPlxuXG5cdFx0QF9oYXMubG9jYWxSb3RhdGlvbiA9IHllc1xuXG5cdFx0QF9jdXJyZW50WzE1XSA9IHpcblxuXHRcdEBcblxuXHRsb2NhbFJvdGF0ZTogKHgsIHksIHopIC0+XG5cblx0XHRAX2hhcy5sb2NhbFJvdGF0aW9uID0geWVzXG5cblx0XHRAX2N1cnJlbnRbMTNdICs9IHhcblx0XHRAX2N1cnJlbnRbMTRdICs9IHlcblx0XHRAX2N1cnJlbnRbMTVdICs9IHpcblxuXHRcdEBcblxuXHRsb2NhbFJvdGF0ZVg6ICh4KSAtPlxuXG5cdFx0QF9oYXMubG9jYWxSb3RhdGlvbiA9IHllc1xuXG5cdFx0QF9jdXJyZW50WzEzXSArPSB4XG5cblx0XHRAXG5cblx0bG9jYWxSb3RhdGVZOiAoeSkgLT5cblxuXHRcdEBfaGFzLmxvY2FsUm90YXRpb24gPSB5ZXNcblxuXHRcdEBfY3VycmVudFsxNF0gKz0geVxuXG5cdFx0QFxuXG5cdGxvY2FsUm90YXRlWjogKHopIC0+XG5cblx0XHRAX2hhcy5sb2NhbFJvdGF0aW9uID0geWVzXG5cblx0XHRAX2N1cnJlbnRbMTVdICs9IHpcblxuXHRcdEBcblxuXHRyZXNldEFsbDogLT5cblxuXHRcdGRvIEByZXNldE1vdmVtZW50XG5cdFx0ZG8gQHJlc2V0U2NhbGVcblx0XHRkbyBAcmVzZXRQZXJzcGVjdGl2ZVxuXHRcdGRvIEByZXNldFJvdGF0aW9uXG5cdFx0ZG8gQHJlc2V0TG9jYWxNb3ZlbWVudFxuXHRcdGRvIEByZXNldExvY2FsUm90YXRpb24iXX0=
},{"./transformation/perspective":2,"./transformation/rotation":3,"./transformation/scale":4,"./transformation/translation":5}],2:[function(require,module,exports){
var perspective;

module.exports = perspective = {
  toPlainCss: function(d) {
    return "perspective(" + d + ") ";
  }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyc3BlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLiIsInNvdXJjZXMiOlsiY29mZmVlXFxsaWJcXHRyYW5zZm9ybWF0aW9uXFxwZXJzcGVjdGl2ZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxPQUFBOztBQUFBLENBQUEsRUFBaUIsR0FBWCxDQUFOLElBQWlCO0NBRWhCLENBQUEsQ0FBWSxNQUFDLENBQWI7Q0FFRSxFQUFhLFFBQWIsR0FBQTtDQUZGLEVBQVk7Q0FGYixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBwZXJzcGVjdGl2ZSA9XG5cblx0dG9QbGFpbkNzczogKGQpIC0+XG5cblx0XHRcInBlcnNwZWN0aXZlKCN7ZH0pIFwiIl19
},{}],3:[function(require,module,exports){
var rotation;

module.exports = rotation = {
  toPlainCss: function(x, y, z) {
    if ((-0.00001 < x && x < 0.00001)) {
      x = 0;
    }
    if ((-0.00001 < y && y < 0.00001)) {
      y = 0;
    }
    if ((-0.00001 < z && z < 0.00001)) {
      z = 0;
    }
    return "rotateX(" + x + "rad) rotateY(" + y + "rad) rotateZ(" + z + "rad) ";
  }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm90YXRpb24uanMiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLiIsInNvdXJjZXMiOlsiY29mZmVlXFxsaWJcXHRyYW5zZm9ybWF0aW9uXFxyb3RhdGlvbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxJQUFBOztBQUFBLENBQUEsRUFBaUIsR0FBWCxDQUFOLENBQWlCO0NBRWhCLENBQUEsQ0FBWSxNQUFDLENBQWI7QUFFSyxDQUFKLEVBQWMsQ0FBZCxHQUFHO0NBRUYsRUFBSSxHQUFKO01BRkQ7QUFLSSxDQUFKLEVBQWMsQ0FBZCxHQUFHO0NBRUYsRUFBSSxHQUFKO01BUEQ7QUFVSSxDQUFKLEVBQWMsQ0FBZCxHQUFHO0NBRUYsRUFBSSxHQUFKO01BWkQ7Q0FjQyxFQUFTLE9BQVQsQ0FBQSxJQUFBO0NBaEJGLEVBQVk7Q0FGYixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByb3RhdGlvbiA9XG5cblx0dG9QbGFpbkNzczogKHgsIHksIHopIC0+XG5cblx0XHRpZiAtMC4wMDAwMSA8IHggPCAwLjAwMDAxXG5cblx0XHRcdHggPSAwXG5cblxuXHRcdGlmIC0wLjAwMDAxIDwgeSA8IDAuMDAwMDFcblxuXHRcdFx0eSA9IDBcblxuXG5cdFx0aWYgLTAuMDAwMDEgPCB6IDwgMC4wMDAwMVxuXG5cdFx0XHR6ID0gMFxuXG5cdFx0XCJyb3RhdGVYKCN7eH1yYWQpIHJvdGF0ZVkoI3t5fXJhZCkgcm90YXRlWigje3p9cmFkKSBcIlxuIl19
},{}],4:[function(require,module,exports){
var scale;

module.exports = scale = {
  toPlainCss: function(x, y, z) {
    if ((-0.00001 < x && x < 0.00001)) {
      x = 0;
    }
    if ((-0.00001 < y && y < 0.00001)) {
      y = 0;
    }
    if ((-0.00001 < z && z < 0.00001)) {
      z = 0;
    }
    return "scale3d(" + x + ", " + y + ", " + z + ") ";
  }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGUuanMiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLiIsInNvdXJjZXMiOlsiY29mZmVlXFxsaWJcXHRyYW5zZm9ybWF0aW9uXFxzY2FsZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxDQUFBOztBQUFBLENBQUEsRUFBaUIsRUFBQSxDQUFYLENBQU47Q0FFQyxDQUFBLENBQVksTUFBQyxDQUFiO0FBRUssQ0FBSixFQUFjLENBQWQsR0FBRztDQUVGLEVBQUksR0FBSjtNQUZEO0FBS0ksQ0FBSixFQUFjLENBQWQsR0FBRztDQUVGLEVBQUksR0FBSjtNQVBEO0FBVUksQ0FBSixFQUFjLENBQWQsR0FBRztDQUVGLEVBQUksR0FBSjtNQVpEO0NBY0MsRUFBUyxDQUFULE1BQUEsQ0FBQTtDQWhCRixFQUFZO0NBRmIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gc2NhbGUgPVxuXG5cdHRvUGxhaW5Dc3M6ICh4LCB5LCB6KSAtPlxuXG5cdFx0aWYgLTAuMDAwMDEgPCB4IDwgMC4wMDAwMVxuXG5cdFx0XHR4ID0gMFxuXG5cblx0XHRpZiAtMC4wMDAwMSA8IHkgPCAwLjAwMDAxXG5cblx0XHRcdHkgPSAwXG5cblxuXHRcdGlmIC0wLjAwMDAxIDwgeiA8IDAuMDAwMDFcblxuXHRcdFx0eiA9IDBcblxuXHRcdFwic2NhbGUzZCgje3h9LCAje3l9LCAje3p9KSBcIiJdfQ==
},{}],5:[function(require,module,exports){
var translation;

module.exports = translation = {
  toPlainCss: function(x, y, z) {
    if ((-0.00001 < x && x < 0.00001)) {
      x = 0;
    }
    if ((-0.00001 < y && y < 0.00001)) {
      y = 0;
    }
    if ((-0.00001 < z && z < 0.00001)) {
      z = 0;
    }
    return "translate3d(" + x + "px, " + y + "px, " + z + "px) ";
  }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRpb24uanMiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLiIsInNvdXJjZXMiOlsiY29mZmVlXFxsaWJcXHRyYW5zZm9ybWF0aW9uXFx0cmFuc2xhdGlvbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxPQUFBOztBQUFBLENBQUEsRUFBaUIsR0FBWCxDQUFOLElBQWlCO0NBRWhCLENBQUEsQ0FBWSxNQUFDLENBQWI7QUFFSyxDQUFKLEVBQWMsQ0FBZCxHQUFHO0NBRUYsRUFBSSxHQUFKO01BRkQ7QUFLSSxDQUFKLEVBQWMsQ0FBZCxHQUFHO0NBRUYsRUFBSSxHQUFKO01BUEQ7QUFVSSxDQUFKLEVBQWMsQ0FBZCxHQUFHO0NBRUYsRUFBSSxHQUFKO01BWkQ7Q0FjQyxFQUFhLEdBQWIsS0FBQSxHQUFBO0NBaEJGLEVBQVk7Q0FGYixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSB0cmFuc2xhdGlvbiA9XG5cblx0dG9QbGFpbkNzczogKHgsIHksIHopIC0+XG5cblx0XHRpZiAtMC4wMDAwMSA8IHggPCAwLjAwMDAxXG5cblx0XHRcdHggPSAwXG5cblxuXHRcdGlmIC0wLjAwMDAxIDwgeSA8IDAuMDAwMDFcblxuXHRcdFx0eSA9IDBcblxuXG5cdFx0aWYgLTAuMDAwMDEgPCB6IDwgMC4wMDAwMVxuXG5cdFx0XHR6ID0gMFxuXG5cdFx0XCJ0cmFuc2xhdGUzZCgje3h9cHgsICN7eX1weCwgI3t6fXB4KSBcIiJdfQ==
},{}],6:[function(require,module,exports){
var MethodChain, _Interface,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

_Interface = require('./_Interface');

module.exports = MethodChain = (function() {
  function MethodChain() {
    var I, _ref;
    this._methods = {};
    this._Interface = I = (function(_super) {
      __extends(I, _super);

      function I() {
        _ref = I.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      return I;

    })(_Interface);
  }

  MethodChain.prototype.addMethod = function(name) {
    this._Interface.prototype[name] = function() {
      this._queue.push({
        method: name,
        args: Array.prototype.slice.call(arguments)
      });
      return this;
    };
    return this;
  };

  MethodChain.prototype.getInterface = function() {
    return new this._Interface;
  };

  MethodChain.prototype.run = function(_interface, context, transform) {
    var args, item, _i, _len, _ref;
    if (transform == null) {
      transform = null;
    }
    _ref = _interface._queue;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      if (transform != null) {
        args = transform(item.args);
      } else {
        args = args;
      }
      context = context[item.method].apply(context, args);
    }
    return context;
  };

  return MethodChain;

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWV0aG9kQ2hhaW4uanMiLCJzb3VyY2VSb290IjoiLi5cXC4uIiwic291cmNlcyI6WyJjb2ZmZWVcXGxpYlxcTWV0aG9kQ2hhaW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsbUJBQUE7R0FBQTtrU0FBQTs7QUFBQSxDQUFBLEVBQWEsSUFBQSxHQUFiLElBQWE7O0FBRWIsQ0FGQSxFQUV1QixHQUFqQixDQUFOO0NBRWMsQ0FBQSxDQUFBLGtCQUFBO0NBRVosTUFBQSxDQUFBO0NBQUEsQ0FBQSxDQUFZLENBQVosSUFBQTtDQUFBLEVBRW9CLENBQXBCLE1BQUE7Q0FBYzs7Ozs7Q0FBQTs7Q0FBQTs7Q0FBZ0I7Q0FKL0IsRUFBYTs7Q0FBYixFQU1XLENBQUEsS0FBWDtDQUVDLEVBQXNCLENBQXRCLEtBQWMsQ0FBSDtDQUVWLEdBQUMsRUFBRDtDQUVDLENBQVEsRUFBUixFQUFBLEVBQUE7Q0FBQSxDQUVNLEVBQU4sQ0FBVyxHQUFYLENBQWE7Q0FKZCxPQUFBO0NBRnFCLFlBUXJCO0NBUkQsSUFBc0I7Q0FGWixVQVlWO0NBbEJELEVBTVc7O0NBTlgsRUFvQmMsTUFBQSxHQUFkO0FBRUMsQ0FBQSxFQUFBLENBQUssT0FBTDtDQXRCRCxFQW9CYzs7Q0FwQmQsQ0F3QmtCLENBQWxCLElBQUssRUFBQyxDQUFEO0NBRUosT0FBQSxrQkFBQTs7R0FGc0MsR0FBWjtNQUUxQjtDQUFBO0NBQUEsUUFBQSxrQ0FBQTt1QkFBQTtDQUVDLEdBQUcsRUFBSCxXQUFBO0NBRUMsRUFBTyxDQUFQLElBQUEsQ0FBTztNQUZSLEVBQUE7Q0FNQyxFQUFPLENBQVAsSUFBQTtRQU5EO0NBQUEsQ0FROEMsQ0FBcEMsQ0FBWSxDQUFaLENBQVYsQ0FBQTtDQVZELElBQUE7Q0FGSSxVQWNKO0NBdENELEVBd0JLOztDQXhCTDs7Q0FKRCIsInNvdXJjZXNDb250ZW50IjpbIl9JbnRlcmZhY2UgPSByZXF1aXJlICcuL19JbnRlcmZhY2UnXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgTWV0aG9kQ2hhaW5cblxuXHRjb25zdHJ1Y3RvcjogLT5cblxuXHRcdEBfbWV0aG9kcyA9IHt9XG5cblx0XHRAX0ludGVyZmFjZSA9IGNsYXNzIEkgZXh0ZW5kcyBfSW50ZXJmYWNlXG5cblx0YWRkTWV0aG9kOiAobmFtZSkgLT5cblxuXHRcdEBfSW50ZXJmYWNlOjpbbmFtZV0gPSAtPlxuXG5cdFx0XHRAX3F1ZXVlLnB1c2hcblxuXHRcdFx0XHRtZXRob2Q6IG5hbWVcblxuXHRcdFx0XHRhcmdzOiBBcnJheTo6c2xpY2UuY2FsbCBhcmd1bWVudHNcblxuXHRcdFx0QFxuXG5cdFx0QFxuXG5cdGdldEludGVyZmFjZTogLT5cblxuXHRcdG5ldyBAX0ludGVyZmFjZVxuXG5cdHJ1bjogKF9pbnRlcmZhY2UsIGNvbnRleHQsIHRyYW5zZm9ybSA9IG51bGwpIC0+XG5cblx0XHRmb3IgaXRlbSBpbiBfaW50ZXJmYWNlLl9xdWV1ZVxuXG5cdFx0XHRpZiB0cmFuc2Zvcm0/XG5cblx0XHRcdFx0YXJncyA9IHRyYW5zZm9ybSBpdGVtLmFyZ3NcblxuXHRcdFx0ZWxzZVxuXG5cdFx0XHRcdGFyZ3MgPSBhcmdzXG5cblx0XHRcdGNvbnRleHQgPSBjb250ZXh0W2l0ZW0ubWV0aG9kXS5hcHBseSBjb250ZXh0LCBhcmdzXG5cblx0XHRjb250ZXh0Il19
},{"./_Interface":7}],7:[function(require,module,exports){
var _Interface;

module.exports = _Interface = (function() {
  function _Interface() {
    this._queue = [];
  }

  return _Interface;

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX0ludGVyZmFjZS5qcyIsInNvdXJjZVJvb3QiOiIuLlxcLi4iLCJzb3VyY2VzIjpbImNvZmZlZVxcbGliXFxfSW50ZXJmYWNlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLE1BQUE7O0FBQUEsQ0FBQSxFQUF1QixHQUFqQixDQUFOO0NBRWMsQ0FBQSxDQUFBLGlCQUFBO0NBRVosQ0FBQSxDQUFVLENBQVYsRUFBQTtDQUZELEVBQWE7O0NBQWI7O0NBRkQiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIF9JbnRlcmZhY2VcblxuXHRjb25zdHJ1Y3RvcjogLT5cblxuXHRcdEBfcXVldWUgPSBbXSJdfQ==
},{}],8:[function(require,module,exports){
var Priority, array;

array = require('utila').array;

module.exports = Priority = (function() {
  function Priority() {
    this._singles = [];
    this._series = [];
    this._toCancelFromEachTick = [];
  }

  Priority.prototype.onNextTick = function(fn) {
    this._singles.push(fn);
  };

  Priority.prototype.cancelNextTick = function(fn) {
    array.pluckOneItem(this._singles, fn);
  };

  Priority.prototype._callSingles = function(t) {
    var fn, toCallNow, _i, _len;
    if (this._singles.length < 1) {
      return;
    }
    toCallNow = this._singles;
    this._singles = [];
    for (_i = 0, _len = toCallNow.length; _i < _len; _i++) {
      fn = toCallNow[_i];
      fn(t);
    }
  };

  Priority.prototype.onEachTick = function(fn) {
    this._series.push(fn);
  };

  Priority.prototype.cancelEachTick = function(fn) {
    this._toCancelFromEachTick.push(fn);
  };

  Priority.prototype._callSeries = function(t) {
    var fn, toCancel, _i, _j, _len, _len1, _ref, _ref1;
    if (this._series.length < 1) {
      return;
    }
    _ref = this._toCancelFromEachTick;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      toCancel = _ref[_i];
      array.pluckOneItem(this._series, toCancel);
    }
    this._toCancelFromEachTick.length = 0;
    _ref1 = this._series;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      fn = _ref1[_j];
      fn(t);
    }
  };

  Priority.prototype.tick = function(t) {
    this._callSingles(t);
    this._callSeries(t);
  };

  return Priority;

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJpb3JpdHkuanMiLCJzb3VyY2VSb290IjoiLi5cXC4uIiwic291cmNlcyI6WyJjb2ZmZWVcXGxpYlxcUHJpb3JpdHkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsV0FBQTs7QUFBQyxDQUFELEVBQVUsRUFBVixFQUFVOztBQUVWLENBRkEsRUFFdUIsR0FBakIsQ0FBTjtDQUVjLENBQUEsQ0FBQSxlQUFBO0NBRVosQ0FBQSxDQUFZLENBQVosSUFBQTtDQUFBLENBQUEsQ0FFVyxDQUFYLEdBQUE7Q0FGQSxDQUFBLENBSXlCLENBQXpCLGlCQUFBO0NBTkQsRUFBYTs7Q0FBYixDQVFZLENBQUEsTUFBQyxDQUFiO0NBRUMsQ0FBQSxFQUFBLElBQVM7Q0FWVixFQVFZOztDQVJaLENBY2dCLENBQUEsTUFBQyxLQUFqQjtDQUVDLENBQThCLEVBQTlCLENBQUssR0FBTCxJQUFBO0NBaEJELEVBY2dCOztDQWRoQixFQW9CYyxNQUFDLEdBQWY7Q0FFQyxPQUFBLGVBQUE7Q0FBQSxFQUE2QixDQUE3QixFQUFVLEVBQVM7Q0FBbkIsV0FBQTtNQUFBO0NBQUEsRUFFWSxDQUFaLElBRkEsQ0FFQTtDQUZBLENBQUEsQ0FJWSxDQUFaLElBQUE7QUFFQSxDQUFBLFFBQUEsdUNBQUE7MEJBQUE7Q0FFQyxDQUFBLElBQUE7Q0FGRCxJQVJhO0NBcEJkLEVBb0JjOztDQXBCZCxDQWtDWSxDQUFBLE1BQUMsQ0FBYjtDQUVDLENBQUEsRUFBQSxHQUFRO0NBcENULEVBa0NZOztDQWxDWixDQXdDZ0IsQ0FBQSxNQUFDLEtBQWpCO0NBRUMsQ0FBQSxFQUFBLGlCQUFzQjtDQTFDdkIsRUF3Q2dCOztDQXhDaEIsRUE4Q2EsTUFBQyxFQUFkO0NBRUMsT0FBQSxzQ0FBQTtDQUFBLEVBQTRCLENBQTVCLEVBQVUsQ0FBUTtDQUFsQixXQUFBO01BQUE7Q0FFQTtDQUFBLFFBQUEsa0NBQUE7MkJBQUE7Q0FFQyxDQUE2QixFQUFULENBQWYsQ0FBTCxDQUFBLENBQUEsSUFBQTtDQUZELElBRkE7Q0FBQSxFQU1nQyxDQUFoQyxFQUFBLGVBQXNCO0NBRXRCO0NBQUEsUUFBQSxxQ0FBQTtzQkFBQTtDQUVDLENBQUEsSUFBQTtDQUZELElBVlk7Q0E5Q2IsRUE4Q2E7O0NBOUNiLEVBOERNLENBQU4sS0FBTztDQUVOLEdBQUEsUUFBQTtDQUFBLEdBRUEsT0FBQTtDQWxFRCxFQThETTs7Q0E5RE47O0NBSkQiLCJzb3VyY2VzQ29udGVudCI6WyJ7YXJyYXl9ID0gcmVxdWlyZSAndXRpbGEnXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFByaW9yaXR5XHJcblxyXG5cdGNvbnN0cnVjdG9yOiAtPlxyXG5cclxuXHRcdEBfc2luZ2xlcyA9IFtdXHJcblxyXG5cdFx0QF9zZXJpZXMgPSBbXVxyXG5cclxuXHRcdEBfdG9DYW5jZWxGcm9tRWFjaFRpY2sgPSBbXVxyXG5cclxuXHRvbk5leHRUaWNrOiAoZm4pIC0+XHJcblxyXG5cdFx0QF9zaW5nbGVzLnB1c2ggZm5cclxuXHJcblx0XHRyZXR1cm5cclxuXHJcblx0Y2FuY2VsTmV4dFRpY2s6IChmbikgLT5cclxuXHJcblx0XHRhcnJheS5wbHVja09uZUl0ZW0gQF9zaW5nbGVzLCBmblxyXG5cclxuXHRcdHJldHVyblxyXG5cclxuXHRfY2FsbFNpbmdsZXM6ICh0KSAtPlxyXG5cclxuXHRcdHJldHVybiBpZiBAX3NpbmdsZXMubGVuZ3RoIDwgMVxyXG5cclxuXHRcdHRvQ2FsbE5vdyA9IEBfc2luZ2xlc1xyXG5cclxuXHRcdEBfc2luZ2xlcyA9IFtdXHJcblxyXG5cdFx0Zm9yIGZuIGluIHRvQ2FsbE5vd1xyXG5cclxuXHRcdFx0Zm4gdFxyXG5cclxuXHRcdHJldHVyblxyXG5cclxuXHRvbkVhY2hUaWNrOiAoZm4pIC0+XHJcblxyXG5cdFx0QF9zZXJpZXMucHVzaCBmblxyXG5cclxuXHRcdHJldHVyblxyXG5cclxuXHRjYW5jZWxFYWNoVGljazogKGZuKSAtPlxyXG5cclxuXHRcdEBfdG9DYW5jZWxGcm9tRWFjaFRpY2sucHVzaCBmblxyXG5cclxuXHRcdHJldHVyblxyXG5cclxuXHRfY2FsbFNlcmllczogKHQpIC0+XHJcblxyXG5cdFx0cmV0dXJuIGlmIEBfc2VyaWVzLmxlbmd0aCA8IDFcclxuXHJcblx0XHRmb3IgdG9DYW5jZWwgaW4gQF90b0NhbmNlbEZyb21FYWNoVGlja1xyXG5cclxuXHRcdFx0YXJyYXkucGx1Y2tPbmVJdGVtIEBfc2VyaWVzLCB0b0NhbmNlbFxyXG5cclxuXHRcdEBfdG9DYW5jZWxGcm9tRWFjaFRpY2subGVuZ3RoID0gMFxyXG5cclxuXHRcdGZvciBmbiBpbiBAX3Nlcmllc1xyXG5cclxuXHRcdFx0Zm4gdFxyXG5cclxuXHRcdHJldHVyblxyXG5cclxuXHR0aWNrOiAodCkgLT5cclxuXHJcblx0XHRAX2NhbGxTaW5nbGVzIHRcclxuXHJcblx0XHRAX2NhbGxTZXJpZXMgdFxyXG5cclxuXHRcdHJldHVybiJdfQ==
},{"utila":24}],9:[function(require,module,exports){
var Priority, Timing, Waiter, cancelAnimationFrame, nextTick, requestAnimationFrame, _ref;

Waiter = require('./Waiter');

nextTick = require('./nextTick');

Priority = require('./Priority');

_ref = require('./raf'), requestAnimationFrame = _ref.requestAnimationFrame, cancelAnimationFrame = _ref.cancelAnimationFrame;

module.exports = Timing = (function() {
  var self;

  self = Timing;

  function Timing() {
    var _this = this;
    this.nanoTime = 0;
    this.time = 0;
    this.speed = 1;
    this.tickNumber;
    this._rafId = 0;
    this._waiter = new Waiter;
    this._boundLoop = function(t) {
      _this._loop(t);
    };
    this._started = false;
    this._before = new Priority;
    this._on = new Priority;
    this._after = new Priority;
  }

  Timing.prototype.nextTick = function(fn) {
    nextTick(fn);
  };

  Timing.prototype.wait = function(ms, fn) {
    var callTime;
    callTime = this.time + ms + 8;
    this._waiter.setTimeout(callTime, fn);
  };

  Timing.prototype.every = function(ms, fn) {
    this._waiter.setInterval(ms, fn, this.time);
  };

  Timing.prototype.cancelEvery = function(fn) {
    this._waiter.cancelInterval(fn);
  };

  Timing.prototype.beforeNextFrame = function(fn) {
    this._before.onNextTick(fn);
  };

  Timing.prototype.cancelBeforeNextFrame = function(fn) {
    this._before.cancelNextTick(fn);
  };

  Timing.prototype.beforeEachFrame = function(fn) {
    this._before.onEachTick(fn);
  };

  Timing.prototype.cancelBeforeEachFrame = function(fn) {
    this._before.cancelEachTick(fn);
  };

  Timing.prototype.onNextFrame = function(fn) {
    this._on.onNextTick(fn);
  };

  Timing.prototype.cancelOnNextFrame = function(fn) {
    this._on.cancelNextTick(fn);
  };

  Timing.prototype.onEachFrame = function(fn) {
    this._on.onEachTick(fn);
  };

  Timing.prototype.cancelOnEachFrame = function(fn) {
    this._on.cancelEachTick(fn);
  };

  Timing.prototype.afterNextFrame = function(fn) {
    this._after.onNextTick(fn);
  };

  Timing.prototype.cancelAfterNextFrame = function(fn) {
    this._after.cancelNextTick(fn);
  };

  Timing.prototype.afterEachFrame = function(fn) {
    this._after.onEachTick(fn);
  };

  Timing.prototype.cancelAfterEachFrame = function(fn) {
    this._after.cancelEachTick(fn);
  };

  Timing.prototype._loop = function(t) {
    this._rafId = requestAnimationFrame(this._boundLoop);
    this.tick(t);
  };

  Timing.prototype.tick = function(t) {
    this.tickNumber++;
    t = t * this.speed;
    this.nanoTime = t;
    t = parseInt(t);
    this.time = t;
    this._waiter.tick(t);
    this._before.tick(t);
    this._on.tick(t);
    this._after.tick(t);
  };

  Timing.prototype.start = function() {
    if (this._started) {
      return;
    }
    this._rafId = requestAnimationFrame(this._boundLoop);
  };

  Timing.prototype.stop = function() {
    if (!this._started) {
      return;
    }
    cancelAnimationFrame(this._rafId);
  };

  return Timing;

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGltaW5nLmpzIiwic291cmNlUm9vdCI6Ii4uXFwuLiIsInNvdXJjZXMiOlsiY29mZmVlXFxsaWJcXFRpbWluZy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxpRkFBQTs7QUFBQSxDQUFBLEVBQVMsR0FBVCxDQUFTLEdBQUE7O0FBQ1QsQ0FEQSxFQUNXLElBQUEsQ0FBWCxJQUFXOztBQUNYLENBRkEsRUFFVyxJQUFBLENBQVgsSUFBVzs7QUFDWCxDQUhBLENBR0MsS0FBK0MsYUFIaEQsQ0FHQTs7QUFFQSxDQUxBLEVBS3VCLEdBQWpCLENBQU47Q0FFQyxHQUFBLEVBQUE7O0NBQUEsQ0FBQSxDQUFPLENBQVAsRUFBQTs7Q0FFYSxDQUFBLENBQUEsYUFBQTtDQUVaLE9BQUEsSUFBQTtDQUFBLEVBQVksQ0FBWixJQUFBO0NBQUEsRUFFUSxDQUFSO0NBRkEsRUFJUyxDQUFULENBQUE7Q0FKQSxHQU1BLE1BTkE7Q0FBQSxFQVFVLENBQVYsRUFBQTtBQUVXLENBVlgsRUFVVyxDQUFYLEVBVkEsQ0FVQTtDQVZBLEVBWWMsQ0FBZCxLQUFlLENBQWY7Q0FFQyxJQUFDLENBQUQ7Q0FkRCxJQVljO0NBWmQsRUFrQlksQ0FBWixDQWxCQSxHQWtCQTtBQUdXLENBckJYLEVBcUJXLENBQVgsR0FBQSxDQXJCQTtBQXVCTyxDQXZCUCxFQXVCQSxDQUFBLElBdkJBO0FBeUJVLENBekJWLEVBeUJVLENBQVYsRUFBQSxFQXpCQTtDQUpELEVBRWE7O0NBRmIsQ0ErQlUsQ0FBQSxLQUFWLENBQVc7Q0FFVixDQUFBLEVBQUEsSUFBQTtDQWpDRCxFQStCVTs7Q0EvQlYsQ0FxQ00sQ0FBQSxDQUFOLEtBQU87Q0FFTixPQUFBO0NBQUEsQ0FBVyxDQUFBLENBQVgsSUFBQTtDQUFBLENBRThCLEVBQTlCLEdBQVEsQ0FBUixFQUFBO0NBekNELEVBcUNNOztDQXJDTixDQTZDTyxDQUFBLEVBQVAsSUFBUTtDQUVQLENBQUEsRUFBQSxHQUFRLElBQVI7Q0EvQ0QsRUE2Q087O0NBN0NQLENBbURhLENBQUEsTUFBQyxFQUFkO0NBRUMsQ0FBQSxFQUFBLEdBQVEsT0FBUjtDQXJERCxFQW1EYTs7Q0FuRGIsQ0F5RGlCLENBQUEsTUFBQyxNQUFsQjtDQUVDLENBQUEsRUFBQSxHQUFRLEdBQVI7Q0EzREQsRUF5RGlCOztDQXpEakIsQ0ErRHVCLENBQUEsTUFBQyxZQUF4QjtDQUVDLENBQUEsRUFBQSxHQUFRLE9BQVI7Q0FqRUQsRUErRHVCOztDQS9EdkIsQ0FxRWlCLENBQUEsTUFBQyxNQUFsQjtDQUVDLENBQUEsRUFBQSxHQUFRLEdBQVI7Q0F2RUQsRUFxRWlCOztDQXJFakIsQ0EyRXVCLENBQUEsTUFBQyxZQUF4QjtDQUVDLENBQUEsRUFBQSxHQUFRLE9BQVI7Q0E3RUQsRUEyRXVCOztDQTNFdkIsQ0FpRmEsQ0FBQSxNQUFDLEVBQWQ7Q0FFQyxDQUFBLENBQUksQ0FBSixNQUFBO0NBbkZELEVBaUZhOztDQWpGYixDQXVGbUIsQ0FBQSxNQUFDLFFBQXBCO0NBRUMsQ0FBQSxDQUFJLENBQUosVUFBQTtDQXpGRCxFQXVGbUI7O0NBdkZuQixDQTZGYSxDQUFBLE1BQUMsRUFBZDtDQUVDLENBQUEsQ0FBSSxDQUFKLE1BQUE7Q0EvRkQsRUE2RmE7O0NBN0ZiLENBbUdtQixDQUFBLE1BQUMsUUFBcEI7Q0FFQyxDQUFBLENBQUksQ0FBSixVQUFBO0NBckdELEVBbUdtQjs7Q0FuR25CLENBeUdnQixDQUFBLE1BQUMsS0FBakI7Q0FFQyxDQUFBLEVBQUEsRUFBTyxJQUFQO0NBM0dELEVBeUdnQjs7Q0F6R2hCLENBK0dzQixDQUFBLE1BQUMsV0FBdkI7Q0FFQyxDQUFBLEVBQUEsRUFBTyxRQUFQO0NBakhELEVBK0dzQjs7Q0EvR3RCLENBcUhnQixDQUFBLE1BQUMsS0FBakI7Q0FFQyxDQUFBLEVBQUEsRUFBTyxJQUFQO0NBdkhELEVBcUhnQjs7Q0FySGhCLENBMkhzQixDQUFBLE1BQUMsV0FBdkI7Q0FFQyxDQUFBLEVBQUEsRUFBTyxRQUFQO0NBN0hELEVBMkhzQjs7Q0EzSHRCLEVBaUlPLEVBQVAsSUFBUTtDQUVQLEVBQVUsQ0FBVixFQUFBLElBQVUsV0FBQTtDQUFWLEdBRUE7Q0FySUQsRUFpSU87O0NBaklQLEVBeUlNLENBQU4sS0FBTztBQUVOLENBQUEsQ0FBQSxFQUFBLE1BQUE7Q0FBQSxFQUVJLENBQUosQ0FGQTtDQUFBLEVBSVksQ0FBWixJQUFBO0NBSkEsRUFNSSxDQUFKLElBQUk7Q0FOSixFQVFRLENBQVI7Q0FSQSxHQVVBLEdBQVE7Q0FWUixHQVlBLEdBQVE7Q0FaUixFQWNJLENBQUo7Q0FkQSxHQWdCQSxFQUFPO0NBM0pSLEVBeUlNOztDQXpJTixFQStKTyxFQUFQLElBQU87Q0FFTixHQUFBLElBQUE7Q0FBQSxXQUFBO01BQUE7Q0FBQSxFQUVVLENBQVYsRUFBQSxJQUFVLFdBQUE7Q0FuS1gsRUErSk87O0NBL0pQLEVBdUtNLENBQU4sS0FBTTtBQUVTLENBQWQsR0FBQSxJQUFBO0NBQUEsV0FBQTtNQUFBO0NBQUEsR0FFQSxFQUFBLGNBQUE7Q0EzS0QsRUF1S007O0NBdktOOztDQVBEIiwic291cmNlc0NvbnRlbnQiOlsiV2FpdGVyID0gcmVxdWlyZSAnLi9XYWl0ZXInXG5uZXh0VGljayA9IHJlcXVpcmUgJy4vbmV4dFRpY2snXG5Qcmlvcml0eSA9IHJlcXVpcmUgJy4vUHJpb3JpdHknXG57cmVxdWVzdEFuaW1hdGlvbkZyYW1lLCBjYW5jZWxBbmltYXRpb25GcmFtZX0gPSByZXF1aXJlICcuL3JhZidcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBUaW1pbmdcblxuXHRzZWxmID0gQFxuXG5cdGNvbnN0cnVjdG9yOiAtPlxuXG5cdFx0QG5hbm9UaW1lID0gMFxuXG5cdFx0QHRpbWUgPSAwXG5cblx0XHRAc3BlZWQgPSAxXG5cblx0XHRAdGlja051bWJlclxuXG5cdFx0QF9yYWZJZCA9IDBcblxuXHRcdEBfd2FpdGVyID0gbmV3IFdhaXRlclxuXG5cdFx0QF9ib3VuZExvb3AgPSAodCkgPT5cblxuXHRcdFx0QF9sb29wIHRcblxuXHRcdFx0cmV0dXJuXG5cblx0XHRAX3N0YXJ0ZWQgPSBub1xuXG5cblx0XHRAX2JlZm9yZSA9IG5ldyBQcmlvcml0eVxuXG5cdFx0QF9vbiA9IG5ldyBQcmlvcml0eVxuXG5cdFx0QF9hZnRlciA9IG5ldyBQcmlvcml0eVxuXG5cdG5leHRUaWNrOiAoZm4pIC0+XG5cblx0XHRuZXh0VGljayBmblxuXG5cdFx0cmV0dXJuXG5cblx0d2FpdDogKG1zLCBmbikgLT5cblxuXHRcdGNhbGxUaW1lID0gQHRpbWUgKyBtcyArIDhcblxuXHRcdEBfd2FpdGVyLnNldFRpbWVvdXQgY2FsbFRpbWUsIGZuXG5cblx0XHRyZXR1cm5cblxuXHRldmVyeTogKG1zLCBmbikgLT5cblxuXHRcdEBfd2FpdGVyLnNldEludGVydmFsIG1zLCBmbiwgQHRpbWVcblxuXHRcdHJldHVyblxuXG5cdGNhbmNlbEV2ZXJ5OiAoZm4pIC0+XG5cblx0XHRAX3dhaXRlci5jYW5jZWxJbnRlcnZhbCBmblxuXG5cdFx0cmV0dXJuXG5cblx0YmVmb3JlTmV4dEZyYW1lOiAoZm4pIC0+XG5cblx0XHRAX2JlZm9yZS5vbk5leHRUaWNrIGZuXG5cblx0XHRyZXR1cm5cblxuXHRjYW5jZWxCZWZvcmVOZXh0RnJhbWU6IChmbikgLT5cblxuXHRcdEBfYmVmb3JlLmNhbmNlbE5leHRUaWNrIGZuXG5cblx0XHRyZXR1cm5cblxuXHRiZWZvcmVFYWNoRnJhbWU6IChmbikgLT5cblxuXHRcdEBfYmVmb3JlLm9uRWFjaFRpY2sgZm5cblxuXHRcdHJldHVyblxuXG5cdGNhbmNlbEJlZm9yZUVhY2hGcmFtZTogKGZuKSAtPlxuXG5cdFx0QF9iZWZvcmUuY2FuY2VsRWFjaFRpY2sgZm5cblxuXHRcdHJldHVyblxuXG5cdG9uTmV4dEZyYW1lOiAoZm4pIC0+XG5cblx0XHRAX29uLm9uTmV4dFRpY2sgZm5cblxuXHRcdHJldHVyblxuXG5cdGNhbmNlbE9uTmV4dEZyYW1lOiAoZm4pIC0+XG5cblx0XHRAX29uLmNhbmNlbE5leHRUaWNrIGZuXG5cblx0XHRyZXR1cm5cblxuXHRvbkVhY2hGcmFtZTogKGZuKSAtPlxuXG5cdFx0QF9vbi5vbkVhY2hUaWNrIGZuXG5cblx0XHRyZXR1cm5cblxuXHRjYW5jZWxPbkVhY2hGcmFtZTogKGZuKSAtPlxuXG5cdFx0QF9vbi5jYW5jZWxFYWNoVGljayBmblxuXG5cdFx0cmV0dXJuXG5cblx0YWZ0ZXJOZXh0RnJhbWU6IChmbikgLT5cblxuXHRcdEBfYWZ0ZXIub25OZXh0VGljayBmblxuXG5cdFx0cmV0dXJuXG5cblx0Y2FuY2VsQWZ0ZXJOZXh0RnJhbWU6IChmbikgLT5cblxuXHRcdEBfYWZ0ZXIuY2FuY2VsTmV4dFRpY2sgZm5cblxuXHRcdHJldHVyblxuXG5cdGFmdGVyRWFjaEZyYW1lOiAoZm4pIC0+XG5cblx0XHRAX2FmdGVyLm9uRWFjaFRpY2sgZm5cblxuXHRcdHJldHVyblxuXG5cdGNhbmNlbEFmdGVyRWFjaEZyYW1lOiAoZm4pIC0+XG5cblx0XHRAX2FmdGVyLmNhbmNlbEVhY2hUaWNrIGZuXG5cblx0XHRyZXR1cm5cblxuXHRfbG9vcDogKHQpIC0+XG5cblx0XHRAX3JhZklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIEBfYm91bmRMb29wXG5cblx0XHRAdGljayB0XG5cblx0XHRyZXR1cm5cblxuXHR0aWNrOiAodCkgLT5cblxuXHRcdEB0aWNrTnVtYmVyKytcblxuXHRcdHQgPSB0ICogQHNwZWVkXG5cblx0XHRAbmFub1RpbWUgPSB0XG5cblx0XHR0ID0gcGFyc2VJbnQgdFxuXG5cdFx0QHRpbWUgPSB0XG5cblx0XHRAX3dhaXRlci50aWNrIHRcblxuXHRcdEBfYmVmb3JlLnRpY2sgdFxuXG5cdFx0QF9vbi50aWNrIHRcblxuXHRcdEBfYWZ0ZXIudGljayB0XG5cblx0XHRyZXR1cm5cblxuXHRzdGFydDogLT5cblxuXHRcdHJldHVybiBpZiBAX3N0YXJ0ZWRcblxuXHRcdEBfcmFmSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgQF9ib3VuZExvb3BcblxuXHRcdHJldHVyblxuXG5cdHN0b3A6IC0+XG5cblx0XHRyZXR1cm4gaWYgbm90IEBfc3RhcnRlZFxuXG5cdFx0Y2FuY2VsQW5pbWF0aW9uRnJhbWUgQF9yYWZJZFxuXG5cdFx0cmV0dXJuIl19
},{"./Priority":8,"./Waiter":10,"./nextTick":11,"./raf":14}],10:[function(require,module,exports){
var Waiter, array, intervalPool, shouldInjectCallItem, timeoutPool;

array = require('utila').array;

timeoutPool = require('./pool/timeout');

intervalPool = require('./pool/interval');

module.exports = Waiter = (function() {
  function Waiter() {
    this._timeouts = [];
    this._intervals = [];
    this._toRemoveFromIntervals = [];
  }

  Waiter.prototype.setTimeout = function(callTime, fn) {
    var item;
    item = timeoutPool.give(callTime, fn);
    array.injectByCallback(this._timeouts, item, shouldInjectCallItem);
  };

  Waiter.prototype.cancelTimeout = function(fn) {
    throw Error("TODO: Waiter.cancelTimeout() to be implemented");
  };

  Waiter.prototype._callTimeouts = function(t) {
    var item;
    if (this._timeouts.length < 1) {
      return;
    }
    while (this._timeouts.length) {
      item = this._timeouts[0];
      if (item.time > t) {
        return;
      }
      timeoutPool.take(item);
      this._timeouts.shift();
      item.fn(t);
    }
  };

  Waiter.prototype.tick = function(t) {
    this._callTimeouts(t);
    this._callIntervals(t);
  };

  Waiter.prototype.setInterval = function(ms, fn, currentTimeInMs) {
    this._intervals.push(intervalPool.give(ms, currentTimeInMs, 0, fn));
  };

  Waiter.prototype.cancelInterval = function(fn) {
    this._toRemoveFromIntervals.push(fn);
  };

  Waiter.prototype._callIntervals = function(t) {
    var fnToRemove, item, properTimeToCall, _i, _j, _len, _len1, _ref, _ref1;
    if (this._intervals.length < 1) {
      return;
    }
    _ref = this._toRemoveFromIntervals;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      fnToRemove = _ref[_i];
      array.pluckByCallback(this._intervals, function(item) {
        if (item.fn === fnToRemove) {
          return true;
        }
        return false;
      });
    }
    _ref1 = this._intervals;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      item = _ref1[_j];
      properTimeToCall = item.from + (item.timesCalled * item.every) + item.every;
      if (properTimeToCall <= t) {
        item.fn(t);
        item.timesCalled++;
      }
    }
  };

  return Waiter;

})();

shouldInjectCallItem = function(itemA, itemB, itemToInject) {
  var _ref;
  if (itemA == null) {
    if (itemToInject.time <= itemB.time) {
      return true;
    }
    return false;
  }
  if (itemB == null) {
    if (itemA.time <= itemToInject.time) {
      return true;
    }
    return false;
  }
  if ((itemA.time <= (_ref = itemToInject.time) && _ref <= itemB.time)) {
    return true;
  }
  return false;
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2FpdGVyLmpzIiwic291cmNlUm9vdCI6Ii4uXFwuLiIsInNvdXJjZXMiOlsiY29mZmVlXFxsaWJcXFdhaXRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSwwREFBQTs7QUFBQyxDQUFELEVBQVUsRUFBVixFQUFVOztBQUNWLENBREEsRUFDYyxJQUFBLElBQWQsS0FBYzs7QUFDZCxDQUZBLEVBRWUsSUFBQSxLQUFmLEtBQWU7O0FBRWYsQ0FKQSxFQUl1QixHQUFqQixDQUFOO0NBRWMsQ0FBQSxDQUFBLGFBQUE7Q0FFWixDQUFBLENBQWEsQ0FBYixLQUFBO0NBQUEsQ0FBQSxDQUVjLENBQWQsTUFBQTtDQUZBLENBQUEsQ0FJMEIsQ0FBMUIsa0JBQUE7Q0FORCxFQUFhOztDQUFiLENBUXVCLENBQVgsS0FBQSxDQUFDLENBQWI7Q0FFQyxHQUFBLElBQUE7Q0FBQSxDQUFrQyxDQUEzQixDQUFQLElBQU8sR0FBVztDQUFsQixDQUVtQyxFQUFuQyxDQUFLLElBQUwsT0FBQSxJQUFBO0NBWkQsRUFRWTs7Q0FSWixDQWdCZSxDQUFBLE1BQUMsSUFBaEI7Q0FFQyxJQUFNLEtBQUEsc0NBQUE7Q0FsQlAsRUFnQmU7O0NBaEJmLEVBb0JlLE1BQUMsSUFBaEI7Q0FFQyxHQUFBLElBQUE7Q0FBQSxFQUE4QixDQUE5QixFQUFVLEdBQVU7Q0FBcEIsV0FBQTtNQUFBO0NBRUEsRUFBQSxDQUFPLEVBQVAsR0FBZ0IsRUFBVjtDQUVMLEVBQU8sQ0FBUCxFQUFBLEdBQWtCO0NBRWxCLEVBQXNCLENBQVosRUFBVjtDQUFBLGFBQUE7UUFGQTtDQUFBLEdBSUEsRUFBQSxLQUFXO0NBSlgsR0FNQyxDQUFELENBQUEsR0FBVTtDQU5WLENBUUEsRUFBSSxFQUFKO0NBZGEsSUFJZDtDQXhCRCxFQW9CZTs7Q0FwQmYsRUFzQ00sQ0FBTixLQUFPO0NBRU4sR0FBQSxTQUFBO0NBQUEsR0FFQSxVQUFBO0NBMUNELEVBc0NNOztDQXRDTixDQThDYSxDQUFBLE1BQUMsRUFBZCxJQUFhO0NBRVosQ0FBaUIsRUFBakIsTUFBVyxFQUFrQixHQUFaO0NBaERsQixFQThDYTs7Q0E5Q2IsQ0FvRGdCLENBQUEsTUFBQyxLQUFqQjtDQUdDLENBQUEsRUFBQSxrQkFBdUI7Q0F2RHhCLEVBb0RnQjs7Q0FwRGhCLEVBMkRnQixNQUFDLEtBQWpCO0NBRUMsT0FBQSw0REFBQTtDQUFBLEVBQStCLENBQS9CLEVBQVUsSUFBVztDQUFyQixXQUFBO01BQUE7Q0FFQTtDQUFBLFFBQUEsa0NBQUE7NkJBQUE7Q0FFQyxDQUFtQyxDQUFBLENBQVosQ0FBbEIsQ0FBTCxHQUFvQyxDQUFwQyxLQUFBO0NBRUMsQ0FBYyxFQUFBLENBQVcsR0FBekIsRUFBQTtDQUFBLEdBQUEsYUFBTztVQUFQO0NBQ0EsSUFBQSxVQUFPO0NBSFIsTUFBbUM7Q0FGcEMsSUFGQTtDQVNBO0NBQUEsUUFBQSxxQ0FBQTt3QkFBQTtDQUVDLEVBQW1CLENBQUksQ0FBUSxDQUEvQixLQUFnQyxLQUFoQztDQUVBLEdBQUcsRUFBSCxVQUFHO0NBRUYsQ0FBQSxFQUFJLElBQUo7QUFFQSxDQUZBLENBQUEsRUFFSSxJQUFKLEdBQUE7UUFSRjtDQUFBLElBWGU7Q0EzRGhCLEVBMkRnQjs7Q0EzRGhCOztDQU5EOztBQXdGQSxDQXhGQSxDQXdGK0IsQ0FBUixFQUFBLElBQUMsR0FBRCxRQUF2QjtDQUVDLEdBQUEsRUFBQTtDQUFBLENBQUEsRUFBTyxTQUFQO0NBRUMsR0FBQSxDQUF3QyxPQUFkO0NBQTFCLEdBQUEsU0FBTztNQUFQO0NBRUEsSUFBQSxNQUFPO0lBSlI7Q0FNQSxDQUFBLEVBQU8sU0FBUDtDQUVDLEdBQUEsQ0FBbUIsT0FBcUI7Q0FBeEMsR0FBQSxTQUFPO01BQVA7Q0FFQSxJQUFBLE1BQU87SUFWUjtDQVlBLENBQUEsQ0FBNEIsQ0FBZCxDQUFLLE9BQXFCO0NBQXhDLEdBQUEsT0FBTztJQVpQO0NBY0EsSUFBQSxJQUFPO0NBaEJlIiwic291cmNlc0NvbnRlbnQiOlsie2FycmF5fSA9IHJlcXVpcmUgJ3V0aWxhJ1xyXG50aW1lb3V0UG9vbCA9IHJlcXVpcmUgJy4vcG9vbC90aW1lb3V0J1xyXG5pbnRlcnZhbFBvb2wgPSByZXF1aXJlICcuL3Bvb2wvaW50ZXJ2YWwnXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFdhaXRlclxyXG5cclxuXHRjb25zdHJ1Y3RvcjogLT5cclxuXHJcblx0XHRAX3RpbWVvdXRzID0gW11cclxuXHJcblx0XHRAX2ludGVydmFscyA9IFtdXHJcblxyXG5cdFx0QF90b1JlbW92ZUZyb21JbnRlcnZhbHMgPSBbXVxyXG5cclxuXHRzZXRUaW1lb3V0OiAoY2FsbFRpbWUsIGZuKSAtPlxyXG5cclxuXHRcdGl0ZW0gPSB0aW1lb3V0UG9vbC5naXZlIGNhbGxUaW1lLCBmblxyXG5cclxuXHRcdGFycmF5LmluamVjdEJ5Q2FsbGJhY2sgQF90aW1lb3V0cywgaXRlbSwgc2hvdWxkSW5qZWN0Q2FsbEl0ZW1cclxuXHJcblx0XHRyZXR1cm5cclxuXHJcblx0Y2FuY2VsVGltZW91dDogKGZuKSAtPlxyXG5cclxuXHRcdHRocm93IEVycm9yIFwiVE9ETzogV2FpdGVyLmNhbmNlbFRpbWVvdXQoKSB0byBiZSBpbXBsZW1lbnRlZFwiXHJcblxyXG5cdF9jYWxsVGltZW91dHM6ICh0KSAtPlxyXG5cclxuXHRcdHJldHVybiBpZiBAX3RpbWVvdXRzLmxlbmd0aCA8IDFcclxuXHJcblx0XHR3aGlsZSBAX3RpbWVvdXRzLmxlbmd0aFxyXG5cclxuXHRcdFx0aXRlbSA9IEBfdGltZW91dHNbMF1cclxuXHJcblx0XHRcdHJldHVybiBpZiBpdGVtLnRpbWUgPiB0XHJcblxyXG5cdFx0XHR0aW1lb3V0UG9vbC50YWtlIGl0ZW1cclxuXHJcblx0XHRcdEBfdGltZW91dHMuc2hpZnQoKVxyXG5cclxuXHRcdFx0aXRlbS5mbiB0XHJcblxyXG5cdFx0cmV0dXJuXHJcblxyXG5cdHRpY2s6ICh0KSAtPlxyXG5cclxuXHRcdEBfY2FsbFRpbWVvdXRzIHRcclxuXHJcblx0XHRAX2NhbGxJbnRlcnZhbHMgdFxyXG5cclxuXHRcdHJldHVyblxyXG5cclxuXHRzZXRJbnRlcnZhbDogKG1zLCBmbiwgY3VycmVudFRpbWVJbk1zKSAtPlxyXG5cclxuXHRcdEBfaW50ZXJ2YWxzLnB1c2ggaW50ZXJ2YWxQb29sLmdpdmUgbXMsIGN1cnJlbnRUaW1lSW5NcywgMCwgZm5cclxuXHJcblx0XHRyZXR1cm5cclxuXHJcblx0Y2FuY2VsSW50ZXJ2YWw6IChmbikgLT5cclxuXHJcblx0XHQjIHRvZG86IG1ha2UgdGhpcyBJRCBiYXNlZFxyXG5cdFx0QF90b1JlbW92ZUZyb21JbnRlcnZhbHMucHVzaCBmblxyXG5cclxuXHRcdHJldHVyblxyXG5cclxuXHRfY2FsbEludGVydmFsczogKHQpIC0+XHJcblxyXG5cdFx0cmV0dXJuIGlmIEBfaW50ZXJ2YWxzLmxlbmd0aCA8IDFcclxuXHJcblx0XHRmb3IgZm5Ub1JlbW92ZSBpbiBAX3RvUmVtb3ZlRnJvbUludGVydmFsc1xyXG5cclxuXHRcdFx0YXJyYXkucGx1Y2tCeUNhbGxiYWNrIEBfaW50ZXJ2YWxzLCAoaXRlbSkgLT5cclxuXHJcblx0XHRcdFx0cmV0dXJuIHllcyBpZiBpdGVtLmZuIGlzIGZuVG9SZW1vdmVcclxuXHRcdFx0XHRyZXR1cm4gbm9cclxuXHJcblx0XHRmb3IgaXRlbSBpbiBAX2ludGVydmFsc1xyXG5cclxuXHRcdFx0cHJvcGVyVGltZVRvQ2FsbCA9IGl0ZW0uZnJvbSArIChpdGVtLnRpbWVzQ2FsbGVkICogaXRlbS5ldmVyeSkgKyBpdGVtLmV2ZXJ5XHJcblxyXG5cdFx0XHRpZiBwcm9wZXJUaW1lVG9DYWxsIDw9IHRcclxuXHJcblx0XHRcdFx0aXRlbS5mbiB0XHJcblxyXG5cdFx0XHRcdGl0ZW0udGltZXNDYWxsZWQrK1xyXG5cclxuXHRcdHJldHVyblxyXG5cclxuc2hvdWxkSW5qZWN0Q2FsbEl0ZW0gPSAoaXRlbUEsIGl0ZW1CLCBpdGVtVG9JbmplY3QpIC0+XHJcblxyXG5cdHVubGVzcyBpdGVtQT9cclxuXHJcblx0XHRyZXR1cm4geWVzIGlmIGl0ZW1Ub0luamVjdC50aW1lIDw9IGl0ZW1CLnRpbWVcclxuXHJcblx0XHRyZXR1cm4gbm9cclxuXHJcblx0dW5sZXNzIGl0ZW1CP1xyXG5cclxuXHRcdHJldHVybiB5ZXMgaWYgaXRlbUEudGltZSA8PSBpdGVtVG9JbmplY3QudGltZVxyXG5cclxuXHRcdHJldHVybiBub1xyXG5cclxuXHRyZXR1cm4geWVzIGlmIGl0ZW1BLnRpbWUgPD0gaXRlbVRvSW5qZWN0LnRpbWUgPD0gaXRlbUIudGltZVxyXG5cclxuXHRyZXR1cm4gbm8iXX0=
},{"./pool/interval":12,"./pool/timeout":13,"utila":24}],11:[function(require,module,exports){
var nextTick;

module.exports = nextTick = (function() {
  if ((typeof process !== "undefined" && process !== null) && typeof process.nextTick === 'function') {
    return process.nextTick;
  }
  if (typeof setImmediate === 'function') {
    return function(cb) {
      return setImmediate(cb);
    };
  }
  return function(cb) {
    return setTimeout(cb, 0);
  };
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV4dFRpY2suanMiLCJzb3VyY2VSb290IjoiLi5cXC4uIiwic291cmNlcyI6WyJjb2ZmZWVcXGxpYlxcbmV4dFRpY2suY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLElBQUEsSUFBQTs7QUFBQSxDQUFBLEVBQWlCLEdBQVgsQ0FBTixDQUFpQixDQUFjO0FBRWQsQ0FBaEIsQ0FBQSxFQUFHLENBQXdDLENBQTNCLENBQWMsQ0FBZCxFQUFoQiwwQ0FBRztDQUVGLE1BQWMsQ0FBZCxHQUFPO0lBRlI7QUFJRyxDQUFILENBQUEsRUFBRyxDQUF1QixDQUF2QixJQUFILEVBQUc7Q0FFRixDQUFPLENBQUEsTUFBQyxFQUFEO0NBQXFCLENBQWIsVUFBQSxDQUFBO0NBQWYsSUFBTztJQU5SO0NBU0EsQ0FBTyxDQUFBLE1BQUE7Q0FBbUIsQ0FBWCxRQUFBLENBQUE7Q0FBZixFQUFPO0NBWHVCIiwic291cmNlc0NvbnRlbnQiOlsiIyBodHRwczovL2dpdGh1Yi5jb20vbWVkaWtvby9uZXh0LXRpY2svYmxvYi9tYXN0ZXIvbGliL25leHQtdGljay5qc1xyXG5tb2R1bGUuZXhwb3J0cyA9IG5leHRUaWNrID0gZG8gLT5cclxuXHJcblx0aWYgcHJvY2Vzcz8gYW5kIHR5cGVvZiBwcm9jZXNzLm5leHRUaWNrIGlzICdmdW5jdGlvbidcclxuXHJcblx0XHRyZXR1cm4gcHJvY2Vzcy5uZXh0VGlja1xyXG5cclxuXHRpZiB0eXBlb2Ygc2V0SW1tZWRpYXRlIGlzICdmdW5jdGlvbidcclxuXHJcblx0XHRyZXR1cm4gKGNiKSAtPiBzZXRJbW1lZGlhdGUgY2JcclxuXHJcblx0IyB0b2RvOiB0aGVyZSB3YXMgYSBwb2x5ZmlsbCBmb3IgY2hyb21lIHRoYXQgc2ltdWxhdGVkIHNldEltbWVkaWF0ZS4uLlxyXG5cdHJldHVybiAoY2IpIC0+IHNldFRpbWVvdXQgY2IsIDAiXX0=
},{}],12:[function(require,module,exports){
var intervalPool;

module.exports = intervalPool = {
  _pool: [],
  _getNew: function(every, from, timesCalled, fn) {
    return {
      every: every,
      from: from,
      timesCalled: timesCalled,
      fn: fn
    };
  },
  give: function(every, from, timesCalled, fn) {
    var item;
    if (intervalPool._pool.length > 0) {
      item = intervalPool._pool.pop();
      item.every = every;
      item.from = from;
      item.timesCalled = timesCalled;
      item.fn = fn;
      return item;
    } else {
      return intervalPool._getNew(every, from, timesCalled, fn);
    }
  },
  take: function(item) {
    intervalPool._pool.push(item);
    return null;
  }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2YWwuanMiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLiIsInNvdXJjZXMiOlsiY29mZmVlXFxsaWJcXHBvb2xcXGludGVydmFsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLFFBQUE7O0FBQUEsQ0FBQSxFQUFpQixHQUFYLENBQU4sS0FBaUI7Q0FFaEIsQ0FBQSxHQUFBO0NBQUEsQ0FFQSxDQUFTLENBQUEsQ0FBQSxFQUFULEVBQVUsRUFBRDtXQUVSO0NBQUEsQ0FDUSxHQUFQLENBQUE7Q0FERCxDQUVPLEVBQU4sRUFBQTtDQUZELENBR2MsSUFBYixLQUFBO0NBSEQsQ0FJQyxJQUFBO0NBTk87Q0FGVCxFQUVTO0NBRlQsQ0FXQSxDQUFNLENBQU4sQ0FBTSxJQUFDLEVBQUQ7Q0FFTCxHQUFBLElBQUE7Q0FBQSxFQUErQixDQUEvQixDQUFxQixDQUFsQixNQUFZO0NBRWQsRUFBTyxDQUFQLENBQXlCLENBQXpCLE1BQW1CO0NBQW5CLEVBRWEsQ0FBVCxDQUFKLENBQUE7Q0FGQSxFQUdZLENBQVIsRUFBSjtDQUhBLEVBSW1CLENBQWYsRUFBSixLQUFBO0NBSkEsQ0FLQSxDQUFVLENBQU4sRUFBSjtDQUVBLEdBQUEsU0FBTztNQVRSO0NBYUMsQ0FBbUMsRUFBNUIsQ0FBQSxFQUFBLElBQUEsQ0FBWSxDQUFaO01BZkg7Q0FYTixFQVdNO0NBWE4sQ0E0QkEsQ0FBTSxDQUFOLEtBQU87Q0FFTixHQUFBLENBQWtCLE9BQU47Q0FGUCxVQUlMO0NBaENELEVBNEJNO0NBOUJQLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGludGVydmFsUG9vbCA9XG5cblx0X3Bvb2w6IFtdXG5cblx0X2dldE5ldzogKGV2ZXJ5LCBmcm9tLCB0aW1lc0NhbGxlZCwgZm4pIC0+XG5cblx0XHR7XG5cdFx0XHRldmVyeTogZXZlcnlcblx0XHRcdGZyb206IGZyb21cblx0XHRcdHRpbWVzQ2FsbGVkOiB0aW1lc0NhbGxlZFxuXHRcdFx0Zm46IGZuXG5cdFx0fVxuXG5cdGdpdmU6IChldmVyeSwgZnJvbSwgdGltZXNDYWxsZWQsIGZuKSAtPlxuXG5cdFx0aWYgaW50ZXJ2YWxQb29sLl9wb29sLmxlbmd0aCA+IDBcblxuXHRcdFx0aXRlbSA9IGludGVydmFsUG9vbC5fcG9vbC5wb3AoKVxuXG5cdFx0XHRpdGVtLmV2ZXJ5ID0gZXZlcnlcblx0XHRcdGl0ZW0uZnJvbSA9IGZyb21cblx0XHRcdGl0ZW0udGltZXNDYWxsZWQgPSB0aW1lc0NhbGxlZFxuXHRcdFx0aXRlbS5mbiA9IGZuXG5cblx0XHRcdHJldHVybiBpdGVtXG5cblx0XHRlbHNlXG5cblx0XHRcdHJldHVybiBpbnRlcnZhbFBvb2wuX2dldE5ldyBldmVyeSwgZnJvbSwgdGltZXNDYWxsZWQsIGZuXG5cblx0dGFrZTogKGl0ZW0pIC0+XG5cblx0XHRpbnRlcnZhbFBvb2wuX3Bvb2wucHVzaCBpdGVtXG5cblx0XHRudWxsIl19
},{}],13:[function(require,module,exports){
var timeoutPool;

module.exports = timeoutPool = {
  _pool: [],
  _getNew: function(time, fn) {
    return {
      time: time,
      fn: fn
    };
  },
  give: function(time, fn) {
    var item;
    if (this._pool.length > 0) {
      item = this._pool.pop();
      item.time = time;
      item.fn = fn;
      return item;
    } else {
      return this._getNew(time, fn);
    }
  },
  take: function(item) {
    this._pool.push(item);
    return null;
  }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZW91dC5qcyIsInNvdXJjZVJvb3QiOiIuLlxcLi5cXC4uIiwic291cmNlcyI6WyJjb2ZmZWVcXGxpYlxccG9vbFxcdGltZW91dC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxPQUFBOztBQUFBLENBQUEsRUFBaUIsR0FBWCxDQUFOLElBQWlCO0NBRWhCLENBQUEsR0FBQTtDQUFBLENBRUEsQ0FBUyxDQUFBLEdBQVQsRUFBVTtXQUVUO0NBQUEsQ0FDTyxFQUFOLEVBQUE7Q0FERCxDQUVDLElBQUE7Q0FKTztDQUZULEVBRVM7Q0FGVCxDQVNBLENBQU0sQ0FBTixLQUFPO0NBRU4sR0FBQSxJQUFBO0NBQUEsRUFBbUIsQ0FBbkIsQ0FBUyxDQUFOO0NBRUYsRUFBTyxDQUFQLENBQWEsQ0FBYjtDQUFBLEVBRVksQ0FBUixFQUFKO0NBRkEsQ0FJQSxDQUFVLENBQU4sRUFBSjtDQUVBLEdBQUEsU0FBTztNQVJSO0NBWUMsQ0FBc0IsRUFBZCxHQUFELE1BQUE7TUFkSDtDQVROLEVBU007Q0FUTixDQXlCQSxDQUFNLENBQU4sS0FBTztDQUVOLEdBQUEsQ0FBTTtDQUZELFVBSUw7Q0E3QkQsRUF5Qk07Q0EzQlAsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gdGltZW91dFBvb2wgPVxuXG5cdF9wb29sOiBbXVxuXG5cdF9nZXROZXc6ICh0aW1lLCBmbikgLT5cblxuXHRcdHtcblx0XHRcdHRpbWU6IHRpbWVcblx0XHRcdGZuOiBmblxuXHRcdH1cblxuXHRnaXZlOiAodGltZSwgZm4pIC0+XG5cblx0XHRpZiBAX3Bvb2wubGVuZ3RoID4gMFxuXG5cdFx0XHRpdGVtID0gQF9wb29sLnBvcCgpXG5cblx0XHRcdGl0ZW0udGltZSA9IHRpbWVcblxuXHRcdFx0aXRlbS5mbiA9IGZuXG5cblx0XHRcdHJldHVybiBpdGVtXG5cblx0XHRlbHNlXG5cblx0XHRcdHJldHVybiBAX2dldE5ldyB0aW1lLCBmblxuXG5cdHRha2U6IChpdGVtKSAtPlxuXG5cdFx0QF9wb29sLnB1c2ggaXRlbVxuXG5cdFx0bnVsbCJdfQ==
},{}],14:[function(require,module,exports){
module.exports = {
  requestAnimationFrame: (function() {
    if (window.requestAnimationFrame) {
      return window.requestAnimationFrame.bind(window);
    }
    if (window.mozRequestAnimationFrame) {
      return window.mozRequestAnimationFrame.bind(window);
    }
    if (window.webkitRequestAnimationFrame) {
      return window.webkitRequestAnimationFrame.bind(window);
    }
    throw Error("This environment does not support requestAnimationFrame, and no, we're not gonna fall back to setTimeout()!");
  })(),
  cancelAnimationFrame: (function() {
    if (window.cancelAnimationFrame) {
      return window.cancelAnimationFrame.bind(window);
    }
    if (window.mozCancelAnimationFrame) {
      return window.mozCancelAnimationFrame.bind(window);
    }
    if (window.webkitCancelAnimationFrame) {
      return window.webkitCancelAnimationFrame.bind(window);
    }
    throw Error("This environment does not support requestAnimationFrame, and no, we're not gonna fall back to setTimeout()!");
  })()
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFmLmpzIiwic291cmNlUm9vdCI6Ii4uXFwuLiIsInNvdXJjZXMiOlsiY29mZmVlXFxsaWJcXHJhZi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBTyxFQUVOLEdBRkssQ0FBTjtDQUVDLENBQUEsQ0FBMEIsTUFBQSxZQUExQjtDQUVDLEdBQUEsRUFBMEQsZUFBMUQ7Q0FBQSxHQUFPLEVBQU0sT0FBTixRQUE0QjtNQUFuQztDQUVBLEdBQUEsRUFBNkQsa0JBQTdEO0NBQUEsR0FBTyxFQUFNLE9BQU4sV0FBK0I7TUFGdEM7Q0FJQSxHQUFBLEVBQWdFLHFCQUFoRTtDQUFBLEdBQU8sRUFBTSxPQUFOLGNBQWtDO01BSnpDO0NBTUEsSUFBTSxLQUFBLG1HQUFBO0NBUm1CLEVBQUE7Q0FBMUIsQ0FVQSxDQUF5QixNQUFBLFdBQXpCO0NBRUMsR0FBQSxFQUF5RCxjQUF6RDtDQUFBLEdBQU8sRUFBTSxPQUFOLE9BQTJCO01BQWxDO0NBRUEsR0FBQSxFQUE0RCxpQkFBNUQ7Q0FBQSxHQUFPLEVBQU0sT0FBTixVQUE4QjtNQUZyQztDQUlBLEdBQUEsRUFBK0Qsb0JBQS9EO0NBQUEsR0FBTyxFQUFNLE9BQU4sYUFBaUM7TUFKeEM7Q0FNQSxJQUFNLEtBQUEsbUdBQUE7Q0FSa0IsRUFBQTtDQVoxQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxyXG5cclxuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWU6IGRvIC0+XHJcblxyXG5cdFx0cmV0dXJuIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUuYmluZCh3aW5kb3cpIGlmIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuXHJcblx0XHRyZXR1cm4gd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZS5iaW5kKHdpbmRvdykgaWYgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZVxyXG5cclxuXHRcdHJldHVybiB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lLmJpbmQod2luZG93KSBpZiB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lXHJcblxyXG5cdFx0dGhyb3cgRXJyb3IgXCJUaGlzIGVudmlyb25tZW50IGRvZXMgbm90IHN1cHBvcnQgcmVxdWVzdEFuaW1hdGlvbkZyYW1lLCBhbmQgbm8sIHdlJ3JlIG5vdCBnb25uYSBmYWxsIGJhY2sgdG8gc2V0VGltZW91dCgpIVwiXHJcblxyXG5cdGNhbmNlbEFuaW1hdGlvbkZyYW1lOiBkbyAtPlxyXG5cclxuXHRcdHJldHVybiB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUuYmluZCh3aW5kb3cpIGlmIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZVxyXG5cclxuXHRcdHJldHVybiB3aW5kb3cubW96Q2FuY2VsQW5pbWF0aW9uRnJhbWUuYmluZCh3aW5kb3cpIGlmIHdpbmRvdy5tb3pDYW5jZWxBbmltYXRpb25GcmFtZVxyXG5cclxuXHRcdHJldHVybiB3aW5kb3cud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWUuYmluZCh3aW5kb3cpIGlmIHdpbmRvdy53ZWJraXRDYW5jZWxBbmltYXRpb25GcmFtZVxyXG5cclxuXHRcdHRocm93IEVycm9yIFwiVGhpcyBlbnZpcm9ubWVudCBkb2VzIG5vdCBzdXBwb3J0IHJlcXVlc3RBbmltYXRpb25GcmFtZSwgYW5kIG5vLCB3ZSdyZSBub3QgZ29ubmEgZmFsbCBiYWNrIHRvIHNldFRpbWVvdXQoKSFcIiJdfQ==
},{}],15:[function(require,module,exports){
module.exports=require(1)
},{"./transformation/perspective":16,"./transformation/rotation":17,"./transformation/scale":18,"./transformation/translation":19}],16:[function(require,module,exports){
module.exports=require(2)
},{}],17:[function(require,module,exports){
module.exports=require(3)
},{}],18:[function(require,module,exports){
module.exports=require(4)
},{}],19:[function(require,module,exports){
module.exports=require(5)
},{}],20:[function(require,module,exports){
var common;

module.exports = common = {
  /*
  	Checks to see if o is an object, and it isn't an instance
  	of some class.
  */

  isBareObject: function(o) {
    if ((o != null) && o.constructor === Object) {
      return true;
    }
    return false;
  },
  /*
  	Returns type of an object, including:
  	undefined, null, string, number, array,
  	arguments, element, textnode, whitespace, and object
  */

  typeOf: function(item) {
    var _ref;
    if (item === null) {
      return 'null';
    }
    if (typeof item !== 'object') {
      return typeof item;
    }
    if (Array.isArray(item)) {
      return 'array';
    }
    if (item.nodeName) {
      if (item.nodeType === 1) {
        return 'element';
      }
      if (item.nodeType === 3) {
        return (_ref = /\S/.test(item.nodeValue)) != null ? _ref : {
          'textnode': 'whitespace'
        };
      }
    } else if (typeof item.length === 'number') {
      if (item.callee) {
        return 'arguments';
      }
    }
    return typeof item;
  },
  clone: function(item, includePrototype) {
    if (includePrototype == null) {
      includePrototype = false;
    }
    switch (common.typeOf(item)) {
      case 'array':
        return common._cloneArray(item, includePrototype);
      case 'object':
        return common._cloneObject(item, includePrototype);
      default:
        return item;
    }
  },
  /*
  	Deep clone of an object.
  	From MooTools
  */

  _cloneObject: function(o, includePrototype) {
    var clone, key;
    if (includePrototype == null) {
      includePrototype = false;
    }
    if (common.isBareObject(o)) {
      clone = {};
      for (key in o) {
        clone[key] = common.clone(o[key], includePrototype);
      }
      return clone;
    } else {
      if (!includePrototype) {
        return o;
      }
      if (o instanceof Function) {
        return o;
      }
      clone = Object.create(o.constructor.prototype);
      for (key in o) {
        if (o.hasOwnProperty(key)) {
          clone[key] = common.clone(o[key], includePrototype);
        }
      }
      return clone;
    }
  },
  /*
  	Deep clone of an array.
  	From MooTools
  */

  _cloneArray: function(a, includePrototype) {
    var clone, i;
    if (includePrototype == null) {
      includePrototype = false;
    }
    i = a.length;
    clone = new Array(i);
    while (i--) {
      clone[i] = common.clone(a[i], includePrototype);
    }
    return clone;
  }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX2NvbW1vbi5qcyIsInNvdXJjZVJvb3QiOiIuLlxcLi4iLCJzb3VyY2VzIjpbImNvZmZlZVxcbGliXFxfY29tbW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLEVBQUE7O0FBQUEsQ0FBQSxFQUFpQixHQUFYLENBQU47Q0FFQzs7OztDQUFBO0NBQUEsQ0FJQSxDQUFjLE1BQUMsR0FBZjtDQUVDLEdBQUEsQ0FBMkIsQ0FBM0IsS0FBRztDQUVGLEdBQUEsU0FBTztNQUZSO0NBRmEsVUFNYjtDQVZELEVBSWM7Q0FRZDs7Ozs7Q0FaQTtDQUFBLENBaUJBLENBQVEsQ0FBQSxFQUFSLEdBQVM7Q0FFUixHQUFBLElBQUE7Q0FBQSxHQUFBLENBQXlCO0NBQXpCLEtBQUEsT0FBTztNQUFQO0FBRXNCLENBQXRCLEdBQUEsQ0FBdUMsQ0FBakIsRUFBdEI7QUFBTyxDQUFQLEdBQUEsRUFBTyxPQUFBO01BRlA7Q0FJQSxHQUFBLENBQXVCLEVBQUw7Q0FBbEIsTUFBQSxNQUFPO01BSlA7Q0FRQSxHQUFBLElBQUE7Q0FFQyxHQUFHLENBQWlCLENBQXBCLEVBQUc7Q0FBd0IsUUFBQSxNQUFPO1FBQWxDO0NBQ0EsR0FBRyxDQUFpQixDQUFwQixFQUFHO0NBQXdCLEVBQXFDO0NBQUEsQ0FBYSxRQUFiLEVBQUE7Q0FBaEUsU0FBMkI7UUFINUI7QUFLUSxDQUFBLEdBQUEsQ0FBc0IsQ0FMOUIsRUFBQTtDQU9DLEdBQUcsRUFBSDtDQUFvQixVQUFBLElBQU87UUFQNUI7TUFSQTtBQWlCTyxDQUFQLEdBQUEsRUFBTyxLQUFBO0NBcENSLEVBaUJRO0NBakJSLENBd0NBLENBQU8sQ0FBQSxDQUFQLElBQVEsT0FBRDs7R0FBMEIsR0FBbkI7TUFFYjtDQUFBLEdBQU8sRUFBTSxNQUFOO0NBQVAsTUFBQSxJQUVNO0NBQWEsQ0FBZ0MsRUFBekIsRUFBTSxLQUFOLElBQUEsQ0FBQTtDQUYxQixPQUFBLEdBSU07Q0FBYyxDQUFpQyxFQUExQixFQUFNLE1BQU4sR0FBQSxDQUFBO0NBSjNCO0NBTU0sR0FBQSxXQUFPO0NBTmIsSUFGTTtDQXhDUCxFQXdDTztDQVVQOzs7O0NBbERBO0NBQUEsQ0FzREEsQ0FBYyxNQUFDLEdBQWYsSUFBYztDQUViLE9BQUEsRUFBQTs7R0FGb0MsR0FBbkI7TUFFakI7Q0FBQSxHQUFBLEVBQVMsTUFBTjtDQUVGLENBQUEsQ0FBUSxFQUFSLENBQUE7QUFFQSxDQUFBLEVBQUEsS0FBQSxHQUFBO0NBRUMsQ0FBa0MsQ0FBNUIsRUFBQSxDQUFhLEVBQW5CLFFBQWE7Q0FGZCxNQUZBO0NBTUEsSUFBQSxRQUFPO01BUlI7QUFZaUIsQ0FBaEIsR0FBQSxFQUFBLFVBQUE7Q0FBQSxjQUFPO1FBQVA7Q0FFQSxHQUFZLEVBQVosRUFBQSxJQUF5QjtDQUF6QixjQUFPO1FBRlA7Q0FBQSxFQUlRLEVBQVIsQ0FBQSxHQUFRLEVBQTJCO0FBRW5DLENBQUEsRUFBQSxLQUFBLEdBQUE7Q0FFQyxFQUFHLENBQUEsSUFBSCxNQUFHO0NBRUYsQ0FBa0MsQ0FBNUIsRUFBQSxDQUFhLElBQW5CLE1BQWE7VUFKZjtDQUFBLE1BTkE7Q0FaRCxZQXdCQztNQTFCWTtDQXREZCxFQXNEYztDQTRCZDs7OztDQWxGQTtDQUFBLENBc0ZBLENBQWEsTUFBQyxFQUFkLEtBQWE7Q0FFWixPQUFBOztHQUZtQyxHQUFuQjtNQUVoQjtDQUFBLEVBQUksQ0FBSixFQUFBO0NBQUEsRUFFWSxDQUFaLENBQUE7QUFFTSxDQUFOLENBQUEsQ0FBQSxRQUFNO0NBRUwsQ0FBOEIsQ0FBbkIsRUFBTCxDQUFOLFVBQVc7Q0FOWixJQUlBO0NBTlksVUFVWjtDQWhHRCxFQXNGYTtDQXhGZCxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBjb21tb24gPVxuXG5cdCMjI1xuXHRDaGVja3MgdG8gc2VlIGlmIG8gaXMgYW4gb2JqZWN0LCBhbmQgaXQgaXNuJ3QgYW4gaW5zdGFuY2Vcblx0b2Ygc29tZSBjbGFzcy5cblx0IyMjXG5cdGlzQmFyZU9iamVjdDogKG8pIC0+XG5cblx0XHRpZiBvPyBhbmQgby5jb25zdHJ1Y3RvciBpcyBPYmplY3RcblxuXHRcdFx0cmV0dXJuIHRydWVcblxuXHRcdGZhbHNlXG5cblx0IyMjXG5cdFJldHVybnMgdHlwZSBvZiBhbiBvYmplY3QsIGluY2x1ZGluZzpcblx0dW5kZWZpbmVkLCBudWxsLCBzdHJpbmcsIG51bWJlciwgYXJyYXksXG5cdGFyZ3VtZW50cywgZWxlbWVudCwgdGV4dG5vZGUsIHdoaXRlc3BhY2UsIGFuZCBvYmplY3Rcblx0IyMjXG5cdHR5cGVPZjogKGl0ZW0pIC0+XG5cblx0XHRyZXR1cm4gJ251bGwnIGlmIGl0ZW0gaXMgbnVsbFxuXG5cdFx0cmV0dXJuIHR5cGVvZiBpdGVtIGlmIHR5cGVvZiBpdGVtIGlzbnQgJ29iamVjdCdcblxuXHRcdHJldHVybiAnYXJyYXknIGlmIEFycmF5LmlzQXJyYXkgaXRlbVxuXG5cdFx0IyBGcm9tIE1vb1Rvb2xzXG5cdFx0IyAtIGRvIHdlIGV2ZW4gbmVlZCB0aGlzP1xuXHRcdGlmIGl0ZW0ubm9kZU5hbWVcblxuXHRcdFx0aWYgaXRlbS5ub2RlVHlwZSBpcyAxIHRoZW4gcmV0dXJuICdlbGVtZW50J1xuXHRcdFx0aWYgaXRlbS5ub2RlVHlwZSBpcyAzIHRoZW4gcmV0dXJuICgvXFxTLykudGVzdChpdGVtLm5vZGVWYWx1ZSkgPyAndGV4dG5vZGUnIDogJ3doaXRlc3BhY2UnXG5cblx0XHRlbHNlIGlmIHR5cGVvZiBpdGVtLmxlbmd0aCBpcyAnbnVtYmVyJ1xuXG5cdFx0XHRpZiBpdGVtLmNhbGxlZSB0aGVuIHJldHVybiAnYXJndW1lbnRzJ1xuXG5cdFx0cmV0dXJuIHR5cGVvZiBpdGVtXG5cblx0IyBEZWVwIGNsb25lIG9mIGFueSB2YXJpYWJsZS5cblx0IyBGcm9tIE1vb1Rvb2xzXG5cdGNsb25lOiAoaXRlbSwgaW5jbHVkZVByb3RvdHlwZSA9IGZhbHNlKSAtPlxuXG5cdFx0c3dpdGNoIGNvbW1vbi50eXBlT2YgaXRlbVxuXG5cdFx0XHR3aGVuICdhcnJheScgdGhlbiByZXR1cm4gY29tbW9uLl9jbG9uZUFycmF5IGl0ZW0sIGluY2x1ZGVQcm90b3R5cGVcblxuXHRcdFx0d2hlbiAnb2JqZWN0JyB0aGVuIHJldHVybiBjb21tb24uX2Nsb25lT2JqZWN0IGl0ZW0sIGluY2x1ZGVQcm90b3R5cGVcblxuXHRcdFx0ZWxzZSByZXR1cm4gaXRlbVxuXG5cdCMjI1xuXHREZWVwIGNsb25lIG9mIGFuIG9iamVjdC5cblx0RnJvbSBNb29Ub29sc1xuXHQjIyNcblx0X2Nsb25lT2JqZWN0OiAobywgaW5jbHVkZVByb3RvdHlwZSA9IGZhbHNlKSAtPlxuXG5cdFx0aWYgY29tbW9uLmlzQmFyZU9iamVjdCBvXG5cblx0XHRcdGNsb25lID0ge31cblxuXHRcdFx0Zm9yIGtleSBvZiBvXG5cblx0XHRcdFx0Y2xvbmVba2V5XSA9IGNvbW1vbi5jbG9uZSBvW2tleV0sIGluY2x1ZGVQcm90b3R5cGVcblxuXHRcdFx0cmV0dXJuIGNsb25lXG5cblx0XHRlbHNlXG5cblx0XHRcdHJldHVybiBvIHVubGVzcyBpbmNsdWRlUHJvdG90eXBlXG5cblx0XHRcdHJldHVybiBvIGlmIG8gaW5zdGFuY2VvZiBGdW5jdGlvblxuXG5cdFx0XHRjbG9uZSA9IE9iamVjdC5jcmVhdGUgby5jb25zdHJ1Y3Rvci5wcm90b3R5cGVcblxuXHRcdFx0Zm9yIGtleSBvZiBvXG5cblx0XHRcdFx0aWYgby5oYXNPd25Qcm9wZXJ0eSBrZXlcblxuXHRcdFx0XHRcdGNsb25lW2tleV0gPSBjb21tb24uY2xvbmUgb1trZXldLCBpbmNsdWRlUHJvdG90eXBlXG5cblx0XHRcdGNsb25lXG5cblx0IyMjXG5cdERlZXAgY2xvbmUgb2YgYW4gYXJyYXkuXG5cdEZyb20gTW9vVG9vbHNcblx0IyMjXG5cdF9jbG9uZUFycmF5OiAoYSwgaW5jbHVkZVByb3RvdHlwZSA9IGZhbHNlKSAtPlxuXG5cdFx0aSA9IGEubGVuZ3RoXG5cblx0XHRjbG9uZSA9IG5ldyBBcnJheSBpXG5cblx0XHR3aGlsZSBpLS1cblxuXHRcdFx0Y2xvbmVbaV0gPSBjb21tb24uY2xvbmUgYVtpXSwgaW5jbHVkZVByb3RvdHlwZVxuXG5cdFx0Y2xvbmUiXX0=
},{}],21:[function(require,module,exports){
var array, _common;

_common = require('./_common');

module.exports = array = {
  _clone: _common._cloneArray.bind(_common),
  clone: function(what) {
    if (!Array.isArray(what)) {
      throw Error("`what` isn\'t an array.");
    }
    return this._clone.apply(this, arguments);
  },
  /*
  	Tries to turn anything into an array.
  */

  from: function(r) {
    return Array.prototype.slice.call(r);
  },
  /*
  	Clone of an array. Properties will be shallow copies.
  */

  simpleClone: function(a) {
    return a.slice(0);
  },
  pluck: function(a, i) {
    var index, value, _i, _len;
    if (a.length < 1) {
      return a;
    }
    for (index = _i = 0, _len = a.length; _i < _len; index = ++_i) {
      value = a[index];
      if (index > i) {
        a[index - 1] = a[index];
      }
    }
    a.length = a.length - 1;
    return a;
  },
  pluckItem: function(a, item) {
    var index, removed, value, _i, _len;
    if (a.length < 1) {
      return a;
    }
    removed = 0;
    for (index = _i = 0, _len = a.length; _i < _len; index = ++_i) {
      value = a[index];
      if (value === item) {
        removed++;
        continue;
      }
      if (removed !== 0) {
        a[index - removed] = a[index];
      }
    }
    if (removed > 0) {
      a.length = a.length - removed;
    }
    return a;
  },
  pluckOneItem: function(a, item) {
    var index, reached, value, _i, _len;
    if (a.length < 1) {
      return a;
    }
    reached = false;
    for (index = _i = 0, _len = a.length; _i < _len; index = ++_i) {
      value = a[index];
      if (!reached) {
        if (value === item) {
          reached = true;
          continue;
        }
      } else {
        a[index - 1] = a[index];
      }
    }
    if (reached) {
      a.length = a.length - 1;
    }
    return a;
  },
  pluckByCallback: function(a, cb) {
    var index, removed, value, _i, _len;
    if (a.length < 1) {
      return a;
    }
    removed = 0;
    for (index = _i = 0, _len = a.length; _i < _len; index = ++_i) {
      value = a[index];
      if (cb(value, index)) {
        removed++;
        continue;
      }
      if (removed !== 0) {
        a[index - removed] = a[index];
      }
    }
    if (removed > 0) {
      a.length = a.length - removed;
    }
    return a;
  },
  pluckMultiple: function(array, indexesToRemove) {
    var i, removedSoFar, _i, _len;
    if (array.length < 1) {
      return array;
    }
    removedSoFar = 0;
    indexesToRemove.sort();
    for (_i = 0, _len = indexesToRemove.length; _i < _len; _i++) {
      i = indexesToRemove[_i];
      this.pluck(array, i - removedSoFar);
      removedSoFar++;
    }
    return array;
  },
  injectByCallback: function(a, toInject, shouldInject) {
    var i, len, val, valA, valB, _i, _len;
    valA = null;
    valB = null;
    len = a.length;
    if (len < 1) {
      a.push(toInject);
      return a;
    }
    for (i = _i = 0, _len = a.length; _i < _len; i = ++_i) {
      val = a[i];
      valA = valB;
      valB = val;
      if (shouldInject(valA, valB, toInject)) {
        return a.splice(i, 0, toInject);
      }
    }
    a.push(toInject);
    return a;
  },
  injectInIndex: function(a, index, toInject) {
    var i, len, toPut, toPutNext;
    len = a.length;
    i = index;
    if (len < 1) {
      a.push(toInject);
      return a;
    }
    toPut = toInject;
    toPutNext = null;
    for(; i <= len; i++){

			toPutNext = a[i];

			a[i] = toPut;

			toPut = toPutNext;

		};
    return null;
  }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJyYXkuanMiLCJzb3VyY2VSb290IjoiLi5cXC4uIiwic291cmNlcyI6WyJjb2ZmZWVcXGxpYlxcYXJyYXkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsVUFBQTs7QUFBQSxDQUFBLEVBQVUsSUFBVixJQUFVOztBQUVWLENBRkEsRUFFaUIsRUFBQSxDQUFYLENBQU47Q0FFQyxDQUFBLEVBQVEsRUFBUixDQUFlLElBQVk7Q0FBM0IsQ0FFQSxDQUFPLENBQUEsQ0FBUCxJQUFRO0FBRXVDLENBQTlDLEdBQUEsQ0FBbUQsRUFBTDtDQUE5QyxJQUFNLE9BQUEsYUFBQTtNQUFOO0NBRUMsQ0FBZ0IsRUFBaEIsQ0FBRCxDQUFPLEdBQVAsRUFBQTtDQU5ELEVBRU87Q0FNUDs7O0NBUkE7Q0FBQSxDQVdBLENBQU0sQ0FBTixLQUFPO0NBRUQsR0FBTCxDQUFLLElBQUUsRUFBUDtDQWJELEVBV007Q0FJTjs7O0NBZkE7Q0FBQSxDQWtCQSxDQUFhLE1BQUMsRUFBZDtDQUVFLElBQUQsTUFBQTtDQXBCRCxFQWtCYTtDQWxCYixDQXNCQSxDQUFPLEVBQVAsSUFBUTtDQUVQLE9BQUEsY0FBQTtDQUFBLEVBQXVCLENBQXZCLEVBQVk7Q0FBWixZQUFPO01BQVA7QUFHQSxDQUFBLFFBQUEsK0NBQUE7d0JBQUE7Q0FFQyxFQUFXLENBQVIsQ0FBQSxDQUFIO0NBRUMsRUFBVSxFQUFSLEdBQUY7UUFKRjtDQUFBLElBSEE7Q0FBQSxFQVNXLENBQVgsRUFBQTtDQVhNLFVBYU47Q0FuQ0QsRUFzQk87Q0F0QlAsQ0FxQ0EsQ0FBVyxDQUFBLEtBQVg7Q0FFQyxPQUFBLHVCQUFBO0NBQUEsRUFBdUIsQ0FBdkIsRUFBWTtDQUFaLFlBQU87TUFBUDtDQUFBLEVBR1UsQ0FBVixHQUFBO0FBRUEsQ0FBQSxRQUFBLCtDQUFBO3dCQUFBO0NBRUMsR0FBRyxDQUFBLENBQUg7QUFFQyxDQUFBLENBQUEsS0FBQSxDQUFBO0NBRUEsZ0JBSkQ7UUFBQTtDQU1BLEdBQUcsQ0FBYSxDQUFoQixDQUFHO0NBRUYsRUFBVSxFQUFSLEVBQUEsQ0FBRjtRQVZGO0NBQUEsSUFMQTtDQWlCQSxFQUEyQyxDQUEzQyxHQUFpQztDQUFqQyxFQUFXLEdBQVgsQ0FBQTtNQWpCQTtDQUZVLFVBcUJWO0NBMURELEVBcUNXO0NBckNYLENBNERBLENBQWMsQ0FBQSxLQUFDLEdBQWY7Q0FFQyxPQUFBLHVCQUFBO0NBQUEsRUFBdUIsQ0FBdkIsRUFBWTtDQUFaLFlBQU87TUFBUDtDQUFBLEVBRVUsQ0FBVixDQUZBLEVBRUE7QUFFQSxDQUFBLFFBQUEsK0NBQUE7d0JBQUE7QUFFUSxDQUFQLEdBQUcsRUFBSCxDQUFBO0NBRUMsR0FBRyxDQUFBLEdBQUg7Q0FFQyxFQUFVLENBQVYsR0FBQSxHQUFBO0NBRUEsa0JBSkQ7VUFGRDtNQUFBLEVBQUE7Q0FVQyxFQUFVLEVBQVIsR0FBRjtRQVpGO0NBQUEsSUFKQTtDQWtCQSxHQUFBLEdBQUE7Q0FBQSxFQUFXLEdBQVg7TUFsQkE7Q0FGYSxVQXNCYjtDQWxGRCxFQTREYztDQTVEZCxDQW9GQSxDQUFpQixNQUFDLE1BQWxCO0NBRUMsT0FBQSx1QkFBQTtDQUFBLEVBQXVCLENBQXZCLEVBQVk7Q0FBWixZQUFPO01BQVA7Q0FBQSxFQUVVLENBQVYsR0FBQTtBQUVBLENBQUEsUUFBQSwrQ0FBQTt3QkFBQTtDQUVDLENBQUcsRUFBQSxDQUFBLENBQUg7QUFFQyxDQUFBLENBQUEsS0FBQSxDQUFBO0NBRUEsZ0JBSkQ7UUFBQTtDQU1BLEdBQUcsQ0FBYSxDQUFoQixDQUFHO0NBRUYsRUFBVSxFQUFSLEVBQUEsQ0FBRjtRQVZGO0NBQUEsSUFKQTtDQWdCQSxFQUFhLENBQWIsR0FBRztDQUVGLEVBQVcsR0FBWCxDQUFBO01BbEJEO0NBRmdCLFVBc0JoQjtDQTFHRCxFQW9GaUI7Q0FwRmpCLENBNEdBLENBQWUsRUFBQSxJQUFDLElBQWhCLEVBQWU7Q0FFZCxPQUFBLGlCQUFBO0NBQUEsRUFBK0IsQ0FBL0IsQ0FBcUIsQ0FBTDtDQUFoQixJQUFBLFFBQU87TUFBUDtDQUFBLEVBRWUsQ0FBZixRQUFBO0NBRkEsR0FJQSxXQUFlO0FBRWYsQ0FBQSxRQUFBLDZDQUFBOytCQUFBO0NBRUMsQ0FBYyxDQUFJLENBQWpCLENBQUQsQ0FBQSxNQUFBO0FBRUEsQ0FGQSxDQUFBLElBRUEsTUFBQTtDQUpELElBTkE7Q0FGYyxVQWNkO0NBMUhELEVBNEdlO0NBNUdmLENBNEhBLENBQWtCLEtBQUEsQ0FBQyxHQUFELElBQWxCO0NBRUMsT0FBQSx5QkFBQTtDQUFBLEVBQU8sQ0FBUDtDQUFBLEVBRU8sQ0FBUDtDQUZBLEVBSUEsQ0FBQSxFQUpBO0NBTUEsRUFBRyxDQUFIO0NBRUMsR0FBQSxFQUFBLEVBQUE7Q0FFQSxZQUFPO01BVlI7QUFhQSxDQUFBLFFBQUEsdUNBQUE7a0JBQUE7Q0FFQyxFQUFPLENBQVAsRUFBQTtDQUFBLEVBRU8sQ0FBUCxFQUFBO0NBRUEsQ0FBc0IsRUFBbkIsRUFBSCxFQUFHLElBQUE7Q0FFRixDQUFtQixJQUFaLEVBQUEsT0FBQTtRQVJUO0NBQUEsSUFiQTtDQUFBLEdBdUJBLElBQUE7Q0F6QmlCLFVBMkJqQjtDQXZKRCxFQTRIa0I7Q0E1SGxCLENBeUpBLENBQWUsRUFBQSxHQUFBLENBQUMsSUFBaEI7Q0FFQyxPQUFBLGdCQUFBO0NBQUEsRUFBQSxDQUFBLEVBQUE7Q0FBQSxFQUVJLENBQUosQ0FGQTtDQUlBLEVBQUcsQ0FBSDtDQUVDLEdBQUEsRUFBQSxFQUFBO0NBRUEsWUFBTztNQVJSO0NBQUEsRUFVUSxDQUFSLENBQUEsR0FWQTtDQUFBLEVBWVksQ0FBWixLQUFBO0NBWkEsR0FjQTs7Ozs7Ozs7Q0FkQSxHQUFBO0NBRmMsVUE0QmQ7Q0FyTEQsRUF5SmU7Q0E3SmhCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJfY29tbW9uID0gcmVxdWlyZSAnLi9fY29tbW9uJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5ID1cblxuXHRfY2xvbmU6IF9jb21tb24uX2Nsb25lQXJyYXkuYmluZCBfY29tbW9uXG5cblx0Y2xvbmU6ICh3aGF0KSAtPlxuXG5cdFx0dGhyb3cgRXJyb3IoXCJgd2hhdGAgaXNuXFwndCBhbiBhcnJheS5cIikgdW5sZXNzIEFycmF5LmlzQXJyYXkgd2hhdFxuXG5cdFx0QF9jbG9uZS5hcHBseSBALCBhcmd1bWVudHNcblxuXHQjIyNcblx0VHJpZXMgdG8gdHVybiBhbnl0aGluZyBpbnRvIGFuIGFycmF5LlxuXHQjIyNcblx0ZnJvbTogKHIpIC0+XG5cblx0XHRBcnJheTo6c2xpY2UuY2FsbCByXG5cblx0IyMjXG5cdENsb25lIG9mIGFuIGFycmF5LiBQcm9wZXJ0aWVzIHdpbGwgYmUgc2hhbGxvdyBjb3BpZXMuXG5cdCMjI1xuXHRzaW1wbGVDbG9uZTogKGEpIC0+XG5cblx0XHRhLnNsaWNlIDBcblxuXHRwbHVjazogKGEsIGkpIC0+XG5cblx0XHRyZXR1cm4gYSBpZiBhLmxlbmd0aCA8IDFcblxuXG5cdFx0Zm9yIHZhbHVlLCBpbmRleCBpbiBhXG5cblx0XHRcdGlmIGluZGV4ID4gaVxuXG5cdFx0XHRcdGFbaW5kZXggLSAxXSA9IGFbaW5kZXhdXG5cblx0XHRhLmxlbmd0aCA9IGEubGVuZ3RoIC0gMVxuXG5cdFx0YVxuXG5cdHBsdWNrSXRlbTogKGEsIGl0ZW0pIC0+XG5cblx0XHRyZXR1cm4gYSBpZiBhLmxlbmd0aCA8IDFcblxuXG5cdFx0cmVtb3ZlZCA9IDBcblxuXHRcdGZvciB2YWx1ZSwgaW5kZXggaW4gYVxuXG5cdFx0XHRpZiB2YWx1ZSBpcyBpdGVtXG5cblx0XHRcdFx0cmVtb3ZlZCsrXG5cblx0XHRcdFx0Y29udGludWVcblxuXHRcdFx0aWYgcmVtb3ZlZCBpc250IDBcblxuXHRcdFx0XHRhW2luZGV4IC0gcmVtb3ZlZF0gPSBhW2luZGV4XVxuXG5cdFx0YS5sZW5ndGggPSBhLmxlbmd0aCAtIHJlbW92ZWQgaWYgcmVtb3ZlZCA+IDBcblxuXHRcdGFcblxuXHRwbHVja09uZUl0ZW06IChhLCBpdGVtKSAtPlxuXG5cdFx0cmV0dXJuIGEgaWYgYS5sZW5ndGggPCAxXG5cblx0XHRyZWFjaGVkID0gbm9cblxuXHRcdGZvciB2YWx1ZSwgaW5kZXggaW4gYVxuXG5cdFx0XHRpZiBub3QgcmVhY2hlZFxuXG5cdFx0XHRcdGlmIHZhbHVlIGlzIGl0ZW1cblxuXHRcdFx0XHRcdHJlYWNoZWQgPSB5ZXNcblxuXHRcdFx0XHRcdGNvbnRpbnVlXG5cblx0XHRcdGVsc2VcblxuXHRcdFx0XHRhW2luZGV4IC0gMV0gPSBhW2luZGV4XVxuXG5cdFx0YS5sZW5ndGggPSBhLmxlbmd0aCAtIDEgaWYgcmVhY2hlZFxuXG5cdFx0YVxuXG5cdHBsdWNrQnlDYWxsYmFjazogKGEsIGNiKSAtPlxuXG5cdFx0cmV0dXJuIGEgaWYgYS5sZW5ndGggPCAxXG5cblx0XHRyZW1vdmVkID0gMFxuXG5cdFx0Zm9yIHZhbHVlLCBpbmRleCBpbiBhXG5cblx0XHRcdGlmIGNiIHZhbHVlLCBpbmRleFxuXG5cdFx0XHRcdHJlbW92ZWQrK1xuXG5cdFx0XHRcdGNvbnRpbnVlXG5cblx0XHRcdGlmIHJlbW92ZWQgaXNudCAwXG5cblx0XHRcdFx0YVtpbmRleCAtIHJlbW92ZWRdID0gYVtpbmRleF1cblxuXHRcdGlmIHJlbW92ZWQgPiAwXG5cblx0XHRcdGEubGVuZ3RoID0gYS5sZW5ndGggLSByZW1vdmVkXG5cblx0XHRhXG5cblx0cGx1Y2tNdWx0aXBsZTogKGFycmF5LCBpbmRleGVzVG9SZW1vdmUpIC0+XG5cblx0XHRyZXR1cm4gYXJyYXkgaWYgYXJyYXkubGVuZ3RoIDwgMVxuXG5cdFx0cmVtb3ZlZFNvRmFyID0gMFxuXG5cdFx0aW5kZXhlc1RvUmVtb3ZlLnNvcnQoKVxuXG5cdFx0Zm9yIGkgaW4gaW5kZXhlc1RvUmVtb3ZlXG5cblx0XHRcdEBwbHVjayBhcnJheSwgaSAtIHJlbW92ZWRTb0ZhclxuXG5cdFx0XHRyZW1vdmVkU29GYXIrK1xuXG5cdFx0YXJyYXlcblxuXHRpbmplY3RCeUNhbGxiYWNrOiAoYSwgdG9JbmplY3QsIHNob3VsZEluamVjdCkgLT5cblxuXHRcdHZhbEEgPSBudWxsXG5cblx0XHR2YWxCID0gbnVsbFxuXG5cdFx0bGVuID0gYS5sZW5ndGhcblxuXHRcdGlmIGxlbiA8IDFcblxuXHRcdFx0YS5wdXNoIHRvSW5qZWN0XG5cblx0XHRcdHJldHVybiBhXG5cblxuXHRcdGZvciB2YWwsIGkgaW4gYVxuXG5cdFx0XHR2YWxBID0gdmFsQlxuXG5cdFx0XHR2YWxCID0gdmFsXG5cblx0XHRcdGlmIHNob3VsZEluamVjdCB2YWxBLCB2YWxCLCB0b0luamVjdFxuXG5cdFx0XHRcdHJldHVybiBhLnNwbGljZSBpLCAwLCB0b0luamVjdFxuXG5cdFx0YS5wdXNoIHRvSW5qZWN0XG5cblx0XHRhXG5cblx0aW5qZWN0SW5JbmRleDogKGEsIGluZGV4LCB0b0luamVjdCkgLT5cblxuXHRcdGxlbiA9IGEubGVuZ3RoXG5cblx0XHRpID0gaW5kZXhcblxuXHRcdGlmIGxlbiA8IDFcblxuXHRcdFx0YS5wdXNoIHRvSW5qZWN0XG5cblx0XHRcdHJldHVybiBhXG5cblx0XHR0b1B1dCA9IHRvSW5qZWN0XG5cblx0XHR0b1B1dE5leHQgPSBudWxsXG5cblx0XHRgZm9yKDsgaSA8PSBsZW47IGkrKyl7XG5cblx0XHRcdHRvUHV0TmV4dCA9IGFbaV07XG5cblx0XHRcdGFbaV0gPSB0b1B1dDtcblxuXHRcdFx0dG9QdXQgPSB0b1B1dE5leHQ7XG5cblx0XHR9YFxuXG5cdFx0IyBhW2ldID0gdG9QdXRcblxuXHRcdG51bGwiXX0=
},{"./_common":20}],22:[function(require,module,exports){
var classic,
  __slice = [].slice;

module.exports = classic = {};

classic.implement = function() {
  var classProto, classReference, desc, member, mixin, mixins, _i, _j, _len;
  mixins = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), classReference = arguments[_i++];
  for (_j = 0, _len = mixins.length; _j < _len; _j++) {
    mixin = mixins[_j];
    classProto = classReference.prototype;
    for (member in mixin.prototype) {
      if (!Object.getOwnPropertyDescriptor(classProto, member)) {
        desc = Object.getOwnPropertyDescriptor(mixin.prototype, member);
        Object.defineProperty(classProto, member, desc);
      }
    }
  }
  return classReference;
};

classic.mix = function() {
  var classProto, classReference, desc, member, mixin, mixins, _i, _j, _len;
  mixins = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), classReference = arguments[_i++];
  classProto = classReference.prototype;
  classReference.__mixinCloners = [];
  classReference.__applyClonersFor = function(instance, args) {
    var cloner, _j, _len, _ref;
    if (args == null) {
      args = null;
    }
    _ref = classReference.__mixinCloners;
    for (_j = 0, _len = _ref.length; _j < _len; _j++) {
      cloner = _ref[_j];
      cloner.apply(instance, args);
    }
  };
  classReference.__mixinInitializers = [];
  classReference.__initMixinsFor = function(instance, args) {
    var initializer, _j, _len, _ref;
    if (args == null) {
      args = null;
    }
    _ref = classReference.__mixinInitializers;
    for (_j = 0, _len = _ref.length; _j < _len; _j++) {
      initializer = _ref[_j];
      initializer.apply(instance, args);
    }
  };
  classReference.__mixinQuitters = [];
  classReference.__applyQuittersFor = function(instance, args) {
    var quitter, _j, _len, _ref;
    if (args == null) {
      args = null;
    }
    _ref = classReference.__mixinQuitters;
    for (_j = 0, _len = _ref.length; _j < _len; _j++) {
      quitter = _ref[_j];
      quitter.apply(instance, args);
    }
  };
  for (_j = 0, _len = mixins.length; _j < _len; _j++) {
    mixin = mixins[_j];
    if (!(mixin.constructor instanceof Function)) {
      throw Error("Mixin should be a function");
    }
    for (member in mixin.prototype) {
      if (member.substr(0, 11) === '__initMixin') {
        classReference.__mixinInitializers.push(mixin.prototype[member]);
        continue;
      } else if (member.substr(0, 11) === '__clonerFor') {
        classReference.__mixinCloners.push(mixin.prototype[member]);
        continue;
      } else if (member.substr(0, 12) === '__quitterFor') {
        classReference.__mixinQuitters.push(mixin.prototype[member]);
        continue;
      }
      if (!Object.getOwnPropertyDescriptor(classProto, member)) {
        desc = Object.getOwnPropertyDescriptor(mixin.prototype, member);
        Object.defineProperty(classProto, member, desc);
      }
    }
  }
  return classReference;
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3NpYy5qcyIsInNvdXJjZVJvb3QiOiIuLlxcLi4iLCJzb3VyY2VzIjpbImNvZmZlZVxcbGliXFxjbGFzc2ljLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLEdBQUE7R0FBQSxlQUFBOztBQUFBLENBQUEsQ0FBQSxDQUFpQixHQUFYLENBQU47O0FBSUEsQ0FKQSxFQUlvQixJQUFiLEVBQVA7Q0FFQyxLQUFBLCtEQUFBO0NBQUEsQ0FGb0I7QUFFcEIsQ0FBQSxNQUFBLHNDQUFBO3dCQUFBO0NBRUMsRUFBYSxDQUFiLEtBQUEsQ0FBQSxJQUEyQjtBQUUzQixDQUFBLEVBQUEsTUFBQSxnQkFBQTtBQUVRLENBQVAsQ0FBbUQsRUFBbkQsRUFBQSxJQUFPLGNBQUE7Q0FFTixDQUFnRCxDQUF6QyxDQUFQLENBQTRDLENBQS9CLEVBQWIsQ0FBTyxlQUFBO0NBQVAsQ0FFa0MsRUFBbEMsRUFBTSxFQUFOLEVBQUEsSUFBQTtRQU5GO0NBQUEsSUFKRDtDQUFBLEVBQUE7Q0FGbUIsUUFjbkI7Q0FkbUI7O0FBZ0JwQixDQXBCQSxFQW9CQSxJQUFPLEVBQU87Q0FFYixLQUFBLCtEQUFBO0NBQUEsQ0FGYztDQUVkLENBQUEsQ0FBYSxNQUFiLENBQUEsSUFBMkI7Q0FBM0IsQ0FFQSxDQUFnQyxXQUFsQjtDQUZkLENBSUEsQ0FBbUMsQ0FBQSxJQUFBLENBQUMsS0FBdEIsR0FBZDtDQUVDLE9BQUEsY0FBQTs7R0FGb0QsR0FBUDtNQUU3QztDQUFBO0NBQUEsUUFBQSxrQ0FBQTt5QkFBQTtDQUVDLENBQXVCLEVBQXZCLENBQUEsQ0FBQSxFQUFBO0NBRkQsSUFGa0M7Q0FKbkMsRUFJbUM7Q0FKbkMsQ0FZQSxDQUFxQyxXQUF2QixLQUFkO0NBWkEsQ0FjQSxDQUFpQyxDQUFBLElBQUEsQ0FBQyxLQUFwQixDQUFkO0NBRUMsT0FBQSxtQkFBQTs7R0FGa0QsR0FBUDtNQUUzQztDQUFBO0NBQUEsUUFBQSxrQ0FBQTs4QkFBQTtDQUVDLENBQTRCLEVBQTVCLENBQUEsQ0FBQSxFQUFBLEdBQVc7Q0FGWixJQUZnQztDQWRqQyxFQWNpQztDQWRqQyxDQXNCQSxDQUFpQyxXQUFuQixDQUFkO0NBdEJBLENBd0JBLENBQW9DLENBQUEsSUFBQSxDQUFDLEtBQXZCLElBQWQ7Q0FFQyxPQUFBLGVBQUE7O0dBRnFELEdBQVA7TUFFOUM7Q0FBQTtDQUFBLFFBQUEsa0NBQUE7MEJBQUE7Q0FFQyxDQUF3QixFQUF4QixDQUFBLENBQUEsQ0FBTyxDQUFQO0NBRkQsSUFGbUM7Q0F4QnBDLEVBd0JvQztBQVFwQyxDQUFBLE1BQUEsc0NBQUE7d0JBQUE7QUFFQyxDQUFBLEdBQUEsQ0FBWSxHQUFaLEdBQU8sQ0FBNkI7Q0FFbkMsSUFBTSxPQUFBLGdCQUFBO01BRlA7QUFJQSxDQUFBLEVBQUEsTUFBQSxnQkFBQTtDQUVDLENBQW9CLEVBQWpCLENBQXdCLENBQTNCLE9BQUE7Q0FFQyxHQUFBLENBQTZDLENBQUcsRUFBaEQsQ0FBZ0QsS0FBbEMsS0FBb0I7Q0FFbEMsZ0JBSkQ7Q0FNZSxDQUFVLEVBQWpCLENBQXdCLENBTmhDLEVBQUEsS0FBQTtDQVFDLEdBQUEsQ0FBd0MsQ0FBRyxFQUEzQyxDQUEyQyxLQUE3QjtDQUVkLGdCQVZEO0NBWWUsQ0FBVSxFQUFqQixDQUF3QixDQVpoQyxFQUFBLE1BQUE7Q0FjQyxHQUFBLENBQXlDLENBQUcsRUFBNUMsQ0FBNEMsS0FBOUIsQ0FBZ0I7Q0FFOUIsZ0JBaEJEO1FBQUE7QUFrQk8sQ0FBUCxDQUFtRCxFQUFuRCxFQUFBLElBQU8sY0FBQTtDQUVOLENBQWdELENBQXpDLENBQVAsQ0FBNEMsQ0FBL0IsRUFBYixDQUFPLGVBQUE7Q0FBUCxDQUVrQyxFQUFsQyxFQUFNLEVBQU4sRUFBQSxJQUFBO1FBeEJGO0NBQUEsSUFORDtDQUFBLEVBaENBO0NBRmEsUUFrRWI7Q0FsRWEiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzaWMgPSB7fVxuXG4jIExpdHRsZSBoZWxwZXIgZm9yIG1peGlucyBmcm9tIENvZmZlZVNjcmlwdCBGQVEsXG4jIGNvdXJ0ZXN5IG9mIFNldGhhdXJ1cyAoaHR0cDovL2dpdGh1Yi5jb20vc2V0aGF1cnVzKVxuY2xhc3NpYy5pbXBsZW1lbnQgPSAobWl4aW5zLi4uLCBjbGFzc1JlZmVyZW5jZSkgLT5cblxuXHRmb3IgbWl4aW4gaW4gbWl4aW5zXG5cblx0XHRjbGFzc1Byb3RvID0gY2xhc3NSZWZlcmVuY2U6OlxuXG5cdFx0Zm9yIG1lbWJlciBvZiBtaXhpbjo6XG5cblx0XHRcdHVubGVzcyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIGNsYXNzUHJvdG8sIG1lbWJlclxuXG5cdFx0XHRcdGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIG1peGluOjosIG1lbWJlclxuXG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBjbGFzc1Byb3RvLCBtZW1iZXIsIGRlc2NcblxuXHRjbGFzc1JlZmVyZW5jZVxuXG5jbGFzc2ljLm1peCA9IChtaXhpbnMuLi4sIGNsYXNzUmVmZXJlbmNlKSAtPlxuXG5cdGNsYXNzUHJvdG8gPSBjbGFzc1JlZmVyZW5jZTo6XG5cblx0Y2xhc3NSZWZlcmVuY2UuX19taXhpbkNsb25lcnMgPSBbXVxuXG5cdGNsYXNzUmVmZXJlbmNlLl9fYXBwbHlDbG9uZXJzRm9yID0gKGluc3RhbmNlLCBhcmdzID0gbnVsbCkgLT5cblxuXHRcdGZvciBjbG9uZXIgaW4gY2xhc3NSZWZlcmVuY2UuX19taXhpbkNsb25lcnNcblxuXHRcdFx0Y2xvbmVyLmFwcGx5IGluc3RhbmNlLCBhcmdzXG5cblx0XHRyZXR1cm5cblxuXHRjbGFzc1JlZmVyZW5jZS5fX21peGluSW5pdGlhbGl6ZXJzID0gW11cblxuXHRjbGFzc1JlZmVyZW5jZS5fX2luaXRNaXhpbnNGb3IgPSAoaW5zdGFuY2UsIGFyZ3MgPSBudWxsKSAtPlxuXG5cdFx0Zm9yIGluaXRpYWxpemVyIGluIGNsYXNzUmVmZXJlbmNlLl9fbWl4aW5Jbml0aWFsaXplcnNcblxuXHRcdFx0aW5pdGlhbGl6ZXIuYXBwbHkgaW5zdGFuY2UsIGFyZ3NcblxuXHRcdHJldHVyblxuXG5cdGNsYXNzUmVmZXJlbmNlLl9fbWl4aW5RdWl0dGVycyA9IFtdXG5cblx0Y2xhc3NSZWZlcmVuY2UuX19hcHBseVF1aXR0ZXJzRm9yID0gKGluc3RhbmNlLCBhcmdzID0gbnVsbCkgLT5cblxuXHRcdGZvciBxdWl0dGVyIGluIGNsYXNzUmVmZXJlbmNlLl9fbWl4aW5RdWl0dGVyc1xuXG5cdFx0XHRxdWl0dGVyLmFwcGx5IGluc3RhbmNlLCBhcmdzXG5cblx0XHRyZXR1cm5cblxuXHRmb3IgbWl4aW4gaW4gbWl4aW5zXG5cblx0XHR1bmxlc3MgbWl4aW4uY29uc3RydWN0b3IgaW5zdGFuY2VvZiBGdW5jdGlvblxuXG5cdFx0XHR0aHJvdyBFcnJvciBcIk1peGluIHNob3VsZCBiZSBhIGZ1bmN0aW9uXCJcblxuXHRcdGZvciBtZW1iZXIgb2YgbWl4aW46OlxuXG5cdFx0XHRpZiBtZW1iZXIuc3Vic3RyKDAsIDExKSBpcyAnX19pbml0TWl4aW4nXG5cblx0XHRcdFx0Y2xhc3NSZWZlcmVuY2UuX19taXhpbkluaXRpYWxpemVycy5wdXNoIG1peGluOjpbbWVtYmVyXVxuXG5cdFx0XHRcdGNvbnRpbnVlXG5cblx0XHRcdGVsc2UgaWYgbWVtYmVyLnN1YnN0cigwLCAxMSkgaXMgJ19fY2xvbmVyRm9yJ1xuXG5cdFx0XHRcdGNsYXNzUmVmZXJlbmNlLl9fbWl4aW5DbG9uZXJzLnB1c2ggbWl4aW46OlttZW1iZXJdXG5cblx0XHRcdFx0Y29udGludWVcblxuXHRcdFx0ZWxzZSBpZiBtZW1iZXIuc3Vic3RyKDAsIDEyKSBpcyAnX19xdWl0dGVyRm9yJ1xuXG5cdFx0XHRcdGNsYXNzUmVmZXJlbmNlLl9fbWl4aW5RdWl0dGVycy5wdXNoIG1peGluOjpbbWVtYmVyXVxuXG5cdFx0XHRcdGNvbnRpbnVlXG5cblx0XHRcdHVubGVzcyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIGNsYXNzUHJvdG8sIG1lbWJlclxuXG5cdFx0XHRcdGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIG1peGluOjosIG1lbWJlclxuXG5cdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBjbGFzc1Byb3RvLCBtZW1iZXIsIGRlc2NcblxuXHRjbGFzc1JlZmVyZW5jZSJdfQ==
},{}],23:[function(require,module,exports){
var object, _common,
  __hasProp = {}.hasOwnProperty;

_common = require('./_common');

module.exports = object = {
  isBareObject: _common.isBareObject.bind(_common),
  /*
  	if object is an instance of a class
  */

  isInstance: function(what) {
    return !this.isBareObject(what);
  },
  /*
  	Alias to _common.typeOf
  */

  typeOf: _common.typeOf.bind(_common),
  /*
  	Alias to _common.clone
  */

  clone: _common.clone.bind(_common),
  /*
  	Empties an object of its properties.
  */

  empty: function(o) {
    var prop;
    for (prop in o) {
      if (o.hasOwnProperty(prop)) {
        delete o[prop];
      }
    }
    return o;
  },
  /*
  	Empties an object. Doesn't check for hasOwnProperty, so it's a tiny
  	bit faster. Use it for plain objects.
  */

  fastEmpty: function(o) {
    var property;
    for (property in o) {
      delete o[property];
    }
    return o;
  },
  /*
  	Overrides values fomr `newValues` on `base`, as long as they
  	already exist in base.
  */

  overrideOnto: function(base, newValues) {
    var key, newVal, oldVal;
    if (!this.isBareObject(newValues) || !this.isBareObject(base)) {
      return base;
    }
    for (key in base) {
      oldVal = base[key];
      newVal = newValues[key];
      if (newVal === void 0) {
        continue;
      }
      if (typeof newVal !== 'object' || this.isInstance(newVal)) {
        base[key] = this.clone(newVal);
      } else {
        if (typeof oldVal !== 'object' || this.isInstance(oldVal)) {
          base[key] = this.clone(newVal);
        } else {
          this.overrideOnto(oldVal, newVal);
        }
      }
    }
    return base;
  },
  /*
  	Takes a clone of 'base' and runs #overrideOnto on it
  */

  override: function(base, newValues) {
    return this.overrideOnto(this.clone(base), newValues);
  },
  append: function(base, toAppend) {
    return this.appendOnto(this.clone(base), toAppend);
  },
  appendOnto: function(base, toAppend) {
    var key, newVal, oldVal;
    if (!this.isBareObject(toAppend) || !this.isBareObject(base)) {
      return base;
    }
    for (key in toAppend) {
      if (!__hasProp.call(toAppend, key)) continue;
      newVal = toAppend[key];
      if (newVal === void 0) {
        continue;
      }
      if (typeof newVal !== 'object' || this.isInstance(newVal)) {
        base[key] = newVal;
      } else {
        oldVal = base[key];
        if (typeof oldVal !== 'object' || this.isInstance(oldVal)) {
          base[key] = this.clone(newVal);
        } else {
          this.appendOnto(oldVal, newVal);
        }
      }
    }
    return base;
  },
  groupProps: function(obj, groups) {
    var def, defs, grouped, key, name, shouldAdd, val, _i, _len;
    grouped = {};
    for (name in groups) {
      defs = groups[name];
      grouped[name] = {};
    }
    grouped['rest'] = {};
    top: //;
    for (key in obj) {
      val = obj[key];
      shouldAdd = false;
      for (name in groups) {
        defs = groups[name];
        if (!Array.isArray(defs)) {
          defs = [defs];
        }
        for (_i = 0, _len = defs.length; _i < _len; _i++) {
          def = defs[_i];
          if (typeof def === 'string') {
            if (key === def) {
              shouldAdd = true;
            }
          } else if (def instanceof RegExp) {
            if (def.test(key)) {
              shouldAdd = true;
            }
          } else if (def instanceof Function) {
            if (def(key)) {
              shouldAdd = true;
            }
          } else {
            throw Error('Group definitions must either\
						be strings, regexes, or functions.');
          }
          if (shouldAdd) {
            grouped[name][key] = val;
            continue top;
          }
        }
      }
      grouped['rest'][key] = val;
    }
    return grouped;
  }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0LmpzIiwic291cmNlUm9vdCI6Ii4uXFwuLiIsInNvdXJjZXMiOlsiY29mZmVlXFxsaWJcXG9iamVjdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxXQUFBO0dBQUEsMEJBQUE7O0FBQUEsQ0FBQSxFQUFVLElBQVYsSUFBVTs7QUFFVixDQUZBLEVBRWlCLEdBQVgsQ0FBTjtDQUVDLENBQUEsRUFBYyxHQUFPLEtBQXJCO0NBRUE7OztDQUZBO0NBQUEsQ0FLQSxDQUFZLENBQUEsS0FBQyxDQUFiO0FBRUssQ0FBSixHQUFLLE9BQUwsQ0FBSTtDQVBMLEVBS1k7Q0FJWjs7O0NBVEE7Q0FBQSxDQVlBLEVBQVEsRUFBUixDQUFlO0NBRWY7OztDQWRBO0NBQUEsQ0FpQkEsRUFBTyxDQUFQLEVBQWM7Q0FFZDs7O0NBbkJBO0NBQUEsQ0FzQkEsQ0FBTyxFQUFQLElBQVE7Q0FFUCxHQUFBLElBQUE7QUFBQSxDQUFBLEVBQUEsTUFBQTtDQUVDLEdBQWtCLEVBQWxCLFFBQWtCO0FBQWxCLENBQUEsR0FBUyxFQUFULEVBQUE7UUFGRDtDQUFBLElBQUE7Q0FGTSxVQU1OO0NBNUJELEVBc0JPO0NBUVA7Ozs7Q0E5QkE7Q0FBQSxDQWtDQSxDQUFXLE1BQVg7Q0FFQyxPQUFBO0FBQUEsQ0FBQSxFQUFBLE1BQUEsSUFBQTtBQUFBLENBQUEsS0FBQSxFQUFTO0NBQVQsSUFBQTtDQUZVLFVBSVY7Q0F0Q0QsRUFrQ1c7Q0FNWDs7OztDQXhDQTtDQUFBLENBNENBLENBQWMsQ0FBQSxLQUFDLEdBQWY7Q0FFQyxPQUFBLFdBQUE7QUFBbUIsQ0FBbkIsR0FBQSxLQUFtQixHQUFBO0NBQW5CLEdBQUEsU0FBTztNQUFQO0FBRUEsQ0FBQSxRQUFBLEVBQUE7MEJBQUE7Q0FFQyxFQUFTLEdBQVQsR0FBbUI7Q0FFbkIsR0FBWSxDQUFVLENBQXRCO0NBQUEsZ0JBQUE7UUFGQTtBQUlHLENBQUgsR0FBRyxDQUFtQixDQUF0QixFQUFHLEVBQStCO0NBRWpDLEVBQUssQ0FBQSxDQUFPLENBQUEsRUFBWjtNQUZELEVBQUE7QUFPSSxDQUFILEdBQUcsQ0FBbUIsQ0FBbkIsRUFBSCxFQUFrQztDQUVqQyxFQUFLLENBQUEsQ0FBTyxDQUFBLElBQVo7TUFGRCxJQUFBO0NBTUMsQ0FBc0IsRUFBckIsRUFBRCxJQUFBLEVBQUE7VUFiRjtRQU5EO0NBQUEsSUFGQTtDQUZhLFVBd0JiO0NBcEVELEVBNENjO0NBMEJkOzs7Q0F0RUE7Q0FBQSxDQXlFQSxDQUFVLENBQUEsSUFBVixDQUFXO0NBRVQsQ0FBMkIsRUFBM0IsQ0FBYSxJQUFkLEVBQUEsQ0FBQTtDQTNFRCxFQXlFVTtDQXpFVixDQTZFQSxDQUFRLENBQUEsRUFBUixFQUFRLENBQUM7Q0FFUCxDQUF5QixFQUF6QixDQUFXLEdBQVosRUFBQSxDQUFBO0NBL0VELEVBNkVRO0NBN0VSLENBa0ZBLENBQVksQ0FBQSxJQUFBLENBQUMsQ0FBYjtDQUVDLE9BQUEsV0FBQTtBQUFtQixDQUFuQixHQUFBLElBQW1CLElBQUE7Q0FBbkIsR0FBQSxTQUFPO01BQVA7QUFFQSxDQUFBLFFBQUEsTUFBQTs7OEJBQUE7Q0FFQyxHQUFnQixDQUFZLENBQTVCO0NBQUEsZ0JBQUE7UUFBQTtBQUVHLENBQUgsR0FBRyxDQUFtQixDQUF0QixFQUFHLEVBQStCO0NBRWpDLEVBQUssQ0FBQSxFQUFMLEVBQUE7TUFGRCxFQUFBO0NBUUMsRUFBUyxDQUFLLEVBQWQsRUFBQTtBQUVHLENBQUgsR0FBRyxDQUFtQixDQUFuQixFQUFILEVBQWtDO0NBRWpDLEVBQUssQ0FBQSxDQUFPLENBQUEsSUFBWjtNQUZELElBQUE7Q0FNQyxDQUFvQixFQUFuQixFQUFELElBQUE7VUFoQkY7UUFKRDtDQUFBLElBRkE7Q0FGVyxVQTBCWDtDQTVHRCxFQWtGWTtDQWxGWixDQStHQSxDQUFZLEdBQUEsR0FBQyxDQUFiO0NBRUMsT0FBQSwrQ0FBQTtDQUFBLENBQUEsQ0FBVSxDQUFWLEdBQUE7QUFFQSxDQUFBLFFBQUEsS0FBQTsyQkFBQTtDQUVDLENBQUEsQ0FBZ0IsQ0FBUixFQUFSLENBQVE7Q0FGVCxJQUZBO0NBQUEsQ0FBQSxDQU1rQixDQUFsQixFQUFRLENBQUE7Q0FOUixHQVFBLEdBUkE7QUFTQSxDQUFBLFFBQUEsQ0FBQTtzQkFBQTtDQUVDLEVBQVksRUFBWixDQUFBLEdBQUE7QUFFQSxDQUFBLFVBQUEsR0FBQTs2QkFBQTtBQUVRLENBQVAsR0FBQSxDQUFZLEVBQUwsQ0FBUDtDQUVDLEVBQU8sQ0FBUCxNQUFBO1VBRkQ7QUFJQSxDQUFBLFlBQUEsOEJBQUE7MEJBQUE7QUFFSSxDQUFILEVBQUcsQ0FBQSxDQUFjLENBQWQsRUFBSCxFQUFBO0NBRUMsRUFBRyxDQUFBLENBQU8sT0FBVjtDQUVDLEVBQVksQ0FBWixLQUFBLEtBQUE7Y0FKRjtHQU1RLENBQUEsRUFOUixNQUFBO0NBUUMsRUFBTSxDQUFILFFBQUg7Q0FFQyxFQUFZLENBQVosS0FBQSxLQUFBO2NBVkY7R0FZUSxDQUFBLEVBWlIsRUFBQSxJQUFBO0NBY0MsRUFBRyxDQUFBLFFBQUg7Q0FFQyxFQUFZLENBQVosS0FBQSxLQUFBO2NBaEJGO01BQUEsTUFBQTtDQW9CQyxJQUFNLGFBQUE7Q0FBTix5Q0FBTTtZQXBCUDtDQXVCQSxHQUFHLEtBQUgsQ0FBQTtDQUVDLEVBQWMsQ0FBTixHQUFBLEtBQVI7Q0FBQSxXQUVBO1lBN0JGO0NBQUEsUUFORDtDQUFBLE1BRkE7Q0FBQSxFQXVDZ0IsR0FBaEIsQ0FBUTtDQXpDVCxJQVRBO0NBRlcsVUFzRFg7Q0FyS0QsRUErR1k7Q0FuSGIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIl9jb21tb24gPSByZXF1aXJlICcuL19jb21tb24nXG5cbm1vZHVsZS5leHBvcnRzID0gb2JqZWN0ID1cblxuXHRpc0JhcmVPYmplY3Q6IF9jb21tb24uaXNCYXJlT2JqZWN0LmJpbmQgX2NvbW1vblxuXG5cdCMjI1xuXHRpZiBvYmplY3QgaXMgYW4gaW5zdGFuY2Ugb2YgYSBjbGFzc1xuXHQjIyNcblx0aXNJbnN0YW5jZTogKHdoYXQpIC0+XG5cblx0XHRub3QgQGlzQmFyZU9iamVjdCB3aGF0XG5cblx0IyMjXG5cdEFsaWFzIHRvIF9jb21tb24udHlwZU9mXG5cdCMjI1xuXHR0eXBlT2Y6IF9jb21tb24udHlwZU9mLmJpbmQgX2NvbW1vblxuXG5cdCMjI1xuXHRBbGlhcyB0byBfY29tbW9uLmNsb25lXG5cdCMjI1xuXHRjbG9uZTogX2NvbW1vbi5jbG9uZS5iaW5kIF9jb21tb25cblxuXHQjIyNcblx0RW1wdGllcyBhbiBvYmplY3Qgb2YgaXRzIHByb3BlcnRpZXMuXG5cdCMjI1xuXHRlbXB0eTogKG8pIC0+XG5cblx0XHRmb3IgcHJvcCBvZiBvXG5cblx0XHRcdGRlbGV0ZSBvW3Byb3BdIGlmIG8uaGFzT3duUHJvcGVydHkgcHJvcFxuXG5cdFx0b1xuXG5cdCMjI1xuXHRFbXB0aWVzIGFuIG9iamVjdC4gRG9lc24ndCBjaGVjayBmb3IgaGFzT3duUHJvcGVydHksIHNvIGl0J3MgYSB0aW55XG5cdGJpdCBmYXN0ZXIuIFVzZSBpdCBmb3IgcGxhaW4gb2JqZWN0cy5cblx0IyMjXG5cdGZhc3RFbXB0eTogKG8pIC0+XG5cblx0XHRkZWxldGUgb1twcm9wZXJ0eV0gZm9yIHByb3BlcnR5IG9mIG9cblxuXHRcdG9cblxuXHQjIyNcblx0T3ZlcnJpZGVzIHZhbHVlcyBmb21yIGBuZXdWYWx1ZXNgIG9uIGBiYXNlYCwgYXMgbG9uZyBhcyB0aGV5XG5cdGFscmVhZHkgZXhpc3QgaW4gYmFzZS5cblx0IyMjXG5cdG92ZXJyaWRlT250bzogKGJhc2UsIG5ld1ZhbHVlcykgLT5cblxuXHRcdHJldHVybiBiYXNlIGlmIG5vdCBAaXNCYXJlT2JqZWN0KG5ld1ZhbHVlcykgb3Igbm90IEBpc0JhcmVPYmplY3QoYmFzZSlcblxuXHRcdGZvciBrZXksIG9sZFZhbCBvZiBiYXNlXG5cblx0XHRcdG5ld1ZhbCA9IG5ld1ZhbHVlc1trZXldXG5cblx0XHRcdGNvbnRpbnVlIGlmIG5ld1ZhbCBpcyB1bmRlZmluZWRcblxuXHRcdFx0aWYgdHlwZW9mIG5ld1ZhbCBpc250ICdvYmplY3QnIG9yIEBpc0luc3RhbmNlIG5ld1ZhbFxuXG5cdFx0XHRcdGJhc2Vba2V5XSA9IEBjbG9uZSBuZXdWYWxcblxuXHRcdFx0IyBuZXdWYWwgaXMgYSBwbGFpbiBvYmplY3Rcblx0XHRcdGVsc2VcblxuXHRcdFx0XHRpZiB0eXBlb2Ygb2xkVmFsIGlzbnQgJ29iamVjdCcgb3IgQGlzSW5zdGFuY2Ugb2xkVmFsXG5cblx0XHRcdFx0XHRiYXNlW2tleV0gPSBAY2xvbmUgbmV3VmFsXG5cblx0XHRcdFx0ZWxzZVxuXG5cdFx0XHRcdFx0QG92ZXJyaWRlT250byBvbGRWYWwsIG5ld1ZhbFxuXHRcdGJhc2VcblxuXHQjIyNcblx0VGFrZXMgYSBjbG9uZSBvZiAnYmFzZScgYW5kIHJ1bnMgI292ZXJyaWRlT250byBvbiBpdFxuXHQjIyNcblx0b3ZlcnJpZGU6IChiYXNlLCBuZXdWYWx1ZXMpIC0+XG5cblx0XHRAb3ZlcnJpZGVPbnRvIEBjbG9uZShiYXNlKSwgbmV3VmFsdWVzXG5cblx0YXBwZW5kOiAoYmFzZSwgdG9BcHBlbmQpIC0+XG5cblx0XHRAYXBwZW5kT250byBAY2xvbmUoYmFzZSksIHRvQXBwZW5kXG5cblx0IyBEZWVwIGFwcGVuZHMgdmFsdWVzIGZyb20gYHRvQXBwZW5kYCB0byBgYmFzZWBcblx0YXBwZW5kT250bzogKGJhc2UsIHRvQXBwZW5kKSAtPlxuXG5cdFx0cmV0dXJuIGJhc2UgaWYgbm90IEBpc0JhcmVPYmplY3QodG9BcHBlbmQpIG9yIG5vdCBAaXNCYXJlT2JqZWN0KGJhc2UpXG5cblx0XHRmb3Igb3duIGtleSwgbmV3VmFsIG9mIHRvQXBwZW5kXG5cblx0XHRcdGNvbnRpbnVlIHVubGVzcyBuZXdWYWwgaXNudCB1bmRlZmluZWRcblxuXHRcdFx0aWYgdHlwZW9mIG5ld1ZhbCBpc250ICdvYmplY3QnIG9yIEBpc0luc3RhbmNlIG5ld1ZhbFxuXG5cdFx0XHRcdGJhc2Vba2V5XSA9IG5ld1ZhbFxuXG5cdFx0XHRlbHNlXG5cblx0XHRcdFx0IyBuZXdWYWwgaXMgYSBiYXJlIG9iamVjdFxuXG5cdFx0XHRcdG9sZFZhbCA9IGJhc2Vba2V5XVxuXG5cdFx0XHRcdGlmIHR5cGVvZiBvbGRWYWwgaXNudCAnb2JqZWN0JyBvciBAaXNJbnN0YW5jZSBvbGRWYWxcblxuXHRcdFx0XHRcdGJhc2Vba2V5XSA9IEBjbG9uZSBuZXdWYWxcblxuXHRcdFx0XHRlbHNlXG5cblx0XHRcdFx0XHRAYXBwZW5kT250byBvbGRWYWwsIG5ld1ZhbFxuXG5cdFx0YmFzZVxuXG5cdCMgR3JvdXBzXG5cdGdyb3VwUHJvcHM6IChvYmosIGdyb3VwcykgLT5cblxuXHRcdGdyb3VwZWQgPSB7fVxuXG5cdFx0Zm9yIG5hbWUsIGRlZnMgb2YgZ3JvdXBzXG5cblx0XHRcdGdyb3VwZWRbbmFtZV0gPSB7fVxuXG5cdFx0Z3JvdXBlZFsncmVzdCddID0ge31cblxuXHRcdGB0b3A6IC8vYFxuXHRcdGZvciBrZXksIHZhbCBvZiBvYmpcblxuXHRcdFx0c2hvdWxkQWRkID0gbm9cblxuXHRcdFx0Zm9yIG5hbWUsIGRlZnMgb2YgZ3JvdXBzXG5cblx0XHRcdFx0dW5sZXNzIEFycmF5LmlzQXJyYXkgZGVmc1xuXG5cdFx0XHRcdFx0ZGVmcyA9IFtkZWZzXVxuXG5cdFx0XHRcdGZvciBkZWYgaW4gZGVmc1xuXG5cdFx0XHRcdFx0aWYgdHlwZW9mIGRlZiBpcyAnc3RyaW5nJ1xuXG5cdFx0XHRcdFx0XHRpZiBrZXkgaXMgZGVmXG5cblx0XHRcdFx0XHRcdFx0c2hvdWxkQWRkID0geWVzXG5cblx0XHRcdFx0XHRlbHNlIGlmIGRlZiBpbnN0YW5jZW9mIFJlZ0V4cFxuXG5cdFx0XHRcdFx0XHRpZiBkZWYudGVzdCBrZXlcblxuXHRcdFx0XHRcdFx0XHRzaG91bGRBZGQgPSB5ZXNcblxuXHRcdFx0XHRcdGVsc2UgaWYgZGVmIGluc3RhbmNlb2YgRnVuY3Rpb25cblxuXHRcdFx0XHRcdFx0aWYgZGVmIGtleVxuXG5cdFx0XHRcdFx0XHRcdHNob3VsZEFkZCA9IHllc1xuXG5cdFx0XHRcdFx0ZWxzZVxuXG5cdFx0XHRcdFx0XHR0aHJvdyBFcnJvciAnR3JvdXAgZGVmaW5pdGlvbnMgbXVzdCBlaXRoZXJcblx0XHRcdFx0XHRcdGJlIHN0cmluZ3MsIHJlZ2V4ZXMsIG9yIGZ1bmN0aW9ucy4nXG5cblx0XHRcdFx0XHRpZiBzaG91bGRBZGRcblxuXHRcdFx0XHRcdFx0Z3JvdXBlZFtuYW1lXVtrZXldID0gdmFsXG5cblx0XHRcdFx0XHRcdGBjb250aW51ZSB0b3BgXG5cblx0XHRcdGdyb3VwZWRbJ3Jlc3QnXVtrZXldID0gdmFsXG5cblx0XHRncm91cGVkIl19
},{"./_common":20}],24:[function(require,module,exports){
var utila;

module.exports = utila = {
  array: require('./array'),
  classic: require('./classic'),
  object: require('./object')
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbGEuanMiLCJzb3VyY2VSb290IjoiLi5cXC4uIiwic291cmNlcyI6WyJjb2ZmZWVcXGxpYlxcdXRpbGEuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsQ0FBQTs7QUFBQSxDQUFBLEVBQWlCLEVBQUEsQ0FBWCxDQUFOO0NBRUMsQ0FBQSxHQUFBLEVBQU8sRUFBQTtDQUFQLENBQ0EsS0FBQSxJQUFTO0NBRFQsQ0FFQSxJQUFBLENBQVEsR0FBQTtDQUpULENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHV0aWxhID1cblxuXHRhcnJheTogcmVxdWlyZSAnLi9hcnJheSdcblx0Y2xhc3NpYzogcmVxdWlyZSAnLi9jbGFzc2ljJ1xuXHRvYmplY3Q6IHJlcXVpcmUgJy4vb2JqZWN0JyJdfQ==
},{"./array":21,"./classic":22,"./object":23}],25:[function(require,module,exports){
var Chain_, Foxie, Styles_, Timing, Timing_, array, classic, lazyValues, object, timing, _ref;

Chain_ = require('./el/mixin/Chain_');

timing = require('./timing');

Styles_ = require('./el/mixin/Styles_');

Timing_ = require('./el/mixin/Timing_');

lazyValues = require('./utility/lazyValues');

_ref = require('utila'), classic = _ref.classic, object = _ref.object, array = _ref.array;

Timing = require('raf-timing');

module.exports = classic.mix(Styles_, Chain_, Timing_, Foxie = (function() {
  var self;

  self = Foxie;

  Foxie.Timing = Timing;

  Foxie._defaultContainer = null;

  Foxie._getDefaultContainer = function() {
    if (this._defaultContainer != null) {
      return this._defaultContainer;
    } else {
      return document.body;
    }
  };

  Foxie._ = function(fn) {
    return lazyValues.returnLazily(fn);
  };

  function Foxie(node) {
    var _this = this;
    this.node = node;
    if (!(this.node instanceof Element)) {
      throw Error("node must be an HTML element.");
    }
    if (this._shouldCloneInnerHTML == null) {
      this._shouldCloneInnerHTML = false;
    }
    self.__initMixinsFor(this);
    this._beenAppended = false;
    this._parent = null;
    this._children = [];
    timing.nextTick(function() {
      if (!_this._beenAppended) {
        if ((_this.node.parentselfement == null) && _this.node.tagName !== 'BODY') {
          return _this.putIn(self._getDefaultContainer());
        } else {
          return _this._beenAppended = true;
        }
      }
    });
  }

  Foxie.prototype.clone = function(newself) {
    var child, key, newNode, parent, val, _i, _len, _ref1, _ref2, _ref3,
      _this = this;
    if (newself == null) {
      newself = Object.create(this.constructor.prototype);
    }
    this._doUpdate();
    newNode = this.node.cloneNode();
    newself.node = newNode;
    newself._children = [];
    if (this._shouldCloneInnerHTML) {
      newself.node.innerHTML = this.node.innerHTML;
    } else {
      _ref1 = this._children;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        child = _ref1[_i];
        child.clone().putIn(newself);
      }
    }
    newself._parent = null;
    if (this._parent != null) {
      parent = this._parent;
    } else {
      parent = (_ref2 = (_ref3 = this.node._parent) != null ? _ref3 : this.node.parentselfement) != null ? _ref2 : null;
    }
    newself._beenAppended = false;
    timing.afterFrame(function() {
      if (!newself._beenAppended) {
        newself.putIn(parent);
      }
    });
    self.__applyClonersFor(this, [newself]);
    for (key in this) {
      val = this[key];
      if (newself[key] !== void 0) {
        continue;
      }
      if (this.hasOwnProperty(key)) {
        newself[key] = object.clone(val, true);
      }
    }
    return newself;
  };

  Foxie.prototype._notYourChildAnymore = function(el) {
    if (!(el instanceof self)) {
      throw Error("`el` must be an instance of `self`");
    }
    array.pluckItem(this._children, el);
    return this;
  };

  Foxie.prototype.putIn = function(el) {
    if (el == null) {
      el = self._getDefaultContainer();
    }
    if (this._parent != null) {
      this._parent._notYourChildAnymore(this);
    }
    if (el instanceof self) {
      el._append(this);
      this._parent = el;
    } else {
      el.appendChild(this.node);
      this._parent = null;
    }
    this._beenAppended = true;
    return this;
  };

  Foxie.prototype.takeOutOfParent = function() {
    if (this._parent != null) {
      this._parent._notYourChildAnymore(this);
    }
    this._parent = null;
    this._beenAppended = false;
    return this;
  };

  Foxie.prototype.beDefaultContainer = function() {
    self._defaultContainer = this;
    return this;
  };

  Foxie.prototype._append = function(el) {
    var node;
    if (el instanceof self) {
      node = el.node;
      this._children.push(el);
    } else {
      node = el;
    }
    this.node.appendChild(node);
    return this;
  };

  Foxie.prototype.remove = function() {
    if (this._parent != null) {
      this._parent._notYourChildAnymore(this);
    }
    if (this.node.parentNode != null) {
      this.node.parentNode.removeChild(this.node);
    }
    return null;
  };

  Foxie.prototype.quit = function() {
    var child, p, _i, _len, _ref1;
    p = this.node.parentNode;
    if (p != null) {
      p.removeChild(this.node);
    }
    _ref1 = this._children;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      child = _ref1[_i];
      child.quit();
    }
    self.__applyQuittersFor(this);
  };

  Foxie.prototype.each = function(cb) {
    var child, counter, els, i, _interface,
      _this = this;
    if (cb == null) {
      cb = null;
    }
    if (cb instanceof Function) {
      i = 0;
      child = null;
      counter = -1;
      while (true) {
        counter++;
        if (child === this._children[i]) {
          i++;
        }
        child = this._children[i];
        if (child == null) {
          break;
        }
        cb.call(this, child, counter);
      }
      return this;
    }
    _interface = this._getNewInterface();
    els = this._children;
    if (els.length !== 0) {
      timing.afterFrame(function() {
        var el, _i, _len;
        for (_i = 0, _len = els.length; _i < _len; _i++) {
          el = els[_i];
          _this._getMethodChain().run(_interface, el);
        }
        return null;
      });
    }
    return _interface;
  };

  return Foxie;

})());

},{"./el/mixin/Chain_":26,"./el/mixin/Styles_":27,"./el/mixin/Timing_":28,"./timing":41,"./utility/lazyValues":44,"raf-timing":9,"utila":24}],26:[function(require,module,exports){
var Chain_, MethodChain;

MethodChain = require('method-chain');

module.exports = Chain_ = (function() {
  function Chain_() {}

  Chain_.prototype._getMethodChain = function() {
    var fn, key;
    if (this.constructor.__methodChain == null) {
      this.constructor.__methodChain = new MethodChain;
      for (key in this) {
        fn = this[key];
        if (key[0] === '_' || key === 'constructor') {
          continue;
        }
        if (!(fn instanceof Function)) {
          continue;
        }
        this.constructor.__methodChain.addMethod(key);
      }
    }
    return this.constructor.__methodChain;
  };

  Chain_.prototype._getNewInterface = function() {
    return this._getMethodChain().getInterface();
  };

  Chain_.prototype._eventEnabledMethod = function(args, runCallback) {
    var fn, _interface, _ref,
      _this = this;
    fn = (_ref = args[0]) != null ? _ref : null;
    if (fn) {
      runCallback(function() {
        return fn.apply(_this, arguments);
      });
      return this;
    } else {
      _interface = this._getNewInterface();
      runCallback(function() {
        return _this._getMethodChain().run(_interface, _this);
      });
      return _interface;
    }
  };

  return Chain_;

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hhaW5fLmpzIiwic291cmNlUm9vdCI6Ii4uXFwuLlxcLi5cXC4uIiwic291cmNlcyI6WyJjb2ZmZWVcXGxpYlxcZWxcXG1peGluXFxDaGFpbl8uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsZUFBQTs7QUFBQSxDQUFBLEVBQWMsSUFBQSxJQUFkLEdBQWM7O0FBRWQsQ0FGQSxFQUV1QixHQUFqQixDQUFOO0NBRUM7O0NBQUEsRUFBaUIsTUFBQSxNQUFqQjtDQUVDLE1BQUEsQ0FBQTtDQUFBLEdBQUEsa0NBQUE7QUFFOEIsQ0FBN0IsRUFBNkIsQ0FBNUIsRUFBRCxLQUFZLEVBQVo7QUFFQSxDQUFBLFVBQUE7d0JBQUE7Q0FFQyxFQUFnQixDQUFKLENBQVUsR0FBdEIsS0FBQTtDQUFBLGtCQUFBO1VBQUE7QUFFQSxDQUFBLENBQWdCLEVBQWhCLElBQUEsSUFBOEI7Q0FBOUIsa0JBQUE7VUFGQTtDQUFBLEVBSUEsQ0FBQyxJQUFELENBQUEsRUFBWSxFQUFjO0NBTjNCLE1BSkQ7TUFBQTtDQVlDLEdBQUEsT0FBRDtDQWRELEVBQWlCOztDQUFqQixFQWdCa0IsTUFBQSxPQUFsQjtDQUVFLEdBQUEsT0FBRCxDQUFBLEdBQUE7Q0FsQkQsRUFnQmtCOztDQWhCbEIsQ0FvQjRCLENBQVAsQ0FBQSxLQUFDLEVBQUQsUUFBckI7Q0FFQyxPQUFBLFlBQUE7T0FBQSxLQUFBO0NBQUEsQ0FBQSxDQUFlLENBQWY7Q0FFQSxDQUFBLEVBQUE7Q0FFQyxFQUFZLEdBQVosR0FBWSxFQUFaO0NBRUksQ0FBRCxHQUFGLElBQUEsTUFBQTtDQUZELE1BQVk7Q0FJWixHQUFBLFNBQU87TUFOUjtDQVVDLEVBQWEsQ0FBQyxFQUFkLElBQUEsTUFBYTtDQUFiLEVBRVksR0FBWixHQUFZLEVBQVo7Q0FHRSxDQUFrQyxDQUFuQyxFQUFDLEtBQUQsS0FBQTtDQUhELE1BQVk7Q0FLWixTQUFBLEdBQU87TUFyQlk7Q0FwQnJCLEVBb0JxQjs7Q0FwQnJCOztDQUpEIiwic291cmNlc0NvbnRlbnQiOlsiTWV0aG9kQ2hhaW4gPSByZXF1aXJlICdtZXRob2QtY2hhaW4nXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQ2hhaW5fXG5cblx0X2dldE1ldGhvZENoYWluOiAtPlxuXG5cdFx0dW5sZXNzIEBjb25zdHJ1Y3Rvci5fX21ldGhvZENoYWluP1xuXG5cdFx0XHRAY29uc3RydWN0b3IuX19tZXRob2RDaGFpbiA9IG5ldyBNZXRob2RDaGFpblxuXG5cdFx0XHRmb3Iga2V5LCBmbiBvZiBAXG5cblx0XHRcdFx0Y29udGludWUgaWYga2V5WzBdIGlzICdfJyBvciBrZXkgaXMgJ2NvbnN0cnVjdG9yJ1xuXG5cdFx0XHRcdGNvbnRpbnVlIHVubGVzcyBmbiBpbnN0YW5jZW9mIEZ1bmN0aW9uXG5cblx0XHRcdFx0QGNvbnN0cnVjdG9yLl9fbWV0aG9kQ2hhaW4uYWRkTWV0aG9kIGtleVxuXG5cdFx0QGNvbnN0cnVjdG9yLl9fbWV0aG9kQ2hhaW5cblxuXHRfZ2V0TmV3SW50ZXJmYWNlOiAtPlxuXG5cdFx0QF9nZXRNZXRob2RDaGFpbigpLmdldEludGVyZmFjZSgpXG5cblx0X2V2ZW50RW5hYmxlZE1ldGhvZDogKGFyZ3MsIHJ1bkNhbGxiYWNrKSAtPlxuXG5cdFx0Zm4gPSBhcmdzWzBdID8gbnVsbFxuXG5cdFx0aWYgZm5cblxuXHRcdFx0cnVuQ2FsbGJhY2sgPT5cblxuXHRcdFx0XHRmbi5hcHBseSBALCBhcmd1bWVudHNcblxuXHRcdFx0cmV0dXJuIEBcblxuXHRcdGVsc2VcblxuXHRcdFx0X2ludGVyZmFjZSA9IEBfZ2V0TmV3SW50ZXJmYWNlKClcblxuXHRcdFx0cnVuQ2FsbGJhY2sgPT5cblxuXHRcdFx0XHQjIFRPRE86IGxhenlWYWx1ZXNcblx0XHRcdFx0QF9nZXRNZXRob2RDaGFpbigpLnJ1biBfaW50ZXJmYWNlLCBAXG5cblx0XHRcdHJldHVybiBfaW50ZXJmYWNlIl19
},{"method-chain":6}],27:[function(require,module,exports){
var ClassPrototype, StyleSetter, Styles, Transitioner, method, methodName, timing, _fn, _fn1, _ref, _ref1;

StyleSetter = require('./styleSetter/StyleSetter');

Transitioner = require('./transitioner/Transitioner');

timing = require('../../timing');

module.exports = Styles = (function() {
  function Styles() {}

  Styles.prototype.__initMixinHasStyles = function() {
    this._styleSetter = new StyleSetter(this);
    this._transitioner = new Transitioner(this);
    this.fill = this._styleSetter.fill;
    this._styleInterface = this._styleSetter;
    this._updaterDeployed = false;
    this._shouldUpdate = false;
    this._updaterCallback = this._getNewUpdaterCallback();
    this._lastTimeUpdated = 0;
  };

  Styles.prototype._getNewUpdaterCallback = function() {
    var _this = this;
    return function(t) {
      return _this._doUpdate(t);
    };
  };

  Styles.prototype._scheduleUpdate = function() {
    this._shouldUpdate = true;
    this._deployUpdater();
  };

  Styles.prototype._deployUpdater = function() {
    if (this._updaterDeployed) {
      return;
    }
    this._updaterDeployed = true;
    return timing.afterEachFrame(this._updaterCallback);
  };

  Styles.prototype._undeployUpdater = function() {
    if (!this._updaterDeployed) {
      return;
    }
    this._updaterDeployed = false;
    return timing.cancelAfterEachFrame(this._updaterCallback);
  };

  Styles.prototype._doUpdate = function(t) {
    if (!this._shouldUpdate) {
      if (t - this._lastTimeUpdated > 100) {
        this._undeployUpdater();
      }
      return;
    }
    this._lastTimeUpdated = t;
    this._shouldUpdate = false;
    this._transitioner._updateTransition();
    this._styleSetter._updateTransforms();
    this._styleSetter._updateFilters();
  };

  Styles.prototype.__clonerForHasStyles = function(newEl) {
    newEl._styleSetter = this._styleSetter.clone(newEl);
    newEl.fill = newEl._styleSetter.fill;
    newEl._transitioner = this._transitioner.clone(newEl);
    newEl._updaterDeployed = false;
    newEl._shouldUpdate = false;
    newEl._updaterCallback = newEl._getNewUpdaterCallback();
    newEl._lastTimeUpdated;
    if (this._styleInterface === this._styleSetter) {
      newEl._styleInterface = newEl._styleSetter;
    } else {
      newEl._styleInterface = newEl._transitioner;
    }
  };

  Styles.prototype.__quitterForHasStyles = function() {
    return this._undeployUpdater();
  };

  Styles.prototype.enableTransition = function(duration) {
    this._styleInterface = this._transitioner;
    this._transitioner.enable(duration);
    return this;
  };

  Styles.prototype.disableTransition = function() {
    this._styleInterface = this._styleSetter;
    this._transitioner.disable();
    return this;
  };

  Styles.prototype.trans = function(duration) {
    return this.enableTransition(duration);
  };

  Styles.prototype.noTrans = function() {
    return this.disableTransition();
  };

  Styles.prototype.ease = function(funcNameOrFirstNumOfCubicBezier, secondNum, thirdNum, fourthNum) {
    this._transitioner.ease(funcNameOrFirstNumOfCubicBezier, secondNum, thirdNum, fourthNum);
    return this;
  };

  return Styles;

})();

ClassPrototype = Styles.prototype;

_ref = Transitioner.prototype;
_fn = function() {
  var _methodName;
  _methodName = methodName;
  if (method.length === 0) {
    return ClassPrototype[_methodName] = function() {
      this._styleInterface[_methodName]();
      return this;
    };
  } else if (method.length === 1) {
    return ClassPrototype[_methodName] = function(arg0) {
      this._styleInterface[_methodName](arg0);
      return this;
    };
  } else if (method.length === 2) {
    return ClassPrototype[_methodName] = function(arg0, arg1) {
      this._styleInterface[_methodName](arg0, arg1);
      return this;
    };
  } else if (method.length === 3) {
    return ClassPrototype[_methodName] = function(arg0, arg1, arg2) {
      this._styleInterface[_methodName](arg0, arg1, arg2);
      return this;
    };
  } else if (method.length === 4) {
    return ClassPrototype[_methodName] = function(arg0, arg1, arg2, arg3) {
      this._styleInterface[_methodName](arg0, arg1, arg2, arg3);
      return this;
    };
  } else if (method.length === 5) {
    return ClassPrototype[_methodName] = function(arg0, arg1, arg2, arg3, arg4) {
      this._styleInterface[_methodName](arg0, arg1, arg2, arg3, arg4);
      return this;
    };
  } else {
    throw Error("Methods with more than 5 args are not supported.");
  }
};
for (methodName in _ref) {
  method = _ref[methodName];
  if (!(method instanceof Function)) {
    continue;
  }
  if (ClassPrototype[methodName] != null) {
    continue;
  }
  if (methodName[0] === '_') {
    continue;
  }
  if (methodName.substr(0, 3) === 'get') {
    continue;
  }
  _fn();
}

_ref1 = StyleSetter.prototype;
_fn1 = function() {
  var _methodName;
  _methodName = methodName;
  if (method.length === 0) {
    return ClassPrototype[_methodName] = function() {
      this._styleSetter[_methodName]();
      return this;
    };
  } else if (method.length === 1) {
    return ClassPrototype[_methodName] = function(arg0) {
      this._styleSetter[_methodName](arg0);
      return this;
    };
  } else if (method.length === 2) {
    return ClassPrototype[_methodName] = function(arg0, arg1) {
      this._styleSetter[_methodName](arg0, arg1);
      return this;
    };
  } else if (method.length === 3) {
    return ClassPrototype[_methodName] = function(arg0, arg1, arg2) {
      this._styleSetter[_methodName](arg0, arg1, arg2);
      return this;
    };
  } else if (method.length === 4) {
    return ClassPrototype[_methodName] = function(arg0, arg1, arg2, arg3) {
      this._styleSetter[_methodName](arg0, arg1, arg2, arg3);
      return this;
    };
  } else if (method.length === 5) {
    return ClassPrototype[_methodName] = function(arg0, arg1, arg2, arg3, arg4) {
      this._styleSetter[_methodName](arg0, arg1, arg2, arg3, arg4);
      return this;
    };
  } else {
    throw Error("Methods with more than 5 args are not supported.");
  }
};
for (methodName in _ref1) {
  method = _ref1[methodName];
  if (!(method instanceof Function)) {
    continue;
  }
  if (ClassPrototype[methodName] != null) {
    continue;
  }
  if (methodName[0] === '_') {
    continue;
  }
  if (methodName.substr(0, 3) === 'get') {
    continue;
  }
  _fn1();
}

Styles;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3R5bGVzXy5qcyIsInNvdXJjZVJvb3QiOiIuLlxcLi5cXC4uXFwuLiIsInNvdXJjZXMiOlsiY29mZmVlXFxsaWJcXGVsXFxtaXhpblxcU3R5bGVzXy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxpR0FBQTs7QUFBQSxDQUFBLEVBQWMsSUFBQSxJQUFkLGdCQUFjOztBQUNkLENBREEsRUFDZSxJQUFBLEtBQWYsaUJBQWU7O0FBQ2YsQ0FGQSxFQUVTLEdBQVQsQ0FBUyxPQUFBOztBQUVULENBSkEsRUFJdUIsR0FBakIsQ0FBTjtDQUVDOztDQUFBLEVBQXNCLE1BQUEsV0FBdEI7Q0FFQyxFQUFvQixDQUFwQixPQUFvQixDQUFwQjtDQUFBLEVBRXFCLENBQXJCLFFBQXFCLENBQXJCO0NBRkEsRUFJUSxDQUFSLFFBQXFCO0NBSnJCLEVBTW1CLENBQW5CLFFBTkEsR0FNQTtDQU5BLEVBUW9CLENBQXBCLENBUkEsV0FRQTtDQVJBLEVBVWlCLENBQWpCLENBVkEsUUFVQTtDQVZBLEVBWW9CLENBQXBCLFlBQUEsTUFBb0I7Q0FacEIsRUFjb0IsQ0FBcEIsWUFBQTtDQWhCRCxFQUFzQjs7Q0FBdEIsRUFvQndCLE1BQUEsYUFBeEI7Q0FFQyxPQUFBLElBQUE7Q0FBQSxFQUFBLE1BQUMsRUFBRDtDQUFRLElBQUEsSUFBRCxJQUFBO0NBRmdCLElBRXZCO0NBdEJELEVBb0J3Qjs7Q0FwQnhCLEVBd0JpQixNQUFBLE1BQWpCO0NBRUMsRUFBaUIsQ0FBakIsU0FBQTtDQUFBLEdBRUcsVUFBSDtDQTVCRCxFQXdCaUI7O0NBeEJqQixFQWdDZ0IsTUFBQSxLQUFoQjtDQUVDLEdBQUEsWUFBQTtDQUFBLFdBQUE7TUFBQTtDQUFBLEVBRW9CLENBQXBCLFlBQUE7Q0FFTyxHQUFnQixFQUFqQixLQUFOLEdBQUEsRUFBQTtDQXRDRCxFQWdDZ0I7O0NBaENoQixFQXdDa0IsTUFBQSxPQUFsQjtBQUVlLENBQWQsR0FBQSxZQUFBO0NBQUEsV0FBQTtNQUFBO0NBQUEs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ZixDQW1DeUIsQ0FuQ3pCO0NBcUNnQixDQUFzQixDQUFQLENBQUEsS0FBQyxFQUEvQixHQUFlO0NBRWQsQ0FBaUMsRUFBaEMsRUFBRCxLQUFjLENBQUE7Q0FGZSxZQUk3QjtDQXpDRixJQXFDK0I7Q0FNaEIsR0EzQ2YsQ0EyQ3lCLENBM0N6QjtDQTZDZ0IsQ0FBc0IsQ0FBUCxDQUFBLEtBQUMsRUFBL0IsR0FBZTtDQUVkLENBQWlDLEVBQWhDLEVBQUQsS0FBYyxDQUFBO0NBRmUsWUFJN0I7Q0FqREYsSUE2QytCO0lBN0MvQixFQUFBO0NBcURDLElBQU0sS0FBQSx3Q0FBQTtJQXpETDtDQUFBO0NBVkosSUFBQSxjQUFBOzhCQUFBO0FBRUMsQ0FBQSxDQUFBLEVBQUEsRUFBZ0IsRUFBaEIsSUFBa0M7Q0FBbEMsWUFBQTtJQUFBO0NBRUEsQ0FBQSxFQUFZLDhCQUFaO0NBQUEsWUFBQTtJQUZBO0NBSUEsQ0FBQSxDQUFBLENBQVksQ0FBaUIsS0FBTjtDQUF2QixZQUFBO0lBSkE7Q0FNQSxDQUFBLEVBQVksQ0FBMkIsQ0FBM0IsSUFBVTtDQUF0QixZQUFBO0lBTkE7Q0FBQTtDQUZEOztBQXFFQSxDQWhSQSxLQUFBIiwic291cmNlc0NvbnRlbnQiOlsiU3R5bGVTZXR0ZXIgPSByZXF1aXJlICcuL3N0eWxlU2V0dGVyL1N0eWxlU2V0dGVyJ1xyXG5UcmFuc2l0aW9uZXIgPSByZXF1aXJlICcuL3RyYW5zaXRpb25lci9UcmFuc2l0aW9uZXInXHJcbnRpbWluZyA9IHJlcXVpcmUgJy4uLy4uL3RpbWluZydcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgU3R5bGVzXHJcblxyXG5cdF9faW5pdE1peGluSGFzU3R5bGVzOiAtPlxyXG5cclxuXHRcdEBfc3R5bGVTZXR0ZXIgPSBuZXcgU3R5bGVTZXR0ZXIgQFxyXG5cclxuXHRcdEBfdHJhbnNpdGlvbmVyID0gbmV3IFRyYW5zaXRpb25lciBAXHJcblxyXG5cdFx0QGZpbGwgPSBAX3N0eWxlU2V0dGVyLmZpbGxcclxuXHJcblx0XHRAX3N0eWxlSW50ZXJmYWNlID0gQF9zdHlsZVNldHRlclxyXG5cclxuXHRcdEBfdXBkYXRlckRlcGxveWVkID0gbm9cclxuXHJcblx0XHRAX3Nob3VsZFVwZGF0ZSA9IG5vXHJcblxyXG5cdFx0QF91cGRhdGVyQ2FsbGJhY2sgPSBAX2dldE5ld1VwZGF0ZXJDYWxsYmFjaygpXHJcblxyXG5cdFx0QF9sYXN0VGltZVVwZGF0ZWQgPSAwXHJcblxyXG5cdFx0cmV0dXJuXHJcblxyXG5cdF9nZXROZXdVcGRhdGVyQ2FsbGJhY2s6IC0+XHJcblxyXG5cdFx0KHQpID0+IEBfZG9VcGRhdGUgdFxyXG5cclxuXHRfc2NoZWR1bGVVcGRhdGU6IC0+XHJcblxyXG5cdFx0QF9zaG91bGRVcGRhdGUgPSB5ZXNcclxuXHJcblx0XHRkbyBAX2RlcGxveVVwZGF0ZXJcclxuXHJcblx0XHRyZXR1cm5cclxuXHJcblx0X2RlcGxveVVwZGF0ZXI6IC0+XHJcblxyXG5cdFx0cmV0dXJuIGlmIEBfdXBkYXRlckRlcGxveWVkXHJcblxyXG5cdFx0QF91cGRhdGVyRGVwbG95ZWQgPSB5ZXNcclxuXHJcblx0XHR0aW1pbmcuYWZ0ZXJFYWNoRnJhbWUgQF91cGRhdGVyQ2FsbGJhY2tcclxuXHJcblx0X3VuZGVwbG95VXBkYXRlcjogLT5cclxuXHJcblx0XHRyZXR1cm4gdW5sZXNzIEBfdXBkYXRlckRlcGxveWVkXHJcblxyXG5cdFx0QF91cGRhdGVyRGVwbG95ZWQgPSBub1xyXG5cclxuXHRcdHRpbWluZy5jYW5jZWxBZnRlckVhY2hGcmFtZSBAX3VwZGF0ZXJDYWxsYmFja1xyXG5cclxuXHRfZG9VcGRhdGU6ICh0KSAtPlxyXG5cclxuXHRcdHVubGVzcyBAX3Nob3VsZFVwZGF0ZVxyXG5cclxuXHRcdFx0aWYgdCAtIEBfbGFzdFRpbWVVcGRhdGVkID4gMTAwXHJcblxyXG5cdFx0XHRcdGRvIEBfdW5kZXBsb3lVcGRhdGVyXHJcblxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRAX2xhc3RUaW1lVXBkYXRlZCA9IHRcclxuXHJcblx0XHRAX3Nob3VsZFVwZGF0ZSA9IG5vXHJcblxyXG5cdFx0ZG8gQF90cmFuc2l0aW9uZXIuX3VwZGF0ZVRyYW5zaXRpb25cclxuXHJcblx0XHRkbyBAX3N0eWxlU2V0dGVyLl91cGRhdGVUcmFuc2Zvcm1zXHJcblxyXG5cdFx0ZG8gQF9zdHlsZVNldHRlci5fdXBkYXRlRmlsdGVyc1xyXG5cclxuXHRcdHJldHVyblxyXG5cclxuXHRfX2Nsb25lckZvckhhc1N0eWxlczogKG5ld0VsKSAtPlxyXG5cclxuXHRcdG5ld0VsLl9zdHlsZVNldHRlciA9IEBfc3R5bGVTZXR0ZXIuY2xvbmUgbmV3RWxcclxuXHRcdG5ld0VsLmZpbGwgPSBuZXdFbC5fc3R5bGVTZXR0ZXIuZmlsbFxyXG5cdFx0bmV3RWwuX3RyYW5zaXRpb25lciA9IEBfdHJhbnNpdGlvbmVyLmNsb25lIG5ld0VsXHJcblxyXG5cdFx0bmV3RWwuX3VwZGF0ZXJEZXBsb3llZCA9IG5vXHJcblxyXG5cdFx0bmV3RWwuX3Nob3VsZFVwZGF0ZSA9IG5vXHJcblxyXG5cdFx0bmV3RWwuX3VwZGF0ZXJDYWxsYmFjayA9IG5ld0VsLl9nZXROZXdVcGRhdGVyQ2FsbGJhY2soKVxyXG5cclxuXHRcdG5ld0VsLl9sYXN0VGltZVVwZGF0ZWRcclxuXHJcblx0XHRpZiBAX3N0eWxlSW50ZXJmYWNlIGlzIEBfc3R5bGVTZXR0ZXJcclxuXHJcblx0XHRcdG5ld0VsLl9zdHlsZUludGVyZmFjZSA9IG5ld0VsLl9zdHlsZVNldHRlclxyXG5cclxuXHRcdGVsc2VcclxuXHJcblx0XHRcdG5ld0VsLl9zdHlsZUludGVyZmFjZSA9IG5ld0VsLl90cmFuc2l0aW9uZXJcclxuXHJcblx0XHRyZXR1cm5cclxuXHJcblx0X19xdWl0dGVyRm9ySGFzU3R5bGVzOiAtPlxyXG5cclxuXHRcdGRvIEBfdW5kZXBsb3lVcGRhdGVyXHJcblxyXG5cdGVuYWJsZVRyYW5zaXRpb246IChkdXJhdGlvbikgLT5cclxuXHJcblx0XHQjIGNvbnNvbGUubG9nICdlbmFibGUnXHJcblxyXG5cdFx0QF9zdHlsZUludGVyZmFjZSA9IEBfdHJhbnNpdGlvbmVyXHJcblxyXG5cdFx0QF90cmFuc2l0aW9uZXIuZW5hYmxlIGR1cmF0aW9uXHJcblxyXG5cdFx0QFxyXG5cclxuXHRkaXNhYmxlVHJhbnNpdGlvbjogLT5cclxuXHJcblx0XHRAX3N0eWxlSW50ZXJmYWNlID0gQF9zdHlsZVNldHRlclxyXG5cclxuXHRcdGRvIEBfdHJhbnNpdGlvbmVyLmRpc2FibGVcclxuXHJcblx0XHRAXHJcblxyXG5cdHRyYW5zOiAoZHVyYXRpb24pIC0+IEBlbmFibGVUcmFuc2l0aW9uIGR1cmF0aW9uXHJcblxyXG5cdG5vVHJhbnM6IC0+IGRvIEBkaXNhYmxlVHJhbnNpdGlvblxyXG5cclxuXHRlYXNlOiAoZnVuY05hbWVPckZpcnN0TnVtT2ZDdWJpY0Jlemllciwgc2Vjb25kTnVtLCB0aGlyZE51bSwgZm91cnRoTnVtKSAtPlxyXG5cclxuXHRcdEBfdHJhbnNpdGlvbmVyLmVhc2UgZnVuY05hbWVPckZpcnN0TnVtT2ZDdWJpY0Jlemllciwgc2Vjb25kTnVtLCB0aGlyZE51bSwgZm91cnRoTnVtXHJcblxyXG5cdFx0QFxyXG5cclxuQ2xhc3NQcm90b3R5cGUgPSBTdHlsZXMucHJvdG90eXBlXHJcblxyXG5mb3IgbWV0aG9kTmFtZSwgbWV0aG9kIG9mIFRyYW5zaXRpb25lci5wcm90b3R5cGVcclxuXHJcblx0Y29udGludWUgdW5sZXNzIG1ldGhvZCBpbnN0YW5jZW9mIEZ1bmN0aW9uXHJcblxyXG5cdGNvbnRpbnVlIGlmIENsYXNzUHJvdG90eXBlW21ldGhvZE5hbWVdP1xyXG5cclxuXHRjb250aW51ZSBpZiBtZXRob2ROYW1lWzBdIGlzICdfJ1xyXG5cclxuXHRjb250aW51ZSBpZiBtZXRob2ROYW1lLnN1YnN0cigwLCAzKSBpcyAnZ2V0J1xyXG5cclxuXHRkbyAtPlxyXG5cclxuXHRcdF9tZXRob2ROYW1lID0gbWV0aG9kTmFtZVxyXG5cclxuXHRcdGlmIG1ldGhvZC5sZW5ndGggaXMgMFxyXG5cclxuXHRcdFx0Q2xhc3NQcm90b3R5cGVbX21ldGhvZE5hbWVdID0gLT5cclxuXHJcblx0XHRcdFx0IyBUaGlzIGlzIG1vcmUgcGVyZm9ybWFudCB0aGFuIG1ldGhvZC5hcHBseSgpXHJcblx0XHRcdFx0I1xyXG5cdFx0XHRcdCMgQXJndW1lbnQgc3BsYXRzIHdvbid0IHdvcmsgaGVyZSB0aG91Z2guXHJcblx0XHRcdFx0QF9zdHlsZUludGVyZmFjZVtfbWV0aG9kTmFtZV0oKVxyXG5cclxuXHRcdFx0XHRAXHJcblxyXG5cdFx0ZWxzZSBpZiBtZXRob2QubGVuZ3RoIGlzIDFcclxuXHJcblx0XHRcdENsYXNzUHJvdG90eXBlW19tZXRob2ROYW1lXSA9IChhcmcwKSAtPlxyXG5cclxuXHRcdFx0XHRAX3N0eWxlSW50ZXJmYWNlW19tZXRob2ROYW1lXSBhcmcwXHJcblxyXG5cdFx0XHRcdEBcclxuXHJcblx0XHRlbHNlIGlmIG1ldGhvZC5sZW5ndGggaXMgMlxyXG5cclxuXHRcdFx0Q2xhc3NQcm90b3R5cGVbX21ldGhvZE5hbWVdID0gKGFyZzAsIGFyZzEpIC0+XHJcblxyXG5cdFx0XHRcdEBfc3R5bGVJbnRlcmZhY2VbX21ldGhvZE5hbWVdIGFyZzAsIGFyZzFcclxuXHJcblx0XHRcdFx0QFxyXG5cclxuXHRcdGVsc2UgaWYgbWV0aG9kLmxlbmd0aCBpcyAzXHJcblxyXG5cdFx0XHRDbGFzc1Byb3RvdHlwZVtfbWV0aG9kTmFtZV0gPSAoYXJnMCwgYXJnMSwgYXJnMikgLT5cclxuXHJcblx0XHRcdFx0QF9zdHlsZUludGVyZmFjZVtfbWV0aG9kTmFtZV0gYXJnMCwgYXJnMSwgYXJnMlxyXG5cclxuXHRcdFx0XHRAXHJcblxyXG5cdFx0ZWxzZSBpZiBtZXRob2QubGVuZ3RoIGlzIDRcclxuXHJcblx0XHRcdENsYXNzUHJvdG90eXBlW19tZXRob2ROYW1lXSA9IChhcmcwLCBhcmcxLCBhcmcyLCBhcmczKSAtPlxyXG5cclxuXHRcdFx0XHRAX3N0eWxlSW50ZXJmYWNlW19tZXRob2ROYW1lXSBhcmcwLCBhcmcxLCBhcmcyLCBhcmczXHJcblxyXG5cdFx0XHRcdEBcclxuXHJcblx0XHRlbHNlIGlmIG1ldGhvZC5sZW5ndGggaXMgNVxyXG5cclxuXHRcdFx0Q2xhc3NQcm90b3R5cGVbX21ldGhvZE5hbWVdID0gKGFyZzAsIGFyZzEsIGFyZzIsIGFyZzMsIGFyZzQpIC0+XHJcblxyXG5cdFx0XHRcdEBfc3R5bGVJbnRlcmZhY2VbX21ldGhvZE5hbWVdIGFyZzAsIGFyZzEsIGFyZzIsIGFyZzMsIGFyZzRcclxuXHJcblx0XHRcdFx0QFxyXG5cclxuXHRcdGVsc2VcclxuXHJcblx0XHRcdHRocm93IEVycm9yIFwiTWV0aG9kcyB3aXRoIG1vcmUgdGhhbiA1IGFyZ3MgYXJlIG5vdCBzdXBwb3J0ZWQuXCJcclxuXHJcbmZvciBtZXRob2ROYW1lLCBtZXRob2Qgb2YgU3R5bGVTZXR0ZXIucHJvdG90eXBlXHJcblxyXG5cdGNvbnRpbnVlIHVubGVzcyBtZXRob2QgaW5zdGFuY2VvZiBGdW5jdGlvblxyXG5cclxuXHRjb250aW51ZSBpZiBDbGFzc1Byb3RvdHlwZVttZXRob2ROYW1lXT9cclxuXHJcblx0Y29udGludWUgaWYgbWV0aG9kTmFtZVswXSBpcyAnXydcclxuXHJcblx0Y29udGludWUgaWYgbWV0aG9kTmFtZS5zdWJzdHIoMCwgMykgaXMgJ2dldCdcclxuXHJcblx0ZG8gLT5cclxuXHJcblx0XHRfbWV0aG9kTmFtZSA9IG1ldGhvZE5hbWVcclxuXHJcblx0XHRpZiBtZXRob2QubGVuZ3RoIGlzIDBcclxuXHJcblx0XHRcdENsYXNzUHJvdG90eXBlW19tZXRob2ROYW1lXSA9IC0+XHJcblxyXG5cdFx0XHRcdCMgVGhpcyBpcyBtb3JlIHBlcmZvcm1hbnQgdGhhbiBtZXRob2QuYXBwbHkoKVxyXG5cdFx0XHRcdCNcclxuXHRcdFx0XHQjIEFyZ3VtZW50IHNwbGF0cyB3b24ndCB3b3JrIGhlcmUgdGhvdWdoLlxyXG5cdFx0XHRcdEBfc3R5bGVTZXR0ZXJbX21ldGhvZE5hbWVdKClcclxuXHJcblx0XHRcdFx0QFxyXG5cclxuXHRcdGVsc2UgaWYgbWV0aG9kLmxlbmd0aCBpcyAxXHJcblxyXG5cdFx0XHRDbGFzc1Byb3RvdHlwZVtfbWV0aG9kTmFtZV0gPSAoYXJnMCkgLT5cclxuXHJcblx0XHRcdFx0QF9zdHlsZVNldHRlcltfbWV0aG9kTmFtZV0gYXJnMFxyXG5cclxuXHRcdFx0XHRAXHJcblxyXG5cdFx0ZWxzZSBpZiBtZXRob2QubGVuZ3RoIGlzIDJcclxuXHJcblx0XHRcdENsYXNzUHJvdG90eXBlW19tZXRob2ROYW1lXSA9IChhcmcwLCBhcmcxKSAtPlxyXG5cclxuXHRcdFx0XHRAX3N0eWxlU2V0dGVyW19tZXRob2ROYW1lXSBhcmcwLCBhcmcxXHJcblxyXG5cdFx0XHRcdEBcclxuXHJcblx0XHRlbHNlIGlmIG1ldGhvZC5sZW5ndGggaXMgM1xyXG5cclxuXHRcdFx0Q2xhc3NQcm90b3R5cGVbX21ldGhvZE5hbWVdID0gKGFyZzAsIGFyZzEsIGFyZzIpIC0+XHJcblxyXG5cdFx0XHRcdEBfc3R5bGVTZXR0ZXJbX21ldGhvZE5hbWVdIGFyZzAsIGFyZzEsIGFyZzJcclxuXHJcblx0XHRcdFx0QFxyXG5cclxuXHRcdGVsc2UgaWYgbWV0aG9kLmxlbmd0aCBpcyA0XHJcblxyXG5cdFx0XHRDbGFzc1Byb3RvdHlwZVtfbWV0aG9kTmFtZV0gPSAoYXJnMCwgYXJnMSwgYXJnMiwgYXJnMykgLT5cclxuXHJcblx0XHRcdFx0QF9zdHlsZVNldHRlcltfbWV0aG9kTmFtZV0gYXJnMCwgYXJnMSwgYXJnMiwgYXJnM1xyXG5cclxuXHRcdFx0XHRAXHJcblxyXG5cdFx0ZWxzZSBpZiBtZXRob2QubGVuZ3RoIGlzIDVcclxuXHJcblx0XHRcdENsYXNzUHJvdG90eXBlW19tZXRob2ROYW1lXSA9IChhcmcwLCBhcmcxLCBhcmcyLCBhcmczLCBhcmc0KSAtPlxyXG5cclxuXHRcdFx0XHRAX3N0eWxlU2V0dGVyW19tZXRob2ROYW1lXSBhcmcwLCBhcmcxLCBhcmcyLCBhcmczLCBhcmc0XHJcblxyXG5cdFx0XHRcdEBcclxuXHJcblx0XHRlbHNlXHJcblxyXG5cdFx0XHR0aHJvdyBFcnJvciBcIk1ldGhvZHMgd2l0aCBtb3JlIHRoYW4gNSBhcmdzIGFyZSBub3Qgc3VwcG9ydGVkLlwiXHJcblxyXG5TdHlsZXMiXX0=
},{"../../timing":41,"./styleSetter/StyleSetter":29,"./transitioner/Transitioner":37}],28:[function(require,module,exports){
var Timing_, array, timing,
  __slice = [].slice;

array = require('utila').array;

timing = require('../../timing');

module.exports = Timing_ = (function() {
  function Timing_() {}

  Timing_.prototype.__initMixinTiming = function() {
    this._quittersForTiming = [];
    return null;
  };

  Timing_.prototype.__clonerForTiming = function(newEl) {
    return newEl._quittersForTiming = [];
  };

  Timing_.prototype.__quitterForTiming = function() {
    while (true) {
      if (this._quittersForTiming.length < 1) {
        return;
      }
      this._quittersForTiming.pop()();
    }
  };

  Timing_.prototype.wait = function() {
    var ms, rest,
      _this = this;
    ms = arguments[0], rest = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return this._eventEnabledMethod(rest, function(cb) {
      return timing.wait(ms, function() {
        return cb.call(_this);
      });
    });
  };

  Timing_.prototype.immediately = function() {
    var _this = this;
    return this._eventEnabledMethod(arguments, function(cb) {
      return timing.nextTick(function() {
        return cb.call(_this);
      });
    });
  };

  Timing_.prototype.eachFrame = function() {
    var _this = this;
    return this._eventEnabledMethod(arguments, function(cb) {
      var canceled, canceler, startTime, theCallback;
      startTime = new Int32Array(1);
      startTime[0] = -1;
      canceled = false;
      canceler = function() {
        if (canceled) {
          return;
        }
        timing.cancelOnEachFrame(theCallback);
        array.pluckOneItem(_this._quittersForTiming, canceler);
        return canceled = true;
      };
      _this._quittersForTiming.push(canceler);
      theCallback = function(t) {
        var elapsedTime;
        if (startTime[0] < 0) {
          startTime[0] = t;
          elapsedTime = 0;
        } else {
          elapsedTime = t - startTime[0];
        }
        cb.call(_this, elapsedTime, canceler);
        return null;
      };
      return timing.onEachFrame(theCallback);
    });
  };

  Timing_.prototype.run = function() {
    var _this = this;
    this._eventEnabledMethod(arguments, function(cb) {
      return cb.call(_this);
    });
    return this;
  };

  Timing_.prototype.every = function() {
    var args, ms,
      _this = this;
    ms = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return this._eventEnabledMethod(args, function(cb) {
      var canceled, canceler, theCallback;
      canceled = false;
      canceler = function() {
        if (canceled) {
          return;
        }
        timing.cancelEvery(theCallback);
        array.pluckOneItem(_this._quittersForTiming, canceler);
        return canceled = true;
      };
      _this._quittersForTiming.push(canceler);
      theCallback = function() {
        return cb.call(_this, canceler);
      };
      return timing.every(ms, theCallback);
    });
  };

  Timing_.prototype.everyAndNow = function() {
    var args, ms,
      _this = this;
    ms = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return this._eventEnabledMethod(args, function(cb) {
      var canceled, canceler, theCallback;
      canceled = false;
      canceler = function() {
        if (canceled) {
          return;
        }
        timing.cancelEvery(theCallback);
        array.pluckOneItem(_this._quittersForTiming, canceler);
        return canceled = true;
      };
      _this._quittersForTiming.push(canceler);
      theCallback = function() {
        return cb.call(_this, canceler);
      };
      timing.every(ms, theCallback);
      return timing.afterNextFrame(theCallback);
    });
  };

  return Timing_;

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGltaW5nXy5qcyIsInNvdXJjZVJvb3QiOiIuLlxcLi5cXC4uXFwuLiIsInNvdXJjZXMiOlsiY29mZmVlXFxsaWJcXGVsXFxtaXhpblxcVGltaW5nXy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxrQkFBQTtHQUFBLGVBQUE7O0FBQUMsQ0FBRCxFQUFVLEVBQVYsRUFBVTs7QUFDVixDQURBLEVBQ1MsR0FBVCxDQUFTLE9BQUE7O0FBRVQsQ0FIQSxFQUd1QixHQUFqQixDQUFOO0NBRUM7O0NBQUEsRUFBbUIsTUFBQSxRQUFuQjtDQUVDLENBQUEsQ0FBc0IsQ0FBdEIsY0FBQTtDQUZrQixVQUlsQjtDQUpELEVBQW1COztDQUFuQixFQU1tQixFQUFBLElBQUMsUUFBcEI7Q0FFTyxFQUFxQixFQUF0QixNQUFMLE9BQUE7Q0FSRCxFQU1tQjs7Q0FObkIsRUFVb0IsTUFBQSxTQUFwQjtDQUVDLEVBQUEsQ0FBQSxPQUFBO0NBRUMsRUFBdUMsQ0FBN0IsRUFBVixZQUE2QjtDQUE3QixhQUFBO1FBQUE7Q0FBQSxFQUVBLENBQUMsRUFBRCxZQUFtQjtDQU5ELElBRW5CO0NBWkQsRUFVb0I7O0NBVnBCLEVBb0JNLENBQU4sS0FBTTtDQUVMLE9BQUE7T0FBQSxLQUFBO0NBQUEsQ0FGVSxFQUFKLG1EQUVOO0NBQUMsQ0FBMEIsQ0FBQSxDQUExQixLQUEyQixFQUE1QixRQUFBO0NBRVEsQ0FBUCxDQUFnQixDQUFoQixFQUFNLEdBQVUsSUFBaEI7Q0FFSSxDQUFELEVBQUYsQ0FBQSxVQUFBO0NBRkQsTUFBZ0I7Q0FGakIsSUFBMkI7Q0F0QjVCLEVBb0JNOztDQXBCTixFQTRCYSxNQUFBLEVBQWI7Q0FFQyxPQUFBLElBQUE7Q0FBQyxDQUErQixDQUFBLENBQS9CLEtBQUQsRUFBQSxRQUFBO0NBRVEsRUFBUyxHQUFWLEVBQU4sQ0FBZ0IsSUFBaEI7Q0FFSSxDQUFELEVBQUYsQ0FBQSxVQUFBO0NBRkQsTUFBZ0I7Q0FGakIsSUFBZ0M7Q0E5QmpDLEVBNEJhOztDQTVCYixFQW9DVyxNQUFYO0NBRUMsT0FBQSxJQUFBO0NBQUMsQ0FBK0IsQ0FBQSxDQUEvQixLQUFELEVBQUEsUUFBQTtDQUVDLFNBQUEsZ0NBQUE7Q0FBQSxFQUFnQixDQUFBLEVBQWhCLEdBQUEsQ0FBZ0I7QUFDQSxDQURoQixFQUNlLEdBQWYsR0FBVTtDQURWLEVBR1csRUFIWCxDQUdBLEVBQUE7Q0FIQSxFQUtXLEdBQVgsRUFBQSxDQUFXO0NBRVYsR0FBVSxJQUFWO0NBQUEsZUFBQTtVQUFBO0NBQUEsS0FFTSxFQUFOLEdBQUEsTUFBQTtDQUZBLENBSXdDLEdBQW5DLEdBQUwsSUFBQSxNQUFBO0NBTlUsRUFRQyxLQUFYLE9BQUE7Q0FiRCxNQUtXO0NBTFgsR0FlQSxDQUFDLENBQUQsRUFBQSxVQUFtQjtDQWZuQixFQWlCYyxHQUFkLEdBQWUsRUFBZjtDQUVDLFVBQUEsQ0FBQTtDQUFBLEVBQWtCLENBQWYsSUFBSCxDQUFhO0NBRVosRUFBZSxNQUFMLENBQVY7Q0FBQSxFQUVjLE9BQWQsQ0FBQTtNQUpELElBQUE7Q0FRQyxFQUFjLE1BQWMsQ0FBNUIsQ0FBQTtVQVJEO0NBQUEsQ0FVRSxFQUFGLENBQUEsR0FBQSxHQUFBO0NBWmEsY0FjYjtDQS9CRCxNQWlCYztDQWdCUCxLQUFELEtBQU4sRUFBQTtDQW5DRCxJQUFnQztDQXRDakMsRUFvQ1c7O0NBcENYLEVBMkVBLE1BQUs7Q0FFSixPQUFBLElBQUE7Q0FBQSxDQUFnQyxDQUFBLENBQWhDLEtBQUEsVUFBQTtDQUVJLENBQUQsRUFBRixDQUFBLFFBQUE7Q0FGRCxJQUFnQztDQUY1QixVQU1KO0NBakZELEVBMkVLOztDQTNFTCxFQW1GTyxFQUFQLElBQU87Q0FFTixPQUFBO09BQUEsS0FBQTtDQUFBLENBRlcsRUFBSixtREFFUDtDQUFDLENBQTBCLENBQUEsQ0FBMUIsS0FBMkIsRUFBNUIsUUFBQTtDQUVDLFNBQUEscUJBQUE7Q0FBQSxFQUFXLEVBQVgsQ0FBQSxFQUFBO0NBQUEsRUFFVyxHQUFYLEVBQUEsQ0FBVztDQUVWLEdBQVUsSUFBVjtDQUFBLGVBQUE7VUFBQTtDQUFBLEtBRU0sRUFBTixHQUFBO0NBRkEsQ0FJd0MsR0FBbkMsR0FBTCxJQUFBLE1BQUE7Q0FOVSxFQVFDLEtBQVgsT0FBQTtDQVZELE1BRVc7Q0FGWCxHQVlBLENBQUMsQ0FBRCxFQUFBLFVBQW1CO0NBWm5CLEVBY2MsR0FBZCxHQUFjLEVBQWQ7Q0FFSSxDQUFELEVBQUYsQ0FBQSxHQUFBLE9BQUE7Q0FoQkQsTUFjYztDQUlQLENBQVAsR0FBQSxDQUFNLEtBQU4sRUFBQTtDQXBCRCxJQUEyQjtDQXJGNUIsRUFtRk87O0NBbkZQLEVBMkdhLE1BQUEsRUFBYjtDQUVDLE9BQUE7T0FBQSxLQUFBO0NBQUEsQ0FGaUIsRUFBSixtREFFYjtDQUFDLENBQTBCLENBQUEsQ0FBMUIsS0FBMkIsRUFBNUIsUUFBQTtDQUVDLFNBQUEscUJBQUE7Q0FBQSxFQUFXLEVBQVgsQ0FBQSxFQUFBO0NBQUEsRUFFVyxHQUFYLEVBQUEsQ0FBVztDQUVWLEdBQVUsSUFBVjtDQUFBLGVBQUE7VUFBQTtDQUFBLEtBRU0sRUFBTixHQUFBO0NBRkEsQ0FJd0MsR0FBbkMsR0FBTCxJQUFBLE1BQUE7Q0FOVSxFQVFDLEtBQVgsT0FBQTtDQVZELE1BRVc7Q0FGWCxHQVlBLENBQUMsQ0FBRCxFQUFBLFVBQW1CO0NBWm5CLEVBY2MsR0FBZCxHQUFjLEVBQWQ7Q0FFSSxDQUFELEVBQUYsQ0FBQSxHQUFBLE9BQUE7Q0FoQkQsTUFjYztDQWRkLENBa0JBLEdBQUEsQ0FBQSxLQUFBO0NBRU8sS0FBRCxLQUFOLEVBQUEsQ0FBQTtDQXRCRCxJQUEyQjtDQTdHNUIsRUEyR2E7O0NBM0diOztDQUxEIiwic291cmNlc0NvbnRlbnQiOlsie2FycmF5fSA9IHJlcXVpcmUgJ3V0aWxhJ1xyXG50aW1pbmcgPSByZXF1aXJlICcuLi8uLi90aW1pbmcnXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFRpbWluZ19cclxuXHJcblx0X19pbml0TWl4aW5UaW1pbmc6IC0+XHJcblxyXG5cdFx0QF9xdWl0dGVyc0ZvclRpbWluZyA9IFtdXHJcblxyXG5cdFx0bnVsbFxyXG5cclxuXHRfX2Nsb25lckZvclRpbWluZzogKG5ld0VsKSAtPlxyXG5cclxuXHRcdG5ld0VsLl9xdWl0dGVyc0ZvclRpbWluZyA9IFtdXHJcblxyXG5cdF9fcXVpdHRlckZvclRpbWluZzogLT5cclxuXHJcblx0XHRsb29wXHJcblxyXG5cdFx0XHRyZXR1cm4gaWYgQF9xdWl0dGVyc0ZvclRpbWluZy5sZW5ndGggPCAxXHJcblxyXG5cdFx0XHRAX3F1aXR0ZXJzRm9yVGltaW5nLnBvcCgpKClcclxuXHJcblx0XHRyZXR1cm5cclxuXHJcblx0d2FpdDogKG1zLCByZXN0Li4uKSAtPlxyXG5cclxuXHRcdEBfZXZlbnRFbmFibGVkTWV0aG9kIHJlc3QsIChjYikgPT5cclxuXHJcblx0XHRcdHRpbWluZy53YWl0IG1zLCA9PlxyXG5cclxuXHRcdFx0XHRjYi5jYWxsIEBcclxuXHJcblx0aW1tZWRpYXRlbHk6IC0+XHJcblxyXG5cdFx0QF9ldmVudEVuYWJsZWRNZXRob2QgYXJndW1lbnRzLCAoY2IpID0+XHJcblxyXG5cdFx0XHR0aW1pbmcubmV4dFRpY2sgPT5cclxuXHJcblx0XHRcdFx0Y2IuY2FsbCBAXHJcblxyXG5cdGVhY2hGcmFtZTogLT5cclxuXHJcblx0XHRAX2V2ZW50RW5hYmxlZE1ldGhvZCBhcmd1bWVudHMsIChjYikgPT5cclxuXHJcblx0XHRcdHN0YXJ0VGltZSA9IG5ldyBJbnQzMkFycmF5IDFcclxuXHRcdFx0c3RhcnRUaW1lWzBdID0gLTFcclxuXHJcblx0XHRcdGNhbmNlbGVkID0gbm9cclxuXHJcblx0XHRcdGNhbmNlbGVyID0gPT5cclxuXHJcblx0XHRcdFx0cmV0dXJuIGlmIGNhbmNlbGVkXHJcblxyXG5cdFx0XHRcdHRpbWluZy5jYW5jZWxPbkVhY2hGcmFtZSB0aGVDYWxsYmFja1xyXG5cclxuXHRcdFx0XHRhcnJheS5wbHVja09uZUl0ZW0gQF9xdWl0dGVyc0ZvclRpbWluZywgY2FuY2VsZXJcclxuXHJcblx0XHRcdFx0Y2FuY2VsZWQgPSB5ZXNcclxuXHJcblx0XHRcdEBfcXVpdHRlcnNGb3JUaW1pbmcucHVzaCBjYW5jZWxlclxyXG5cclxuXHRcdFx0dGhlQ2FsbGJhY2sgPSAodCkgPT5cclxuXHJcblx0XHRcdFx0aWYgc3RhcnRUaW1lWzBdIDwgMFxyXG5cclxuXHRcdFx0XHRcdHN0YXJ0VGltZVswXSA9IHRcclxuXHJcblx0XHRcdFx0XHRlbGFwc2VkVGltZSA9IDBcclxuXHJcblx0XHRcdFx0ZWxzZVxyXG5cclxuXHRcdFx0XHRcdGVsYXBzZWRUaW1lID0gdCAtIHN0YXJ0VGltZVswXVxyXG5cclxuXHRcdFx0XHRjYi5jYWxsIEAsIGVsYXBzZWRUaW1lLCBjYW5jZWxlclxyXG5cclxuXHRcdFx0XHRudWxsXHJcblxyXG5cdFx0XHR0aW1pbmcub25FYWNoRnJhbWUgdGhlQ2FsbGJhY2tcclxuXHJcblx0cnVuOiAtPlxyXG5cclxuXHRcdEBfZXZlbnRFbmFibGVkTWV0aG9kIGFyZ3VtZW50cywgKGNiKSA9PlxyXG5cclxuXHRcdFx0Y2IuY2FsbCBAXHJcblxyXG5cdFx0QFxyXG5cclxuXHRldmVyeTogKG1zLCBhcmdzLi4uKSAtPlxyXG5cclxuXHRcdEBfZXZlbnRFbmFibGVkTWV0aG9kIGFyZ3MsIChjYikgPT5cclxuXHJcblx0XHRcdGNhbmNlbGVkID0gbm9cclxuXHJcblx0XHRcdGNhbmNlbGVyID0gPT5cclxuXHJcblx0XHRcdFx0cmV0dXJuIGlmIGNhbmNlbGVkXHJcblxyXG5cdFx0XHRcdHRpbWluZy5jYW5jZWxFdmVyeSB0aGVDYWxsYmFja1xyXG5cclxuXHRcdFx0XHRhcnJheS5wbHVja09uZUl0ZW0gQF9xdWl0dGVyc0ZvclRpbWluZywgY2FuY2VsZXJcclxuXHJcblx0XHRcdFx0Y2FuY2VsZWQgPSB5ZXNcclxuXHJcblx0XHRcdEBfcXVpdHRlcnNGb3JUaW1pbmcucHVzaCBjYW5jZWxlclxyXG5cclxuXHRcdFx0dGhlQ2FsbGJhY2sgPSA9PlxyXG5cclxuXHRcdFx0XHRjYi5jYWxsIEAsIGNhbmNlbGVyXHJcblxyXG5cdFx0XHR0aW1pbmcuZXZlcnkgbXMsIHRoZUNhbGxiYWNrXHJcblxyXG5cdGV2ZXJ5QW5kTm93OiAobXMsIGFyZ3MuLi4pIC0+XHJcblxyXG5cdFx0QF9ldmVudEVuYWJsZWRNZXRob2QgYXJncywgKGNiKSA9PlxyXG5cclxuXHRcdFx0Y2FuY2VsZWQgPSBub1xyXG5cclxuXHRcdFx0Y2FuY2VsZXIgPSA9PlxyXG5cclxuXHRcdFx0XHRyZXR1cm4gaWYgY2FuY2VsZWRcclxuXHJcblx0XHRcdFx0dGltaW5nLmNhbmNlbEV2ZXJ5IHRoZUNhbGxiYWNrXHJcblxyXG5cdFx0XHRcdGFycmF5LnBsdWNrT25lSXRlbSBAX3F1aXR0ZXJzRm9yVGltaW5nLCBjYW5jZWxlclxyXG5cclxuXHRcdFx0XHRjYW5jZWxlZCA9IHllc1xyXG5cclxuXHRcdFx0QF9xdWl0dGVyc0ZvclRpbWluZy5wdXNoIGNhbmNlbGVyXHJcblxyXG5cdFx0XHR0aGVDYWxsYmFjayA9ID0+XHJcblxyXG5cdFx0XHRcdGNiLmNhbGwgQCwgY2FuY2VsZXJcclxuXHJcblx0XHRcdHRpbWluZy5ldmVyeSBtcywgdGhlQ2FsbGJhY2tcclxuXHJcblx0XHRcdHRpbWluZy5hZnRlck5leHRGcmFtZSB0aGVDYWxsYmFjayJdfQ==
},{"../../timing":41,"utila":24}],29:[function(require,module,exports){
var Fill_, Filters_, Generals_, Layout_, StyleSetter, Transforms_, Typography_, classic, object, _ref;

Generals_ = require('./mixin/Generals_');

Layout_ = require('./mixin/Layout_');

Fill_ = require('./mixin/Fill_');

Typography_ = require('./mixin/Typography_');

Transforms_ = require('./mixin/Transforms_');

Filters_ = require('./mixin/Filters_');

_ref = require('utila'), classic = _ref.classic, object = _ref.object;

module.exports = classic.mix(Generals_, Layout_, Fill_, Typography_, Transforms_, Filters_, StyleSetter = (function() {
  function StyleSetter(el) {
    this.el = el;
    this.node = this.el.node;
    this._styles = this.node.style;
    StyleSetter.__initMixinsFor(this);
  }

  StyleSetter.prototype._scheduleUpdate = function() {
    return this.el._scheduleUpdate();
  };

  StyleSetter.prototype.clone = function(el) {
    var key, newObj;
    newObj = Object.create(this.constructor.prototype);
    newObj.el = el;
    newObj.node = el.node;
    newObj._styles = el.node.style;
    StyleSetter.__applyClonersFor(this, [newObj]);
    for (key in this) {
      if (newObj[key] !== void 0) {
        continue;
      }
      if (this.hasOwnProperty(key)) {
        newObj[key] = object.clone(this[key], true);
      }
    }
    return newObj;
  };

  return StyleSetter;

})());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3R5bGVTZXR0ZXIuanMiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLlxcLi5cXC4uIiwic291cmNlcyI6WyJjb2ZmZWVcXGxpYlxcZWxcXG1peGluXFxzdHlsZVNldHRlclxcU3R5bGVTZXR0ZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsNkZBQUE7O0FBQUEsQ0FBQSxFQUFZLElBQUEsRUFBWixVQUFZOztBQUNaLENBREEsRUFDVSxJQUFWLFVBQVU7O0FBQ1YsQ0FGQSxFQUVRLEVBQVIsRUFBUSxRQUFBOztBQUNSLENBSEEsRUFHYyxJQUFBLElBQWQsVUFBYzs7QUFDZCxDQUpBLEVBSWMsSUFBQSxJQUFkLFVBQWM7O0FBQ2QsQ0FMQSxFQUtXLElBQUEsQ0FBWCxVQUFXOztBQUNYLENBTkEsQ0FNQyxJQU5ELENBTW9COztBQUVwQixDQVJBLENBUXdDLENBQXZCLEVBQUEsQ0FBWCxDQUFOLENBQWlCLENBQUEsRUFBQTtDQUVILENBQUEsQ0FBQSxrQkFBRTtDQUVkLENBQUEsQ0FGYyxDQUFEO0NBRWIsQ0FBVyxDQUFILENBQVI7Q0FBQSxFQUVXLENBQVgsQ0FGQSxFQUVBO0NBRkEsR0FJQSxPQUFXLElBQVg7Q0FORCxFQUFhOztDQUFiLEVBUWlCLE1BQUEsTUFBakI7Q0FFSyxDQUFFLEVBQUYsT0FBRCxJQUFIO0NBVkQsRUFRaUI7O0NBUmpCLENBWU8sQ0FBQSxFQUFQLElBQVE7Q0FFUCxPQUFBLEdBQUE7Q0FBQSxFQUFTLENBQVQsRUFBQSxHQUFTLEVBQTBCO0NBQW5DLENBRUEsQ0FBWSxDQUFaLEVBQU07Q0FGTixDQUdnQixDQUFGLENBQWQsRUFBTTtDQUhOLENBSW1CLENBQUYsQ0FBakIsQ0FKQSxDQUlNLENBQU47Q0FKQSxDQU1pQyxFQUFqQyxFQUFpQyxLQUF0QixNQUFYO0FBRUEsQ0FBQSxFQUFBLE1BQUEsRUFBQTtDQUVDLEVBQW1CLENBQVAsQ0FBaUIsQ0FBN0I7Q0FBQSxnQkFBQTtRQUFBO0NBRUEsRUFBRyxDQUFBLEVBQUgsUUFBRztDQUVGLENBQW1DLENBQTVCLENBQXNCLENBQWYsQ0FBUCxFQUFQO1FBTkY7Q0FBQSxJQVJBO0NBRk0sVUFrQk47Q0E5QkQsRUFZTzs7Q0FaUDs7Q0FGZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJHZW5lcmFsc18gPSByZXF1aXJlICcuL21peGluL0dlbmVyYWxzXydcbkxheW91dF8gPSByZXF1aXJlICcuL21peGluL0xheW91dF8nXG5GaWxsXyA9IHJlcXVpcmUgJy4vbWl4aW4vRmlsbF8nXG5UeXBvZ3JhcGh5XyA9IHJlcXVpcmUgJy4vbWl4aW4vVHlwb2dyYXBoeV8nXG5UcmFuc2Zvcm1zXyA9IHJlcXVpcmUgJy4vbWl4aW4vVHJhbnNmb3Jtc18nXG5GaWx0ZXJzXyA9IHJlcXVpcmUgJy4vbWl4aW4vRmlsdGVyc18nXG57Y2xhc3NpYywgb2JqZWN0fSA9IHJlcXVpcmUgJ3V0aWxhJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzaWMubWl4IEdlbmVyYWxzXywgTGF5b3V0XywgRmlsbF8sIFR5cG9ncmFwaHlfLCBUcmFuc2Zvcm1zXywgRmlsdGVyc18sIGNsYXNzIFN0eWxlU2V0dGVyXG5cblx0Y29uc3RydWN0b3I6IChAZWwpIC0+XG5cblx0XHRAbm9kZSA9IEBlbC5ub2RlXG5cblx0XHRAX3N0eWxlcyA9IEBub2RlLnN0eWxlXG5cblx0XHRTdHlsZVNldHRlci5fX2luaXRNaXhpbnNGb3IgQFxuXG5cdF9zY2hlZHVsZVVwZGF0ZTogLT5cblxuXHRcdGRvIEBlbC5fc2NoZWR1bGVVcGRhdGVcblxuXHRjbG9uZTogKGVsKSAtPlxuXG5cdFx0bmV3T2JqID0gT2JqZWN0LmNyZWF0ZSBAY29uc3RydWN0b3I6OlxuXG5cdFx0bmV3T2JqLmVsID0gZWxcblx0XHRuZXdPYmoubm9kZSA9IGVsLm5vZGVcblx0XHRuZXdPYmouX3N0eWxlcyA9IGVsLm5vZGUuc3R5bGVcblxuXHRcdFN0eWxlU2V0dGVyLl9fYXBwbHlDbG9uZXJzRm9yIEAsIFtuZXdPYmpdXG5cblx0XHRmb3Iga2V5IG9mIEBcblxuXHRcdFx0Y29udGludWUgaWYgbmV3T2JqW2tleV0gaXNudCB1bmRlZmluZWRcblxuXHRcdFx0aWYgQGhhc093blByb3BlcnR5IGtleVxuXG5cdFx0XHRcdG5ld09ialtrZXldID0gb2JqZWN0LmNsb25lIEBba2V5XSwgeWVzXG5cblx0XHRuZXdPYmoiXX0=
},{"./mixin/Fill_":30,"./mixin/Filters_":31,"./mixin/Generals_":32,"./mixin/Layout_":33,"./mixin/Transforms_":34,"./mixin/Typography_":35,"utila":24}],30:[function(require,module,exports){
var ColorHolder, Fill_, css;

css = require('../../../../utility/css');

ColorHolder = require('../tools/ColorHolder');

module.exports = Fill_ = (function() {
  function Fill_() {}

  Fill_.prototype.__initMixinFill = function() {
    this.fill = new ColorHolder(this._getFillUpdater());
    return this._fill = {
      bgColor: 'none',
      color: 'inherit',
      border: 'none',
      opacity: 1
    };
  };

  Fill_.prototype.__clonerForFill = function(newStyleSetter) {
    newStyleSetter.fill = this.fill.clone(newStyleSetter._getFillUpdater());
  };

  Fill_.prototype._getFillUpdater = function() {
    var _this = this;
    return function() {
      _this._updateFill();
    };
  };

  Fill_.prototype._updateFill = function() {
    this._styles.backgroundColor = this._fill.bgColor = this.fill._color.toCss();
    return this;
  };

  Fill_.prototype.rotateFillHue = function(amount) {
    this._fill.bgColor.rotateHue(amount);
    return this._styles.backgroundColor = this._fill.bgColor.toCss();
  };

  Fill_.prototype.setTextColor = function(r, g, b) {
    this._styles.color = this._fill.color = css.rgb(r, g, b);
    return null;
  };

  Fill_.prototype.makeHollow = function() {
    return this._styles.bgColor = this._fill.bgColor = 'transparent';
  };

  Fill_.prototype.texturize = function(filename) {
    var addr;
    addr = "./images/" + filename;
    this._styles.background = 'url(' + addr + ')';
    return this;
  };

  Fill_.prototype.setTexturePosition = function(x, y) {
    this._styles.backgroundPosition = "" + x + "px " + y + "px";
    return this;
  };

  Fill_.prototype.setBorder = function(thickness, r, g, b) {
    if (thickness == null) {
      this._styles.border = this._fill.border = 'none';
    } else {
      this._styles.border = this._fill.border = "" + thickness + "px solid " + (css.rgb(r, g, b));
    }
    return this;
  };

  Fill_.prototype.removeBorder = function() {
    this._styles.border = this._fill.border = 'none';
    return this;
  };

  Fill_.prototype.setOpacity = function(d) {
    this._styles.opacity = this._fill.opacity = d;
    return this;
  };

  Fill_.prototype.adjustOpacity = function(d) {
    this._fill.opacity += d;
    this._styles.opacity = this._fill.opacity;
    return this;
  };

  return Fill_;

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsbF8uanMiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLlxcLi5cXC4uXFwuLiIsInNvdXJjZXMiOlsiY29mZmVlXFxsaWJcXGVsXFxtaXhpblxcc3R5bGVTZXR0ZXJcXG1peGluXFxGaWxsXy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxtQkFBQTs7QUFBQSxDQUFBLEVBQUEsSUFBTSxrQkFBQTs7QUFDTixDQURBLEVBQ2MsSUFBQSxJQUFkLFdBQWM7O0FBRWQsQ0FIQSxFQUd1QixHQUFqQixDQUFOO0NBRUM7O0NBQUEsRUFBaUIsTUFBQSxNQUFqQjtDQUVDLEVBQVksQ0FBWixPQUFZLElBQVk7Q0FFdkIsRUFFQSxDQUZBLENBQUQsTUFBQTtDQUVDLENBQVMsSUFBVCxDQUFBO0NBQUEsQ0FFTyxHQUFQLENBQUEsR0FGQTtDQUFBLENBSVEsSUFBUjtDQUpBLENBTVMsSUFBVCxDQUFBO0NBWmU7Q0FBakIsRUFBaUI7O0NBQWpCLEVBY2lCLE1BQUMsS0FBRCxDQUFqQjtDQUVDLEVBQXNCLENBQXRCLENBQXNCLFNBQVIsQ0FBb0I7Q0FoQm5DLEVBY2lCOztDQWRqQixFQW9CaUIsTUFBQSxNQUFqQjtDQUVDLE9BQUEsSUFBQTtHQUFBLE1BQUEsRUFBQTtDQUVDLElBQUksQ0FBRCxLQUFIO0NBSmUsSUFFaEI7Q0F0QkQsRUFvQmlCOztDQXBCakIsRUE0QmEsTUFBQSxFQUFiO0NBRUMsRUFBMkIsQ0FBM0IsQ0FBaUMsQ0FBdUIsQ0FBaEQsUUFBUjtDQUZZLFVBSVo7Q0FoQ0QsRUE0QmE7O0NBNUJiLEVBa0NlLEdBQUEsR0FBQyxJQUFoQjtDQUVDLEdBQUEsQ0FBTSxDQUFOLENBQWMsRUFBZDtDQUVDLEVBQTBCLENBQTFCLENBQWdDLEVBQXpCLElBQVIsSUFBQTtDQXRDRCxFQWtDZTs7Q0FsQ2YsQ0F3Q2tCLENBQUosTUFBQyxHQUFmO0NBRUMsQ0FBMkMsQ0FBMUIsQ0FBakIsQ0FBQSxFQUFRO0NBRkssVUFJYjtDQTVDRCxFQXdDYzs7Q0F4Q2QsRUE4Q1ksTUFBQSxDQUFaO0NBRUUsRUFBa0IsQ0FBbEIsQ0FBd0IsRUFBakIsSUFBUjtDQWhERCxFQThDWTs7Q0E5Q1osRUFrRFcsS0FBQSxDQUFYO0NBRUMsR0FBQSxJQUFBO0NBQUEsRUFBUSxDQUFSLElBQUEsR0FBUTtDQUFSLEVBRXNCLENBQXRCLEVBQXNCLENBQWQsR0FBUjtDQUpVLFVBTVY7Q0F4REQsRUFrRFc7O0NBbERYLENBMER3QixDQUFKLE1BQUMsU0FBckI7Q0FFQyxDQUE4QixDQUFBLENBQTlCLENBQThCLEVBQXRCLFdBQVI7Q0FGbUIsVUFJbkI7Q0E5REQsRUEwRG9COztDQTFEcEIsQ0FnRXVCLENBQVosTUFBWDtDQUVDLEdBQUEsYUFBQTtDQUVDLEVBQWtCLENBQWpCLENBQXVCLENBQXhCLENBQVE7TUFGVDtDQU1DLENBQWtDLENBQWhCLENBQWpCLENBQXVCLENBQXhCLENBQVEsRUFBMEIsRUFBQTtNQU5uQztDQUZVLFVBVVY7Q0ExRUQsRUFnRVc7O0NBaEVYLEVBNEVjLE1BQUEsR0FBZDtDQUVDLEVBQWtCLENBQWxCLENBQXdCLENBQXhCLENBQVE7Q0FGSyxVQUliO0NBaEZELEVBNEVjOztDQTVFZCxFQWtGWSxNQUFDLENBQWI7Q0FFQyxFQUFtQixDQUFuQixDQUF5QixFQUFqQjtDQUZHLFVBSVg7Q0F0RkQsRUFrRlk7O0NBbEZaLEVBd0ZlLE1BQUMsSUFBaEI7Q0FFQyxHQUFBLENBQU0sRUFBTjtDQUFBLEVBRW1CLENBQW5CLENBQXlCLEVBQWpCO0NBSk0sVUFNZDtDQTlGRCxFQXdGZTs7Q0F4RmY7O0NBTEQiLCJzb3VyY2VzQ29udGVudCI6WyJjc3MgPSByZXF1aXJlICcuLi8uLi8uLi8uLi91dGlsaXR5L2NzcydcbkNvbG9ySG9sZGVyID0gcmVxdWlyZSAnLi4vdG9vbHMvQ29sb3JIb2xkZXInXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgRmlsbF9cblxuXHRfX2luaXRNaXhpbkZpbGw6IC0+XG5cblx0XHRAZmlsbCA9IG5ldyBDb2xvckhvbGRlciBAX2dldEZpbGxVcGRhdGVyKClcblxuXHRcdEBfZmlsbCA9XG5cblx0XHRcdGJnQ29sb3I6ICdub25lJ1xuXG5cdFx0XHRjb2xvcjogJ2luaGVyaXQnXG5cblx0XHRcdGJvcmRlcjogJ25vbmUnXG5cblx0XHRcdG9wYWNpdHk6IDFcblxuXHRfX2Nsb25lckZvckZpbGw6IChuZXdTdHlsZVNldHRlcikgLT5cblxuXHRcdG5ld1N0eWxlU2V0dGVyLmZpbGwgPSBAZmlsbC5jbG9uZSBuZXdTdHlsZVNldHRlci5fZ2V0RmlsbFVwZGF0ZXIoKVxuXG5cdFx0cmV0dXJuXG5cblx0X2dldEZpbGxVcGRhdGVyOiAtPlxuXG5cdFx0PT5cblxuXHRcdFx0ZG8gQF91cGRhdGVGaWxsXG5cblx0XHRcdHJldHVyblxuXG5cdF91cGRhdGVGaWxsOiAtPlxuXG5cdFx0QF9zdHlsZXMuYmFja2dyb3VuZENvbG9yID0gQF9maWxsLmJnQ29sb3IgPSBAZmlsbC5fY29sb3IudG9Dc3MoKVxuXG5cdFx0QFxuXG5cdHJvdGF0ZUZpbGxIdWU6IChhbW91bnQpIC0+XG5cblx0XHRAX2ZpbGwuYmdDb2xvci5yb3RhdGVIdWUgYW1vdW50XG5cblx0XHRAX3N0eWxlcy5iYWNrZ3JvdW5kQ29sb3IgPSBAX2ZpbGwuYmdDb2xvci50b0NzcygpXG5cblx0c2V0VGV4dENvbG9yOiAociwgZywgYikgLT5cblxuXHRcdEBfc3R5bGVzLmNvbG9yID0gQF9maWxsLmNvbG9yID0gY3NzLnJnYiByLCBnLCBiXG5cblx0XHRudWxsXG5cblx0bWFrZUhvbGxvdzogLT5cblxuXHRcdEBfc3R5bGVzLmJnQ29sb3IgPSBAX2ZpbGwuYmdDb2xvciA9ICd0cmFuc3BhcmVudCdcblxuXHR0ZXh0dXJpemU6IChmaWxlbmFtZSkgLT5cblxuXHRcdGFkZHIgPSBcIi4vaW1hZ2VzLyN7ZmlsZW5hbWV9XCJcblxuXHRcdEBfc3R5bGVzLmJhY2tncm91bmQgPSAndXJsKCcgKyBhZGRyICsgJyknXG5cblx0XHRAXG5cblx0c2V0VGV4dHVyZVBvc2l0aW9uOiAoeCwgeSkgLT5cblxuXHRcdEBfc3R5bGVzLmJhY2tncm91bmRQb3NpdGlvbiA9IFwiI3t4fXB4ICN7eX1weFwiXG5cblx0XHRAXG5cblx0c2V0Qm9yZGVyOiAodGhpY2tuZXNzLCByLCBnLCBiKSAtPlxuXG5cdFx0dW5sZXNzIHRoaWNrbmVzcz9cblxuXHRcdFx0QF9zdHlsZXMuYm9yZGVyID0gQF9maWxsLmJvcmRlciA9ICdub25lJ1xuXG5cdFx0ZWxzZVxuXG5cdFx0XHRAX3N0eWxlcy5ib3JkZXIgPSBAX2ZpbGwuYm9yZGVyID0gXCIje3RoaWNrbmVzc31weCBzb2xpZCAje2Nzcy5yZ2IociwgZywgYil9XCJcblxuXHRcdEBcblxuXHRyZW1vdmVCb3JkZXI6IC0+XG5cblx0XHRAX3N0eWxlcy5ib3JkZXIgPSBAX2ZpbGwuYm9yZGVyID0gJ25vbmUnXG5cblx0XHRAXG5cblx0c2V0T3BhY2l0eTogKGQpIC0+XG5cblx0XHRAX3N0eWxlcy5vcGFjaXR5ID0gQF9maWxsLm9wYWNpdHkgPSBkXG5cblx0XHRAXG5cblx0YWRqdXN0T3BhY2l0eTogKGQpIC0+XG5cblx0XHRAX2ZpbGwub3BhY2l0eSArPSBkO1xuXG5cdFx0QF9zdHlsZXMub3BhY2l0eSA9IEBfZmlsbC5vcGFjaXR5XG5cblx0XHRAIl19
},{"../../../../utility/css":42,"../tools/ColorHolder":36}],31:[function(require,module,exports){
var CSSFilter, ClassPrototype, Filters_, css, method, methodName, _fn, _ref;

CSSFilter = require('../../../../visuals/Filter');

css = require('../../../../utility/css');

module.exports = Filters_ = (function() {
  function Filters_() {}

  Filters_.prototype.__initMixinFilters = function() {
    this._cssFilter = new CSSFilter;
    return this._shouldUpdateFilters = false;
  };

  Filters_.prototype.__clonerForFilters = function(newStyleSetter) {
    newStyleSetter._shouldUpdateFilters = false;
  };

  Filters_.prototype._updateFilters = function() {
    if (!this._shouldUpdateFilters) {
      return;
    }
    this._shouldUpdateFilters = false;
    return this._actuallyUpdateFilters();
  };

  Filters_.prototype._scheduleFiltersUpdate = function() {
    this._shouldUpdateFilters = true;
    return this._scheduleUpdate();
  };

  Filters_.prototype._actuallyUpdateFilters = function() {
    css.setCssFilter(this.node, this._cssFilter.toCss());
    return this;
  };

  return Filters_;

})();

ClassPrototype = Filters_.prototype;

_ref = CSSFilter.prototype;
_fn = function() {
  var _methodName;
  _methodName = methodName;
  if (method.length === 0) {
    return ClassPrototype[_methodName] = function() {
      this._cssFilter[_methodName]();
      this._scheduleFiltersUpdate();
      return this;
    };
  } else if (method.length === 1) {
    return ClassPrototype[_methodName] = function(arg0) {
      this._cssFilter[_methodName](arg0);
      this._scheduleFiltersUpdate();
      return this;
    };
  } else if (method.length === 2) {
    return ClassPrototype[_methodName] = function(arg0, arg1) {
      this._cssFilter[_methodName](arg0, arg1);
      this._scheduleFiltersUpdate();
      return this;
    };
  } else if (method.length === 3) {
    return ClassPrototype[_methodName] = function(arg0, arg1, arg2) {
      this._cssFilter[_methodName](arg0, arg1, arg2);
      this._scheduleFiltersUpdate();
      return this;
    };
  } else if (method.length === 4) {
    return ClassPrototype[_methodName] = function(arg0, arg1, arg2, arg3) {
      this._cssFilter[_methodName](arg0, arg1, arg2, arg3);
      this._scheduleFiltersUpdate();
      return this;
    };
  } else if (method.length === 5) {
    return ClassPrototype[_methodName] = function(arg0, arg1, arg2, arg3, arg4) {
      this._cssFilter[_methodName](arg0, arg1, arg2, arg3, arg4);
      this._scheduleFiltersUpdate();
      return this;
    };
  } else {
    throw Error("Methods with more than 5 args are not supported.");
  }
};
for (methodName in _ref) {
  method = _ref[methodName];
  if (!(method instanceof Function)) {
    continue;
  }
  if (ClassPrototype[methodName] != null) {
    continue;
  }
  if (methodName[0] === '_') {
    continue;
  }
  if (methodName === 'toCss') {
    continue;
  }
  _fn();
}

Filters_;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsdGVyc18uanMiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLlxcLi5cXC4uXFwuLiIsInNvdXJjZXMiOlsiY29mZmVlXFxsaWJcXGVsXFxtaXhpblxcc3R5bGVTZXR0ZXJcXG1peGluXFxGaWx0ZXJzXy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxtRUFBQTs7QUFBQSxDQUFBLEVBQVksSUFBQSxFQUFaLG1CQUFZOztBQUNaLENBREEsRUFDQSxJQUFNLGtCQUFBOztBQUVOLENBSEEsRUFHdUIsR0FBakIsQ0FBTjtDQUVDOztDQUFBLEVBQW9CLE1BQUEsU0FBcEI7QUFFZSxDQUFkLEVBQWMsQ0FBZCxLQUFBLENBQUE7Q0FFQyxFQUF1QixDQUF2QixPQUFELFNBQUE7Q0FKRCxFQUFvQjs7Q0FBcEIsRUFNb0IsTUFBQyxLQUFELElBQXBCO0NBRUMsRUFBc0MsQ0FBdEMsQ0FBQSxTQUFjLE1BQWQ7Q0FSRCxFQU1vQjs7Q0FOcEIsRUFZZ0IsTUFBQSxLQUFoQjtBQUVlLENBQWQsR0FBQSxnQkFBQTtDQUFBLFdBQUE7TUFBQTtDQUFBLEVBRXdCLENBQXhCLENBRkEsZUFFQTtDQUVJLEdBQUEsT0FBRCxXQUFIO0NBbEJELEVBWWdCOztDQVpoQixFQW9Cd0IsTUFBQSxhQUF4QjtDQUVDLEVBQXdCLENBQXhCLGdCQUFBO0NBRUksR0FBQSxPQUFELElBQUg7Q0F4QkQsRUFvQndCOztDQXBCeEIsRUEwQndCLE1BQUEsYUFBeEI7Q0FFQyxDQUF3QixDQUFyQixDQUFILENBQXdCLEtBQVcsRUFBbkM7Q0FGdUIsVUFJdkI7Q0E5QkQsRUEwQndCOztDQTFCeEI7O0NBTEQ7O0FBcUNBLENBckNBLEVBcUNpQixLQUFRLENBckN6QixLQXFDQTs7Q0FFQTtDQUFBLEVBVUksTUFBQTtDQUVGLEtBQUEsS0FBQTtDQUFBLENBQUEsQ0FBYyxPQUFkLENBQUE7Q0FFQSxDQUFBLEVBQUcsQ0FBaUIsQ0FBWDtDQUVPLEVBQWdCLE1BQUEsRUFBL0IsR0FBZTtDQUtkLEdBQUMsRUFBRCxJQUFZLENBQUE7Q0FBWixHQUVJLEVBQUQsZ0JBQUg7Q0FQOEIsWUFTOUI7Q0FYRixJQUVnQztDQVdqQixHQWJmLENBYXlCLENBYnpCO0NBZWdCLEVBQWUsQ0FBQSxLQUFDLEVBQS9CLEdBQWU7Q0FFZCxHQUFDLEVBQUQsSUFBWSxDQUFBO0NBQVosR0FFSSxFQUFELGdCQUFIO0NBSjZCLFlBTTdCO0NBckJGLElBZStCO0NBUWhCLEdBdkJmLENBdUJ5QixDQXZCekI7Q0F5QmdCLENBQXNCLENBQVAsQ0FBQSxLQUFDLEVBQS9CLEdBQWU7Q0FFZCxDQUErQixFQUE5QixFQUFELElBQVksQ0FBQTtDQUFaLEdBRUksRUFBRCxnQkFBSDtDQUo2QixZQU03QjtDQS9CRixJQXlCK0I7Q0FRaEIsR0FqQ2YsQ0FpQ3lCLENBakN6QjtDQW1DZ0IsQ0FBc0IsQ0FBUCxDQUFBLEtBQUMsRUFBL0IsR0FBZTtDQUVkLENBQStCLEVBQTlCLEVBQUQsSUFBWSxDQUFBO0NBQVosR0FFSSxFQUFELGdCQUFIO0NBSjZCLFlBTTdCO0NBekNGLElBbUMrQjtDQVFoQixHQTNDZixDQTJDeUIsQ0EzQ3pCO0NBNkNnQixDQUFzQixDQUFQLENBQUEsS0FBQyxFQUEvQixHQUFlO0NBRWQsQ0FBK0IsRUFBOUIsRUFBRCxJQUFZLENBQUE7Q0FBWixHQUVJLEVBQUQsZ0JBQUg7Q0FKNkIsWUFNN0I7Q0FuREYsSUE2QytCO0NBUWhCLEdBckRmLENBcUR5QixDQXJEekI7Q0F1RGdCLENBQXNCLENBQVAsQ0FBQSxLQUFDLEVBQS9CLEdBQWU7Q0FFZCxDQUErQixFQUE5QixFQUFELElBQVksQ0FBQTtDQUFaLEdBRUksRUFBRCxnQkFBSDtDQUo2QixZQU03QjtDQTdERixJQXVEK0I7SUF2RC9CLEVBQUE7Q0FpRUMsSUFBTSxLQUFBLHdDQUFBO0lBckVMO0NBQUE7Q0FWSixJQUFBLGFBQUE7NkJBQUE7QUFFQyxDQUFBLENBQUEsRUFBQSxFQUFnQixFQUFoQixJQUFrQztDQUFsQyxZQUFBO0lBQUE7Q0FFQSxDQUFBLEVBQVksOEJBQVo7Q0FBQSxZQUFBO0lBRkE7Q0FJQSxDQUFBLENBQUEsQ0FBWSxDQUFpQixLQUFOO0NBQXZCLFlBQUE7SUFKQTtDQU1BLENBQUEsRUFBWSxDQUFjLEVBQTFCLEdBQVk7Q0FBWixZQUFBO0lBTkE7Q0FBQTtDQUZEOztBQWlGQSxDQXhIQSxPQUFBIiwic291cmNlc0NvbnRlbnQiOlsiQ1NTRmlsdGVyID0gcmVxdWlyZSAnLi4vLi4vLi4vLi4vdmlzdWFscy9GaWx0ZXInXG5jc3MgPSByZXF1aXJlICcuLi8uLi8uLi8uLi91dGlsaXR5L2NzcydcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBGaWx0ZXJzX1xuXG5cdF9faW5pdE1peGluRmlsdGVyczogLT5cblxuXHRcdEBfY3NzRmlsdGVyID0gbmV3IENTU0ZpbHRlclxuXG5cdFx0QF9zaG91bGRVcGRhdGVGaWx0ZXJzID0gbm9cblxuXHRfX2Nsb25lckZvckZpbHRlcnM6IChuZXdTdHlsZVNldHRlcikgLT5cblxuXHRcdG5ld1N0eWxlU2V0dGVyLl9zaG91bGRVcGRhdGVGaWx0ZXJzID0gbm9cblxuXHRcdHJldHVyblxuXG5cdF91cGRhdGVGaWx0ZXJzOiAtPlxuXG5cdFx0cmV0dXJuIHVubGVzcyBAX3Nob3VsZFVwZGF0ZUZpbHRlcnNcblxuXHRcdEBfc2hvdWxkVXBkYXRlRmlsdGVycyA9IG5vXG5cblx0XHRkbyBAX2FjdHVhbGx5VXBkYXRlRmlsdGVyc1xuXG5cdF9zY2hlZHVsZUZpbHRlcnNVcGRhdGU6IC0+XG5cblx0XHRAX3Nob3VsZFVwZGF0ZUZpbHRlcnMgPSB5ZXNcblxuXHRcdGRvIEBfc2NoZWR1bGVVcGRhdGVcblxuXHRfYWN0dWFsbHlVcGRhdGVGaWx0ZXJzOiAtPlxuXG5cdFx0Y3NzLnNldENzc0ZpbHRlciBAbm9kZSwgQF9jc3NGaWx0ZXIudG9Dc3MoKVxuXG5cdFx0QFxuXG5DbGFzc1Byb3RvdHlwZSA9IEZpbHRlcnNfLnByb3RvdHlwZVxuXG5mb3IgbWV0aG9kTmFtZSwgbWV0aG9kIG9mIENTU0ZpbHRlci5wcm90b3R5cGVcblxuXHRjb250aW51ZSB1bmxlc3MgbWV0aG9kIGluc3RhbmNlb2YgRnVuY3Rpb25cblxuXHRjb250aW51ZSBpZiBDbGFzc1Byb3RvdHlwZVttZXRob2ROYW1lXT9cblxuXHRjb250aW51ZSBpZiBtZXRob2ROYW1lWzBdIGlzICdfJ1xuXG5cdGNvbnRpbnVlIGlmIG1ldGhvZE5hbWUgaXMgJ3RvQ3NzJ1xuXG5cdGRvIC0+XG5cblx0XHRfbWV0aG9kTmFtZSA9IG1ldGhvZE5hbWVcblxuXHRcdGlmIG1ldGhvZC5sZW5ndGggaXMgMFxuXG5cdFx0XHRDbGFzc1Byb3RvdHlwZVtfbWV0aG9kTmFtZV0gPSAgLT5cblxuXHRcdFx0XHQjIFRoaXMgaXMgbW9yZSBwZXJmb3JtYW50IHRoYW4gbWV0aG9kLmFwcGx5KClcblx0XHRcdFx0I1xuXHRcdFx0XHQjIEFyZ3VtZW50IHNwbGF0cyB3b24ndCB3b3JrIGhlcmUgdGhvdWdoLlxuXHRcdFx0XHRAX2Nzc0ZpbHRlcltfbWV0aG9kTmFtZV0oKVxuXG5cdFx0XHRcdGRvIEBfc2NoZWR1bGVGaWx0ZXJzVXBkYXRlXG5cblx0XHRcdFx0QFxuXG5cdFx0ZWxzZSBpZiBtZXRob2QubGVuZ3RoIGlzIDFcblxuXHRcdFx0Q2xhc3NQcm90b3R5cGVbX21ldGhvZE5hbWVdID0gKGFyZzApIC0+XG5cblx0XHRcdFx0QF9jc3NGaWx0ZXJbX21ldGhvZE5hbWVdIGFyZzBcblxuXHRcdFx0XHRkbyBAX3NjaGVkdWxlRmlsdGVyc1VwZGF0ZVxuXG5cdFx0XHRcdEBcblxuXHRcdGVsc2UgaWYgbWV0aG9kLmxlbmd0aCBpcyAyXG5cblx0XHRcdENsYXNzUHJvdG90eXBlW19tZXRob2ROYW1lXSA9IChhcmcwLCBhcmcxKSAtPlxuXG5cdFx0XHRcdEBfY3NzRmlsdGVyW19tZXRob2ROYW1lXSBhcmcwLCBhcmcxXG5cblx0XHRcdFx0ZG8gQF9zY2hlZHVsZUZpbHRlcnNVcGRhdGVcblxuXHRcdFx0XHRAXG5cblx0XHRlbHNlIGlmIG1ldGhvZC5sZW5ndGggaXMgM1xuXG5cdFx0XHRDbGFzc1Byb3RvdHlwZVtfbWV0aG9kTmFtZV0gPSAoYXJnMCwgYXJnMSwgYXJnMikgLT5cblxuXHRcdFx0XHRAX2Nzc0ZpbHRlcltfbWV0aG9kTmFtZV0gYXJnMCwgYXJnMSwgYXJnMlxuXG5cdFx0XHRcdGRvIEBfc2NoZWR1bGVGaWx0ZXJzVXBkYXRlXG5cblx0XHRcdFx0QFxuXG5cdFx0ZWxzZSBpZiBtZXRob2QubGVuZ3RoIGlzIDRcblxuXHRcdFx0Q2xhc3NQcm90b3R5cGVbX21ldGhvZE5hbWVdID0gKGFyZzAsIGFyZzEsIGFyZzIsIGFyZzMpIC0+XG5cblx0XHRcdFx0QF9jc3NGaWx0ZXJbX21ldGhvZE5hbWVdIGFyZzAsIGFyZzEsIGFyZzIsIGFyZzNcblxuXHRcdFx0XHRkbyBAX3NjaGVkdWxlRmlsdGVyc1VwZGF0ZVxuXG5cdFx0XHRcdEBcblxuXHRcdGVsc2UgaWYgbWV0aG9kLmxlbmd0aCBpcyA1XG5cblx0XHRcdENsYXNzUHJvdG90eXBlW19tZXRob2ROYW1lXSA9IChhcmcwLCBhcmcxLCBhcmcyLCBhcmczLCBhcmc0KSAtPlxuXG5cdFx0XHRcdEBfY3NzRmlsdGVyW19tZXRob2ROYW1lXSBhcmcwLCBhcmcxLCBhcmcyLCBhcmczLCBhcmc0XG5cblx0XHRcdFx0ZG8gQF9zY2hlZHVsZUZpbHRlcnNVcGRhdGVcblxuXHRcdFx0XHRAXG5cblx0XHRlbHNlXG5cblx0XHRcdHRocm93IEVycm9yIFwiTWV0aG9kcyB3aXRoIG1vcmUgdGhhbiA1IGFyZ3MgYXJlIG5vdCBzdXBwb3J0ZWQuXCJcblxuRmlsdGVyc18iXX0=
},{"../../../../utility/css":42,"../../../../visuals/Filter":45}],32:[function(require,module,exports){
var General_, css;

css = require('../../../../utility/css');

module.exports = General_ = (function() {
  function General_() {}

  General_.prototype.z = function(i) {
    this.node.style.zIndex = i;
    return this;
  };

  General_.prototype.css = function(prop, val) {
    this._styles[prop] = val;
    return this;
  };

  General_.prototype.addClass = function(c) {
    this.node.classList.add(c);
    return this;
  };

  General_.prototype.removeClass = function(c) {
    this.node.classList.remove(c);
    return this;
  };

  General_.prototype.toggleClass = function(c) {
    this.node.classList.toggle(c);
    return this;
  };

  General_.prototype.setClass = function(c) {
    this.node.className = c;
    return this;
  };

  return General_;

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2VuZXJhbHNfLmpzIiwic291cmNlUm9vdCI6Ii4uXFwuLlxcLi5cXC4uXFwuLlxcLi4iLCJzb3VyY2VzIjpbImNvZmZlZVxcbGliXFxlbFxcbWl4aW5cXHN0eWxlU2V0dGVyXFxtaXhpblxcR2VuZXJhbHNfLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLFNBQUE7O0FBQUEsQ0FBQSxFQUFBLElBQU0sa0JBQUE7O0FBRU4sQ0FGQSxFQUV1QixHQUFqQixDQUFOO0NBRUM7O0NBQUEsRUFBRyxNQUFDO0NBRUgsRUFBcUIsQ0FBckIsQ0FBVyxDQUFYO0NBRkUsVUFJRjtDQUpELEVBQUc7O0NBQUgsQ0FNWSxDQUFaLENBQUssS0FBQztDQUVMLEVBQWlCLENBQWpCLEdBQVM7Q0FGTCxVQUlKO0NBVkQsRUFNSzs7Q0FOTCxFQVlVLEtBQVYsQ0FBVztDQUVWLEVBQUEsQ0FBQSxLQUFlO0NBRk4sVUFJVDtDQWhCRCxFQVlVOztDQVpWLEVBa0JhLE1BQUMsRUFBZDtDQUVDLEdBQUEsRUFBQSxHQUFlO0NBRkgsVUFJWjtDQXRCRCxFQWtCYTs7Q0FsQmIsRUF3QmEsTUFBQyxFQUFkO0NBRUMsR0FBQSxFQUFBLEdBQWU7Q0FGSCxVQUlaO0NBNUJELEVBd0JhOztDQXhCYixFQThCVSxLQUFWLENBQVc7Q0FFVixFQUFrQixDQUFsQixLQUFBO0NBRlMsVUFJVDtDQWxDRCxFQThCVTs7Q0E5QlY7O0NBSkQiLCJzb3VyY2VzQ29udGVudCI6WyJjc3MgPSByZXF1aXJlICcuLi8uLi8uLi8uLi91dGlsaXR5L2NzcydcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBHZW5lcmFsX1xuXG5cdHo6IChpKSAtPlxuXG5cdFx0QG5vZGUuc3R5bGUuekluZGV4ID0gaVxuXG5cdFx0QFxuXG5cdGNzczogKHByb3AsIHZhbCkgLT5cblxuXHRcdEBfc3R5bGVzW3Byb3BdID0gdmFsXG5cblx0XHRAXG5cblx0YWRkQ2xhc3M6IChjKSAtPlxuXG5cdFx0QG5vZGUuY2xhc3NMaXN0LmFkZCBjXG5cblx0XHRAXG5cblx0cmVtb3ZlQ2xhc3M6IChjKSAtPlxuXG5cdFx0QG5vZGUuY2xhc3NMaXN0LnJlbW92ZSBjXG5cblx0XHRAXG5cblx0dG9nZ2xlQ2xhc3M6IChjKSAtPlxuXG5cdFx0QG5vZGUuY2xhc3NMaXN0LnRvZ2dsZSBjXG5cblx0XHRAXG5cblx0c2V0Q2xhc3M6IChjKSAtPlxuXG5cdFx0QG5vZGUuY2xhc3NOYW1lID0gY1xuXG5cdFx0QCJdfQ==
},{"../../../../utility/css":42}],33:[function(require,module,exports){
var Layout_;

module.exports = Layout_ = (function() {
  function Layout_() {}

  Layout_.prototype.__initMixinLayout = function() {
    return this._layout = {
      width: null,
      height: null,
      clipLeft: 'auto',
      clipRight: 'auto',
      clipTop: 'auto',
      clipBottom: 'auto'
    };
  };

  Layout_.prototype.setWidth = function(w) {
    this._layout.width = w;
    this._styles.width = w + 'px';
    return this;
  };

  Layout_.prototype.setHeight = function(h) {
    this._layout.height = h;
    this._styles.height = h + 'px';
    return this;
  };

  Layout_.prototype.clip = function(top, right, bottom, left) {
    this._layout.clipTop = top;
    this._layout.clipRight = right;
    this._layout.clipBottom = bottom;
    this._layout.clipLeft = left;
    if (typeof top === 'number') {
      top += 'px';
    }
    if (typeof right === 'number') {
      right += 'px';
    }
    if (typeof bottom === 'number') {
      bottom += 'px';
    }
    if (typeof left === 'number') {
      left += 'px';
    }
    this._styles.clip = "rect(" + top + ", " + right + ", " + bottom + ", " + left + ")";
    return this;
  };

  Layout_.prototype.unclip = function() {
    this.clip('auto', 'auto', 'auto', 'auto');
    return this;
  };

  Layout_.prototype.clipTop = function(a) {
    return this.clip(a, this._layout.clipRight, this._layout.clipBottom, this._layout.clipLeft);
  };

  Layout_.prototype.clipRight = function(a) {
    return this.clip(this._layout.clipTop, a, this._layout.clipBottom, this._layout.clipLeft);
  };

  Layout_.prototype.clipBottom = function(a) {
    return this.clip(this._layout.clipTop, this._layout.clipRight, a, this._layout.clipLeft);
  };

  Layout_.prototype.clipLeft = function(a) {
    return this.clip(this._layout.clipTop, this._layout.clipRight, this._layout.clipBottom, a);
  };

  return Layout_;

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGF5b3V0Xy5qcyIsInNvdXJjZVJvb3QiOiIuLlxcLi5cXC4uXFwuLlxcLi5cXC4uIiwic291cmNlcyI6WyJjb2ZmZWVcXGxpYlxcZWxcXG1peGluXFxzdHlsZVNldHRlclxcbWl4aW5cXExheW91dF8uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsR0FBQTs7QUFBQSxDQUFBLEVBQXVCLEdBQWpCLENBQU47Q0FFQzs7Q0FBQSxFQUFtQixNQUFBLFFBQW5CO0NBRUUsRUFFQSxDQUZBLEdBQUQsSUFBQTtDQUVDLENBQU8sRUFBUCxDQUFBLENBQUE7Q0FBQSxDQUVRLEVBRlIsRUFFQTtDQUZBLENBSVUsSUFBVixFQUFBO0NBSkEsQ0FNVyxJQUFYLEdBQUE7Q0FOQSxDQVFTLElBQVQsQ0FBQTtDQVJBLENBVVksSUFBWixJQUFBO0NBZGlCO0NBQW5CLEVBQW1COztDQUFuQixFQWdCVSxLQUFWLENBQVc7Q0FFVixFQUFpQixDQUFqQixDQUFBLEVBQVE7Q0FBUixFQUVpQixDQUFqQixDQUFBLEVBQVE7Q0FKQyxVQU1UO0NBdEJELEVBZ0JVOztDQWhCVixFQXdCVyxNQUFYO0NBRUMsRUFBa0IsQ0FBbEIsRUFBQSxDQUFRO0NBQVIsRUFFa0IsQ0FBbEIsRUFBQSxDQUFRO0NBSkUsVUFNVjtDQTlCRCxFQXdCVzs7Q0F4QlgsQ0FnQ1ksQ0FBTixDQUFOLENBQU0sQ0FBQSxHQUFDO0NBRU4sRUFBbUIsQ0FBbkIsR0FBUTtDQUFSLEVBQ3FCLENBQXJCLENBREEsRUFDUSxFQUFSO0NBREEsRUFFc0IsQ0FBdEIsRUFGQSxDQUVRLEdBQVI7Q0FGQSxFQUdvQixDQUFwQixHQUFRLENBQVI7QUFFRyxDQUFILEVBQUcsQ0FBSCxDQUFpQixDQUFkLEVBQUg7Q0FBK0IsRUFBQSxDQUFPLEVBQVA7TUFML0I7QUFNRyxDQUFILEdBQUEsQ0FBRyxDQUFBLEVBQUg7Q0FBaUMsR0FBUyxDQUFULENBQUE7TUFOakM7QUFPRyxDQUFILEdBQUEsQ0FBb0IsQ0FBakIsRUFBSDtDQUFrQyxHQUFVLEVBQVY7TUFQbEM7QUFRRyxDQUFILEdBQUEsQ0FBa0IsQ0FBZixFQUFIO0NBQWdDLEdBQUEsRUFBQTtNQVJoQztDQUFBLEVBVWlCLENBQWpCLENBQWlCLENBQUEsQ0FBVDtDQVpILFVBY0w7Q0E5Q0QsRUFnQ007O0NBaENOLEVBZ0RRLEdBQVIsR0FBUTtDQUVQLENBQWMsRUFBZCxFQUFBO0NBRk8sVUFJUDtDQXBERCxFQWdEUTs7Q0FoRFIsRUFzRFMsSUFBVCxFQUFVO0NBRVIsQ0FBUSxFQUFSLEdBQWdCLENBQWpCLENBQUEsQ0FBQSxDQUFBO0NBeERELEVBc0RTOztDQXREVCxFQTBEVyxNQUFYO0NBRUUsQ0FBdUIsRUFBdkIsR0FBYSxDQUFkLEVBQUEsQ0FBQTtDQTVERCxFQTBEVzs7Q0ExRFgsRUE4RFksTUFBQyxDQUFiO0NBRUUsQ0FBdUIsRUFBdkIsR0FBYSxDQUFkLENBQUEsRUFBQTtDQWhFRCxFQThEWTs7Q0E5RFosRUFrRVUsS0FBVixDQUFXO0NBRVQsQ0FBdUIsRUFBdkIsR0FBYSxFQUFkLENBQUEsQ0FBQTtDQXBFRCxFQWtFVTs7Q0FsRVY7O0NBRkQiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIExheW91dF9cblxuXHRfX2luaXRNaXhpbkxheW91dDogLT5cblxuXHRcdEBfbGF5b3V0ID1cblxuXHRcdFx0d2lkdGg6IG51bGxcblxuXHRcdFx0aGVpZ2h0OiBudWxsXG5cblx0XHRcdGNsaXBMZWZ0OiAnYXV0bydcblxuXHRcdFx0Y2xpcFJpZ2h0OiAnYXV0bydcblxuXHRcdFx0Y2xpcFRvcDogJ2F1dG8nXG5cblx0XHRcdGNsaXBCb3R0b206ICdhdXRvJ1xuXG5cdHNldFdpZHRoOiAodykgLT5cblxuXHRcdEBfbGF5b3V0LndpZHRoID0gd1xuXG5cdFx0QF9zdHlsZXMud2lkdGggPSB3ICsgJ3B4J1xuXG5cdFx0QFxuXG5cdHNldEhlaWdodDogKGgpIC0+XG5cblx0XHRAX2xheW91dC5oZWlnaHQgPSBoXG5cblx0XHRAX3N0eWxlcy5oZWlnaHQgPSBoICsgJ3B4J1xuXG5cdFx0QFxuXG5cdGNsaXA6ICh0b3AsIHJpZ2h0LCBib3R0b20sIGxlZnQpIC0+XG5cblx0XHRAX2xheW91dC5jbGlwVG9wID0gdG9wXG5cdFx0QF9sYXlvdXQuY2xpcFJpZ2h0ID0gcmlnaHRcblx0XHRAX2xheW91dC5jbGlwQm90dG9tID0gYm90dG9tXG5cdFx0QF9sYXlvdXQuY2xpcExlZnQgPSBsZWZ0XG5cblx0XHRpZiB0eXBlb2YgdG9wIGlzICdudW1iZXInIHRoZW4gdG9wICs9ICdweCdcblx0XHRpZiB0eXBlb2YgcmlnaHQgaXMgJ251bWJlcicgdGhlbiByaWdodCArPSAncHgnXG5cdFx0aWYgdHlwZW9mIGJvdHRvbSBpcyAnbnVtYmVyJyB0aGVuIGJvdHRvbSArPSAncHgnXG5cdFx0aWYgdHlwZW9mIGxlZnQgaXMgJ251bWJlcicgdGhlbiBsZWZ0ICs9ICdweCdcblxuXHRcdEBfc3R5bGVzLmNsaXAgPSBcInJlY3QoI3t0b3B9LCAje3JpZ2h0fSwgI3tib3R0b219LCAje2xlZnR9KVwiXG5cblx0XHRAXG5cblx0dW5jbGlwOiAtPlxuXG5cdFx0QGNsaXAgJ2F1dG8nLCAnYXV0bycsICdhdXRvJywgJ2F1dG8nXG5cblx0XHRAXG5cblx0Y2xpcFRvcDogKGEpIC0+XG5cblx0XHRAY2xpcCBhLCBAX2xheW91dC5jbGlwUmlnaHQsIEBfbGF5b3V0LmNsaXBCb3R0b20sIEBfbGF5b3V0LmNsaXBMZWZ0XG5cblx0Y2xpcFJpZ2h0OiAoYSkgLT5cblxuXHRcdEBjbGlwIEBfbGF5b3V0LmNsaXBUb3AsIGEsIEBfbGF5b3V0LmNsaXBCb3R0b20sIEBfbGF5b3V0LmNsaXBMZWZ0XG5cblx0Y2xpcEJvdHRvbTogKGEpIC0+XG5cblx0XHRAY2xpcCBAX2xheW91dC5jbGlwVG9wLCBAX2xheW91dC5jbGlwUmlnaHQsIGEsIEBfbGF5b3V0LmNsaXBMZWZ0XG5cblx0Y2xpcExlZnQ6IChhKSAtPlxuXG5cdFx0QGNsaXAgQF9sYXlvdXQuY2xpcFRvcCwgQF9sYXlvdXQuY2xpcFJpZ2h0LCBAX2xheW91dC5jbGlwQm90dG9tLCBhIl19
},{}],34:[function(require,module,exports){
var ClassPrototype, Transformation, Transforms_, css, method, methodName, _fn, _ref;

Transformation = require('transformation');

css = require('../../../../utility/css');

module.exports = Transforms_ = (function() {
  function Transforms_() {}

  Transforms_.prototype.__initMixinTransforms = function() {
    this._transformer = new Transformation;
    this._origin = {
      x: null,
      y: null,
      z: null
    };
    this._shouldUpdateTransforms = false;
  };

  Transforms_.prototype.__clonerForTransforms = function(newStyleSetter) {
    newStyleSetter._shouldUpdateTransforms = false;
  };

  Transforms_.prototype._updateTransforms = function() {
    if (!this._shouldUpdateTransforms) {
      return;
    }
    this._shouldUpdateTransforms = false;
    return this._actuallyUpdateTransforms();
  };

  Transforms_.prototype._scheduleTransformsUpdate = function() {
    this._shouldUpdateTransforms = true;
    return this._scheduleUpdate();
  };

  Transforms_.prototype._actuallyUpdateTransforms = function() {
    css.setTransform(this.node, this._transformer.toPlainCss());
    return this;
  };

  Transforms_.prototype.go3d = function() {
    css.setTransformStyle(this.node, 'preserve-3d');
    return this;
  };

  Transforms_.prototype.goFlat = function() {
    css.setTransformStyle(this.node, 'flat');
    return this;
  };

  Transforms_.prototype.setOrigin = function(x, y, z) {
    if (x == null) {
      x = 0;
    }
    if (y == null) {
      y = 0;
    }
    if (z == null) {
      z = 0;
    }
    this._origin.x = x;
    this._origin.y = y;
    this._origin.z = z;
    css.setTransformOrigin(this.node, "" + this._origin.x + "px " + this._origin.y + "px " + this._origin.z + "px");
    return this;
  };

  Transforms_.prototype.originToBottom = function() {
    css.setTransformOrigin(this.node, "50% 100%");
    return this;
  };

  Transforms_.prototype.originToTop = function() {
    css.setTransformOrigin(this.node, "50% 0");
    return this;
  };

  Transforms_.prototype.pivot = function(x, y) {
    var _x, _y;
    if (x == null) {
      x = 0;
    }
    if (y == null) {
      y = 0;
    }
    if (x === -1) {
      _x = '0%';
    } else if (x === 0) {
      _x = '50%';
    } else if (x === 1) {
      _x = '100%';
    } else {
      throw Error("pivot() only takes -1, 0, and 1 for its arguments");
    }
    if (y === -1) {
      _y = '0%';
    } else if (y === 0) {
      _y = '50%';
    } else if (y === 1) {
      _y = '100%';
    } else {
      throw Error("pivot() only takes -1, 0, and 1 for its arguments");
    }
    css.setTransformOrigin(this.node, "" + _x + " " + _y);
    return this;
  };

  return Transforms_;

})();

ClassPrototype = Transforms_.prototype;

_ref = Transformation.prototype;
_fn = function() {
  var _methodName;
  _methodName = methodName;
  if (method.length === 0) {
    return ClassPrototype[_methodName] = function() {
      this._transformer[_methodName]();
      this._scheduleTransformsUpdate();
      return this;
    };
  } else if (method.length === 1) {
    return ClassPrototype[_methodName] = function(arg0) {
      this._transformer[_methodName](arg0);
      this._scheduleTransformsUpdate();
      return this;
    };
  } else if (method.length === 2) {
    return ClassPrototype[_methodName] = function(arg0, arg1) {
      this._transformer[_methodName](arg0, arg1);
      this._scheduleTransformsUpdate();
      return this;
    };
  } else if (method.length === 3) {
    return ClassPrototype[_methodName] = function(arg0, arg1, arg2) {
      this._transformer[_methodName](arg0, arg1, arg2);
      this._scheduleTransformsUpdate();
      return this;
    };
  } else if (method.length === 4) {
    return ClassPrototype[_methodName] = function(arg0, arg1, arg2, arg3) {
      this._transformer[_methodName](arg0, arg1, arg2, arg3);
      this._scheduleTransformsUpdate();
      return this;
    };
  } else if (method.length === 5) {
    return ClassPrototype[_methodName] = function(arg0, arg1, arg2, arg3, arg4) {
      this._transformer[_methodName](arg0, arg1, arg2, arg3, arg4);
      this._scheduleTransformsUpdate();
      return this;
    };
  } else {
    throw Error("Methods with more than 5 args are not supported.");
  }
};
for (methodName in _ref) {
  method = _ref[methodName];
  if (!(method instanceof Function)) {
    continue;
  }
  if (ClassPrototype[methodName] != null) {
    continue;
  }
  if (methodName[0] === '_') {
    continue;
  }
  if (methodName === 'temporarily' || methodName === 'commit' || methodName === 'rollBack' || methodName === 'toCss' || methodName === 'toPlainCss' || methodName === 'toArray' || methodName === 'toMatrix') {
    continue;
  }
  _fn();
}

Transforms_;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhbnNmb3Jtc18uanMiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLlxcLi5cXC4uXFwuLiIsInNvdXJjZXMiOlsiY29mZmVlXFxsaWJcXGVsXFxtaXhpblxcc3R5bGVTZXR0ZXJcXG1peGluXFxUcmFuc2Zvcm1zXy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSwyRUFBQTs7QUFBQSxDQUFBLEVBQWlCLElBQUEsT0FBakIsRUFBaUI7O0FBQ2pCLENBREEsRUFDQSxJQUFNLGtCQUFBOztBQUVOLENBSEEsRUFHdUIsR0FBakIsQ0FBTjtDQUVDOztDQUFBLEVBQXVCLE1BQUEsWUFBdkI7QUFFaUIsQ0FBaEIsRUFBZ0IsQ0FBaEIsUUFBQSxFQUFBO0NBQUEsRUFJQyxDQUZELEdBQUE7Q0FFQyxDQUFHLEVBQUgsRUFBQTtDQUFBLENBRUcsRUFGSCxFQUVBO0NBRkEsQ0FJRyxFQUpILEVBSUE7Q0FSRCxLQUFBO0NBQUEsRUFVMkIsQ0FBM0IsQ0FWQSxrQkFVQTtDQVpELEVBQXVCOztDQUF2QixFQWdCdUIsTUFBQyxLQUFELE9BQXZCO0NBRUMsRUFBeUMsQ0FBekMsQ0FBQSxTQUFjLFNBQWQ7Q0FsQkQsRUFnQnVCOztDQWhCdkIsRUFzQm1CLE1BQUEsUUFBbkI7QUFFZSxDQUFkLEdBQUEsbUJBQUE7Q0FBQSxXQUFBO01BQUE7Q0FBQSxFQUUyQixDQUEzQixDQUZBLGtCQUVBO0NBRUksR0FBQSxPQUFELGNBQUg7Q0E1QkQsRUFzQm1COztDQXRCbkIsRUE4QjJCLE1BQUEsZ0JBQTNCO0NBRUMsRUFBMkIsQ0FBM0IsbUJBQUE7Q0FFSSxHQUFBLE9BQUQsSUFBSDtDQWxDRCxFQThCMkI7O0NBOUIzQixFQW9DMkIsTUFBQSxnQkFBM0I7Q0FFQyxDQUF3QixDQUFyQixDQUFILE1BQXdCLEVBQXhCO0NBRjBCLFVBSTFCO0NBeENELEVBb0MyQjs7Q0FwQzNCLEVBMENNLENBQU4sS0FBTTtDQUVMLENBQTZCLENBQTFCLENBQUgsU0FBQSxJQUFBO0NBRkss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Q0FKNkIsWUFNN0I7Q0E3REYsSUF1RCtCO0lBdkQvQixFQUFBO0NBaUVDLElBQU0sS0FBQSx3Q0FBQTtJQXJFTDtDQUFBO0NBYkosSUFBQSxhQUFBOzZCQUFBO0FBRUMsQ0FBQSxDQUFBLEVBQUEsRUFBZ0IsRUFBaEIsSUFBa0M7Q0FBbEMsWUFBQTtJQUFBO0NBRUEsQ0FBQSxFQUFZLDhCQUFaO0NBQUEsWUFBQTtJQUZBO0NBSUEsQ0FBQSxDQUFBLENBQVksQ0FBaUIsS0FBTjtDQUF2QixZQUFBO0lBSkE7Q0FNQSxDQUFBLEVBQVksQ0FBYyxFQUFkLENBQUEsQ0FBQSxDQUFBLEVBQUEsQ0FBQTtDQUFaLFlBQUE7SUFOQTtDQUFBO0NBRkQ7O0FBb0ZBLENBdk5BLFVBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJUcmFuc2Zvcm1hdGlvbiA9IHJlcXVpcmUgJ3RyYW5zZm9ybWF0aW9uJ1xuY3NzID0gcmVxdWlyZSAnLi4vLi4vLi4vLi4vdXRpbGl0eS9jc3MnXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVHJhbnNmb3Jtc19cblxuXHRfX2luaXRNaXhpblRyYW5zZm9ybXM6IC0+XG5cblx0XHRAX3RyYW5zZm9ybWVyID0gbmV3IFRyYW5zZm9ybWF0aW9uXG5cblx0XHRAX29yaWdpbiA9XG5cblx0XHRcdHg6IG51bGxcblxuXHRcdFx0eTogbnVsbFxuXG5cdFx0XHR6OiBudWxsXG5cblx0XHRAX3Nob3VsZFVwZGF0ZVRyYW5zZm9ybXMgPSBub1xuXG5cdFx0cmV0dXJuXG5cblx0X19jbG9uZXJGb3JUcmFuc2Zvcm1zOiAobmV3U3R5bGVTZXR0ZXIpIC0+XG5cblx0XHRuZXdTdHlsZVNldHRlci5fc2hvdWxkVXBkYXRlVHJhbnNmb3JtcyA9IG5vXG5cblx0XHRyZXR1cm5cblxuXHRfdXBkYXRlVHJhbnNmb3JtczogLT5cblxuXHRcdHJldHVybiB1bmxlc3MgQF9zaG91bGRVcGRhdGVUcmFuc2Zvcm1zXG5cblx0XHRAX3Nob3VsZFVwZGF0ZVRyYW5zZm9ybXMgPSBub1xuXG5cdFx0ZG8gQF9hY3R1YWxseVVwZGF0ZVRyYW5zZm9ybXNcblxuXHRfc2NoZWR1bGVUcmFuc2Zvcm1zVXBkYXRlOiAtPlxuXG5cdFx0QF9zaG91bGRVcGRhdGVUcmFuc2Zvcm1zID0geWVzXG5cblx0XHRkbyBAX3NjaGVkdWxlVXBkYXRlXG5cblx0X2FjdHVhbGx5VXBkYXRlVHJhbnNmb3JtczogLT5cblxuXHRcdGNzcy5zZXRUcmFuc2Zvcm0gQG5vZGUsIEBfdHJhbnNmb3JtZXIudG9QbGFpbkNzcygpXG5cblx0XHRAXG5cblx0Z28zZDogLT5cblxuXHRcdGNzcy5zZXRUcmFuc2Zvcm1TdHlsZSBAbm9kZSwgJ3ByZXNlcnZlLTNkJ1xuXG5cdFx0QFxuXG5cdGdvRmxhdDogLT5cblxuXHRcdGNzcy5zZXRUcmFuc2Zvcm1TdHlsZSBAbm9kZSwgJ2ZsYXQnXG5cblx0XHRAXG5cblx0c2V0T3JpZ2luOiAoeCA9IDAsIHkgPSAwLCB6ID0gMCkgLT5cblxuXHRcdEBfb3JpZ2luLnggPSB4XG5cdFx0QF9vcmlnaW4ueSA9IHlcblx0XHRAX29yaWdpbi56ID0gelxuXG5cdFx0Y3NzLnNldFRyYW5zZm9ybU9yaWdpbiBAbm9kZSxcblxuXHRcdFx0XCIje0Bfb3JpZ2luLnh9cHggI3tAX29yaWdpbi55fXB4ICN7QF9vcmlnaW4uen1weFwiXG5cblx0XHRAXG5cblx0b3JpZ2luVG9Cb3R0b206IC0+XG5cblx0XHRjc3Muc2V0VHJhbnNmb3JtT3JpZ2luIEBub2RlLFxuXG5cdFx0XHRcIjUwJSAxMDAlXCJcblxuXHRcdEBcblxuXHRvcmlnaW5Ub1RvcDogLT5cblxuXHRcdGNzcy5zZXRUcmFuc2Zvcm1PcmlnaW4gQG5vZGUsXG5cblx0XHRcdFwiNTAlIDBcIlxuXG5cdFx0QFxuXG5cdHBpdm90OiAoeCA9IDAsIHkgPSAwKSAtPlxuXG5cdFx0aWYgeCBpcyAtMVxuXG5cdFx0XHRfeCA9ICcwJSdcblxuXHRcdGVsc2UgaWYgeCBpcyAwXG5cblx0XHRcdF94ID0gJzUwJSdcblxuXHRcdGVsc2UgaWYgeCBpcyAxXG5cblxuXHRcdFx0X3ggPSAnMTAwJSdcblxuXHRcdGVsc2VcblxuXHRcdFx0dGhyb3cgRXJyb3IgXCJwaXZvdCgpIG9ubHkgdGFrZXMgLTEsIDAsIGFuZCAxIGZvciBpdHMgYXJndW1lbnRzXCJcblxuXHRcdGlmIHkgaXMgLTFcblxuXHRcdFx0X3kgPSAnMCUnXG5cblx0XHRlbHNlIGlmIHkgaXMgMFxuXG5cdFx0XHRfeSA9ICc1MCUnXG5cblx0XHRlbHNlIGlmIHkgaXMgMVxuXG5cblx0XHRcdF95ID0gJzEwMCUnXG5cblx0XHRlbHNlXG5cblx0XHRcdHRocm93IEVycm9yIFwicGl2b3QoKSBvbmx5IHRha2VzIC0xLCAwLCBhbmQgMSBmb3IgaXRzIGFyZ3VtZW50c1wiXG5cblx0XHRjc3Muc2V0VHJhbnNmb3JtT3JpZ2luIEBub2RlLFxuXG5cdFx0XHRcIiN7X3h9ICN7X3l9XCJcblxuXHRcdEBcblxuQ2xhc3NQcm90b3R5cGUgPSBUcmFuc2Zvcm1zXy5wcm90b3R5cGVcblxuZm9yIG1ldGhvZE5hbWUsIG1ldGhvZCBvZiBUcmFuc2Zvcm1hdGlvbi5wcm90b3R5cGVcblxuXHRjb250aW51ZSB1bmxlc3MgbWV0aG9kIGluc3RhbmNlb2YgRnVuY3Rpb25cblxuXHRjb250aW51ZSBpZiBDbGFzc1Byb3RvdHlwZVttZXRob2ROYW1lXT9cblxuXHRjb250aW51ZSBpZiBtZXRob2ROYW1lWzBdIGlzICdfJ1xuXG5cdGNvbnRpbnVlIGlmIG1ldGhvZE5hbWUgaXMgJ3RlbXBvcmFyaWx5JyBvciBtZXRob2ROYW1lIGlzICdjb21taXQnIG9yXG5cdFx0bWV0aG9kTmFtZSBpcyAncm9sbEJhY2snIG9yIG1ldGhvZE5hbWUgaXMgJ3RvQ3NzJyBvclxuXHRcdG1ldGhvZE5hbWUgaXMgJ3RvUGxhaW5Dc3MnIG9yIG1ldGhvZE5hbWUgaXMgJ3RvQXJyYXknIG9yXG5cdFx0bWV0aG9kTmFtZSBpcyAndG9NYXRyaXgnXG5cblx0ZG8gLT5cblxuXHRcdF9tZXRob2ROYW1lID0gbWV0aG9kTmFtZVxuXG5cdFx0aWYgbWV0aG9kLmxlbmd0aCBpcyAwXG5cblx0XHRcdENsYXNzUHJvdG90eXBlW19tZXRob2ROYW1lXSA9ICAtPlxuXG5cdFx0XHRcdCMgVGhpcyBpcyBtb3JlIHBlcmZvcm1hbnQgdGhhbiBtZXRob2QuYXBwbHkoKVxuXHRcdFx0XHQjXG5cdFx0XHRcdCMgQXJndW1lbnQgc3BsYXRzIHdvbid0IHdvcmsgaGVyZSB0aG91Z2guXG5cdFx0XHRcdEBfdHJhbnNmb3JtZXJbX21ldGhvZE5hbWVdKClcblxuXHRcdFx0XHRkbyBAX3NjaGVkdWxlVHJhbnNmb3Jtc1VwZGF0ZVxuXG5cdFx0XHRcdEBcblxuXHRcdGVsc2UgaWYgbWV0aG9kLmxlbmd0aCBpcyAxXG5cblx0XHRcdENsYXNzUHJvdG90eXBlW19tZXRob2ROYW1lXSA9IChhcmcwKSAtPlxuXG5cdFx0XHRcdEBfdHJhbnNmb3JtZXJbX21ldGhvZE5hbWVdIGFyZzBcblxuXHRcdFx0XHRkbyBAX3NjaGVkdWxlVHJhbnNmb3Jtc1VwZGF0ZVxuXG5cdFx0XHRcdEBcblxuXHRcdGVsc2UgaWYgbWV0aG9kLmxlbmd0aCBpcyAyXG5cblx0XHRcdENsYXNzUHJvdG90eXBlW19tZXRob2ROYW1lXSA9IChhcmcwLCBhcmcxKSAtPlxuXG5cdFx0XHRcdEBfdHJhbnNmb3JtZXJbX21ldGhvZE5hbWVdIGFyZzAsIGFyZzFcblxuXHRcdFx0XHRkbyBAX3NjaGVkdWxlVHJhbnNmb3Jtc1VwZGF0ZVxuXG5cdFx0XHRcdEBcblxuXHRcdGVsc2UgaWYgbWV0aG9kLmxlbmd0aCBpcyAzXG5cblx0XHRcdENsYXNzUHJvdG90eXBlW19tZXRob2ROYW1lXSA9IChhcmcwLCBhcmcxLCBhcmcyKSAtPlxuXG5cdFx0XHRcdEBfdHJhbnNmb3JtZXJbX21ldGhvZE5hbWVdIGFyZzAsIGFyZzEsIGFyZzJcblxuXHRcdFx0XHRkbyBAX3NjaGVkdWxlVHJhbnNmb3Jtc1VwZGF0ZVxuXG5cdFx0XHRcdEBcblxuXHRcdGVsc2UgaWYgbWV0aG9kLmxlbmd0aCBpcyA0XG5cblx0XHRcdENsYXNzUHJvdG90eXBlW19tZXRob2ROYW1lXSA9IChhcmcwLCBhcmcxLCBhcmcyLCBhcmczKSAtPlxuXG5cdFx0XHRcdEBfdHJhbnNmb3JtZXJbX21ldGhvZE5hbWVdIGFyZzAsIGFyZzEsIGFyZzIsIGFyZzNcblxuXHRcdFx0XHRkbyBAX3NjaGVkdWxlVHJhbnNmb3Jtc1VwZGF0ZVxuXG5cdFx0XHRcdEBcblxuXHRcdGVsc2UgaWYgbWV0aG9kLmxlbmd0aCBpcyA1XG5cblx0XHRcdENsYXNzUHJvdG90eXBlW19tZXRob2ROYW1lXSA9IChhcmcwLCBhcmcxLCBhcmcyLCBhcmczLCBhcmc0KSAtPlxuXG5cdFx0XHRcdEBfdHJhbnNmb3JtZXJbX21ldGhvZE5hbWVdIGFyZzAsIGFyZzEsIGFyZzIsIGFyZzMsIGFyZzRcblxuXHRcdFx0XHRkbyBAX3NjaGVkdWxlVHJhbnNmb3Jtc1VwZGF0ZVxuXG5cdFx0XHRcdEBcblxuXHRcdGVsc2VcblxuXHRcdFx0dGhyb3cgRXJyb3IgXCJNZXRob2RzIHdpdGggbW9yZSB0aGFuIDUgYXJncyBhcmUgbm90IHN1cHBvcnRlZC5cIlxuXG5UcmFuc2Zvcm1zXyJdfQ==
},{"../../../../utility/css":42,"transformation":15}],35:[function(require,module,exports){
var Typography_, css;

css = require('../../../../utility/css');

module.exports = Typography_ = (function() {
  function Typography_() {}

  Typography_.prototype.__initMixinTypography = function() {
    this._type = {
      face: Typography_.defaultFace,
      size: Typography_.defaultSize,
      color: Typography_.defaultColor
    };
    this._sizeSet = false;
  };

  Typography_.prototype._getSize = function() {
    if (!this._sizeSet) {
      this._type.size = parseFloat(getComputedStyle(this.node).fontSize);
      this._sizeSet = true;
    }
    return this._type.size;
  };

  Typography_.prototype._initTypography = function() {
    this.setSize();
    this.setFace();
    return this.setColor();
  };

  Typography_.prototype.setFace = function(face) {
    if (!face) {
      this._type.face = Typography_.defaultFace;
    } else {
      this._type.face = face;
    }
    this._applyFace();
    return this;
  };

  Typography_.prototype._applyFace = function() {
    this._styles.fontFamily = this._type.face;
    return this;
  };

  Typography_.prototype.setSize = function(size) {
    if (!size) {
      this._type.size = Typography_.defaultSize;
    } else {
      this._type.size = size;
    }
    this._applySize();
    return this;
  };

  Typography_.prototype._applySize = function() {
    this._styles.fontSize = this._type.size + 'px';
    return this;
  };

  Typography_.prototype.setColor = function(r, g, b) {
    if (arguments.length === 0) {
      this._type.color = Typography_.defaultColor;
    } else {
      this._type.color = css.rgb(r, g, b);
    }
    this._applyColor();
    return this;
  };

  Typography_.prototype._applyColor = function() {
    this._styles.color = this._type.color;
    this._applyStroke();
    return this;
  };

  Typography_.prototype._applyStroke = function() {
    if (Typography_.needsTextStroke() && this._getSize() < 50) {
      this._styles.webkitTextStroke = '1.5 ' + this._type.color;
    }
    return this;
  };

  Typography_.defaultFace = '"HelveticaNeueLT Std Thin"';

  Typography_.setDefaultFace = function(face) {
    if (face == null) {
      face = "HelveticaNeueLT Std Thin";
    }
    return this.defaultFace = face;
  };

  Typography_.defaultSize = 36;

  Typography_.setDefaultSize = function(size) {
    if (size == null) {
      size = 36;
    }
    return this.defaultSize = size;
  };

  Typography_.defaultColor = css.rgb(255, 255, 255);

  Typography_.setDefaultColor = function(r, g, b) {
    if (arguments.length === 0) {
      this.defaultColor = css.rgb(255, 255, 255);
    }
    return this.defaultColor = css.rgb(r, g, b);
  };

  Typography_.needsTextStroke = (function() {
    var _needsTextStroke;
    _needsTextStroke = null;
    return function() {
      if (_needsTextStroke === null) {
        if (navigator.appVersion.indexOf('Chrome') !== -1 && navigator.appVersion.indexOf('Windows') !== -1) {
          _needsTextStroke = true;
        } else {
          _needsTextStroke = false;
        }
      }
      return _needsTextStroke;
    };
  })();

  return Typography_;

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHlwb2dyYXBoeV8uanMiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLlxcLi5cXC4uXFwuLiIsInNvdXJjZXMiOlsiY29mZmVlXFxsaWJcXGVsXFxtaXhpblxcc3R5bGVTZXR0ZXJcXG1peGluXFxUeXBvZ3JhcGh5Xy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxZQUFBOztBQUFBLENBQUEsRUFBQSxJQUFNLGtCQUFBOztBQUVOLENBRkEsRUFFdUIsR0FBakIsQ0FBTjtDQUVDOztDQUFBLEVBQXVCLE1BQUEsWUFBdkI7Q0FFQyxFQUVDLENBRkQsQ0FBQTtDQUVDLENBQU0sRUFBTixFQUFBLEtBQWlCO0NBQWpCLENBRU0sRUFBTixFQUFBLEtBQWlCO0NBRmpCLENBSU8sR0FBUCxDQUFBLEtBQWtCLENBSmxCO0NBRkQsS0FBQTtDQUFBLEVBUVksQ0FBWixDQVJBLEdBUUE7Q0FWRCxFQUF1Qjs7Q0FBdkIsRUFjVSxLQUFWLENBQVU7QUFFRixDQUFQLEdBQUEsSUFBQTtDQUVDLEVBQWMsQ0FBYixDQUFLLENBQU4sRUFBYyxFQUFBLE1BQVc7Q0FBekIsRUFFWSxDQUFYLEVBQUQsRUFBQTtNQUpEO0NBTUMsR0FBQSxDQUFLLE1BQU47Q0F0QkQsRUFjVTs7Q0FkVixFQXdCaUIsTUFBQSxNQUFqQjtDQUVDLEdBQUcsR0FBSDtDQUFBLEdBQ0csR0FBSDtDQUNJLEdBQUEsSUFBSixHQUFHO0NBNUJKLEVBd0JpQjs7Q0F4QmpCLEVBOEJTLENBQUEsR0FBVCxFQUFVO0FBRUYsQ0FBUCxHQUFBO0NBRUMsRUFBYyxDQUFiLENBQUssQ0FBTixLQUF5QjtNQUYxQjtDQU1DLEVBQWMsQ0FBYixDQUFLLENBQU47TUFORDtDQUFBLEdBUUcsTUFBSDtDQVZRLFVBWVI7Q0ExQ0QsRUE4QlM7O0NBOUJULEVBNENZLE1BQUEsQ0FBWjtDQUVDLEVBQXNCLENBQXRCLENBQTRCLEVBQXBCLEdBQVI7Q0FGVyxVQUlYO0NBaERELEVBNENZOztDQTVDWixFQWtEUyxDQUFBLEdBQVQsRUFBVTtBQUVGLENBQVAsR0FBQTtDQUVDLEVBQWMsQ0FBYixDQUFLLENBQU4sS0FBeUI7TUFGMUI7Q0FNQyxFQUFjLENBQWIsQ0FBSyxDQUFOO01BTkQ7Q0FBQSxHQVFHLE1BQUg7Q0FWUSxVQVlSO0NBOURELEVBa0RTOztDQWxEVCxFQWdFWSxNQUFBLENBQVo7Q0FFQyxFQUFvQixDQUFwQixDQUEwQixFQUFsQixDQUFSO0NBRlcsVUFJWDtDQXBFRCxFQWdFWTs7Q0FoRVosQ0FzRWMsQ0FBSixLQUFWLENBQVc7Q0FFVixHQUFBLENBQXVCLENBQXBCLEdBQVM7Q0FFWCxFQUFlLENBQWQsQ0FBSyxDQUFOLEtBQTBCLENBQTFCO01BRkQ7Q0FNQyxDQUEwQixDQUFYLENBQWQsQ0FBSyxDQUFOO01BTkQ7Q0FBQSxHQVFHLE9BQUg7Q0FWUyxVQVlUO0NBbEZELEVBc0VVOztDQXRFVixFQW9GYSxNQUFBLEVBQWI7Q0FFQyxFQUFpQixDQUFqQixDQUFBLEVBQVE7Q0FBUixHQUVHLFFBQUg7Q0FKWSxVQU1aO0NBMUZELEVBb0ZhOztDQXBGYixFQTRGYyxNQUFBLEdBQWQ7Q0FFQyxDQUFBLENBQW1ELENBQW5ELElBQXFDLEdBQXZCLElBQVg7Q0FJRixFQUE0QixDQUEzQixDQUEwQyxDQUEzQyxDQUFRLFNBQVI7TUFKRDtDQUZhLFVBUWI7Q0FwR0QsRUE0RmM7O0NBNUZkLENBc0dBLENBQWUsUUFBZCxpQkF0R0Q7O0NBQUEsQ0F3R0EsQ0FBaUIsQ0FBQSxLQUFDLEVBQWpCLEdBQUQ7O0dBQXlCLEdBQVA7TUFFakI7Q0FBQyxFQUFjLENBQWQsT0FBRDtDQTFHRCxFQXdHaUI7O0NBeEdqQixDQTRHQSxDQUFlLFFBQWQ7O0NBNUdELENBOEdBLENBQWlCLENBQUEsS0FBQyxFQUFqQixHQUFEOztHQUF5QixHQUFQO01BRWpCO0NBQUMsRUFBYyxDQUFkLE9BQUQ7Q0FoSEQsRUE4R2lCOztDQTlHakIsQ0FrSEEsQ0FBZ0IsUUFBZixDQUFEOztDQWxIQSxDQW9IQSxDQUFrQixNQUFDLEVBQWxCLElBQUQ7Q0FFQyxHQUFBLENBQXVCLENBQXBCLEdBQVM7Q0FFWCxDQUE2QixDQUFiLENBQWYsRUFBRCxNQUFBO01BRkQ7Q0FJQyxDQUEwQixDQUFYLENBQWYsT0FBRCxDQUFBO0NBMUhELEVBb0hrQjs7Q0FwSGxCLENBZ0lBLENBQXFCLE1BQUEsRUFBcEIsSUFBRDtDQUVDLE9BQUEsUUFBQTtDQUFBLEVBQW1CLENBQW5CLFlBQUE7R0FFQSxNQUFBLEVBQUE7Q0FFQyxHQUFHLENBQW9CLENBQXZCLFVBQUc7QUFFOEMsQ0FBaEQsR0FBRyxDQUE0QyxFQUE1QyxDQUFILENBQVksQ0FBVztDQUV0QixFQUFtQixDQUFuQixNQUFBLE1BQUE7TUFGRCxJQUFBO0NBTUMsRUFBbUIsRUFBbkIsS0FBQSxNQUFBO1VBUkY7UUFBQTtDQUZELFlBWUM7Q0FoQm1CLElBSXBCO0NBSm9CLEVBQUE7O0NBaElyQjs7Q0FKRCIsInNvdXJjZXNDb250ZW50IjpbImNzcyA9IHJlcXVpcmUgJy4uLy4uLy4uLy4uL3V0aWxpdHkvY3NzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFR5cG9ncmFwaHlfXG5cblx0X19pbml0TWl4aW5UeXBvZ3JhcGh5OiAtPlxuXG5cdFx0QF90eXBlID1cblxuXHRcdFx0ZmFjZTogVHlwb2dyYXBoeV8uZGVmYXVsdEZhY2VcblxuXHRcdFx0c2l6ZTogVHlwb2dyYXBoeV8uZGVmYXVsdFNpemVcblxuXHRcdFx0Y29sb3I6IFR5cG9ncmFwaHlfLmRlZmF1bHRDb2xvclxuXG5cdFx0QF9zaXplU2V0ID0gbm9cblxuXHRcdHJldHVyblxuXG5cdF9nZXRTaXplOiAtPlxuXG5cdFx0dW5sZXNzIEBfc2l6ZVNldFxuXG5cdFx0XHRAX3R5cGUuc2l6ZSA9IHBhcnNlRmxvYXQoZ2V0Q29tcHV0ZWRTdHlsZShAbm9kZSkuZm9udFNpemUpXG5cblx0XHRcdEBfc2l6ZVNldCA9IHllc1xuXG5cdFx0QF90eXBlLnNpemVcblxuXHRfaW5pdFR5cG9ncmFwaHk6IC0+XG5cblx0XHRkbyBAc2V0U2l6ZVxuXHRcdGRvIEBzZXRGYWNlXG5cdFx0ZG8gQHNldENvbG9yXG5cblx0c2V0RmFjZTogKGZhY2UpIC0+XG5cblx0XHR1bmxlc3MgZmFjZVxuXG5cdFx0XHRAX3R5cGUuZmFjZSA9IFR5cG9ncmFwaHlfLmRlZmF1bHRGYWNlXG5cblx0XHRlbHNlXG5cblx0XHRcdEBfdHlwZS5mYWNlID0gZmFjZVxuXG5cdFx0ZG8gQF9hcHBseUZhY2VcblxuXHRcdEBcblxuXHRfYXBwbHlGYWNlOiAtPlxuXG5cdFx0QF9zdHlsZXMuZm9udEZhbWlseSA9IEBfdHlwZS5mYWNlXG5cblx0XHRAXG5cblx0c2V0U2l6ZTogKHNpemUpIC0+XG5cblx0XHR1bmxlc3Mgc2l6ZVxuXG5cdFx0XHRAX3R5cGUuc2l6ZSA9IFR5cG9ncmFwaHlfLmRlZmF1bHRTaXplXG5cblx0XHRlbHNlXG5cblx0XHRcdEBfdHlwZS5zaXplID0gc2l6ZVxuXG5cdFx0ZG8gQF9hcHBseVNpemVcblxuXHRcdEBcblxuXHRfYXBwbHlTaXplOiAtPlxuXG5cdFx0QF9zdHlsZXMuZm9udFNpemUgPSBAX3R5cGUuc2l6ZSArICdweCdcblxuXHRcdEBcblxuXHRzZXRDb2xvcjogKHIsIGcsIGIpIC0+XG5cblx0XHRpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDBcblxuXHRcdFx0QF90eXBlLmNvbG9yID0gVHlwb2dyYXBoeV8uZGVmYXVsdENvbG9yXG5cblx0XHRlbHNlXG5cblx0XHRcdEBfdHlwZS5jb2xvciA9IGNzcy5yZ2IociwgZywgYilcblxuXHRcdGRvIEBfYXBwbHlDb2xvclxuXG5cdFx0QFxuXG5cdF9hcHBseUNvbG9yOiAtPlxuXG5cdFx0QF9zdHlsZXMuY29sb3IgPSBAX3R5cGUuY29sb3JcblxuXHRcdGRvIEBfYXBwbHlTdHJva2VcblxuXHRcdEBcblxuXHRfYXBwbHlTdHJva2U6IC0+XG5cblx0XHRpZiBUeXBvZ3JhcGh5Xy5uZWVkc1RleHRTdHJva2UoKSBhbmQgQF9nZXRTaXplKCkgPCA1MFxuXG5cblxuXHRcdFx0QF9zdHlsZXMud2Via2l0VGV4dFN0cm9rZSA9ICcxLjUgJyArIEBfdHlwZS5jb2xvclxuXG5cdFx0QFxuXG5cdEBkZWZhdWx0RmFjZSA9ICdcIkhlbHZldGljYU5ldWVMVCBTdGQgVGhpblwiJ1xuXG5cdEBzZXREZWZhdWx0RmFjZTogKGZhY2UgPSBcIkhlbHZldGljYU5ldWVMVCBTdGQgVGhpblwiKSAtPlxuXG5cdFx0QGRlZmF1bHRGYWNlID0gZmFjZVxuXG5cdEBkZWZhdWx0U2l6ZSA9IDM2XG5cblx0QHNldERlZmF1bHRTaXplOiAoc2l6ZSA9IDM2KSAtPlxuXG5cdFx0QGRlZmF1bHRTaXplID0gc2l6ZVxuXG5cdEBkZWZhdWx0Q29sb3IgPSBjc3MucmdiKDI1NSwgMjU1LCAyNTUpXG5cblx0QHNldERlZmF1bHRDb2xvcjogKHIsIGcsIGIpIC0+XG5cblx0XHRpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDBcblxuXHRcdFx0QGRlZmF1bHRDb2xvciA9IGNzcy5yZ2IoMjU1LCAyNTUsIDI1NSlcblxuXHRcdEBkZWZhdWx0Q29sb3IgPSBjc3MucmdiKHIsIGcsIGIpXG5cblx0IyBBcyBsb25nIGFzIGNocm9tZSBoYXNuJ3QgaW1wbGVtZW50ZWQgRGlyZWN0V3JpdGUsIHRleHQgd29uJ3QgbG9va1xuXHQjIGl0cyBiZXN0IG9uIHdpbmRvd3MuIFRoaXMgZnVuY3Rpb24gd2lsbCB0ZWxsIHlvdSBpZiB5b3UgbmVlZCB0b1xuXHQjIGFwcGx5IGEgLXdlYmtpdC10ZXh0LXN0cm9rZSB0byBtYWtlIHRleHQgbG9vayBhIGJpdCBzbW9vdGhlciBvblxuXHQjIGNocm9tZS93aW4uXG5cdEBuZWVkc1RleHRTdHJva2U6IGRvIC0+XG5cblx0XHRfbmVlZHNUZXh0U3Ryb2tlID0gbnVsbFxuXG5cdFx0LT5cblxuXHRcdFx0aWYgX25lZWRzVGV4dFN0cm9rZSBpcyBudWxsXG5cblx0XHRcdFx0aWYgbmF2aWdhdG9yLmFwcFZlcnNpb24uaW5kZXhPZignQ2hyb21lJykgaXNudCAtMSBhbmQgbmF2aWdhdG9yLmFwcFZlcnNpb24uaW5kZXhPZignV2luZG93cycpIGlzbnQgLTFcblxuXHRcdFx0XHRcdF9uZWVkc1RleHRTdHJva2UgPSB5ZXNcblxuXHRcdFx0XHRlbHNlXG5cblx0XHRcdFx0XHRfbmVlZHNUZXh0U3Ryb2tlID0gbm9cblxuXHRcdFx0X25lZWRzVGV4dFN0cm9rZSJdfQ==
},{"../../../../utility/css":42}],36:[function(require,module,exports){
var CSSColor, ClassPrototype, ColorHolder, method, methodName, _fn, _ref;

CSSColor = require('../../../../utility/css/Color');

module.exports = ColorHolder = (function() {
  function ColorHolder(_callback) {
    this._callback = _callback;
    this._color = new CSSColor;
  }

  ColorHolder.prototype.withRgb = function(r, g, b) {
    this._color.fromRgb(r, g, b);
    this._callback();
    return this;
  };

  ColorHolder.prototype.withHsl = function(h, s, l) {
    this._color.fromHsl(h, s, l);
    this._callback();
    return this;
  };

  ColorHolder.prototype.clone = function(callback) {
    var newObj;
    newObj = Object.create(this.constructor.prototype);
    newObj._color = this._color.clone();
    newObj._callback = callback;
    return newObj;
  };

  return ColorHolder;

})();

ClassPrototype = ColorHolder.prototype;

_ref = CSSColor.prototype;
_fn = function() {
  var _methodName;
  _methodName = methodName;
  if (method.length === 0) {
    return ClassPrototype[_methodName] = function() {
      this._color[_methodName]();
      this._callback();
      return this;
    };
  } else if (method.length === 1) {
    return ClassPrototype[_methodName] = function(arg0) {
      this._color[_methodName](arg0);
      this._callback();
      return this;
    };
  } else if (method.length === 2) {
    return ClassPrototype[_methodName] = function(arg0, arg1) {
      this._color[_methodName](arg0, arg1);
      this._callback();
      return this;
    };
  } else if (method.length === 3) {
    return ClassPrototype[_methodName] = function(arg0, arg1, arg2) {
      this._color[_methodName](arg0, arg1, arg2);
      this._callback();
      return this;
    };
  } else if (method.length === 4) {
    return ClassPrototype[_methodName] = function(arg0, arg1, arg2, arg3) {
      this._color[_methodName](arg0, arg1, arg2, arg3);
      this._callback();
      return this;
    };
  } else if (method.length === 5) {
    return ClassPrototype[_methodName] = function(arg0, arg1, arg2, arg3, arg4) {
      this._color[_methodName](arg0, arg1, arg2, arg3, arg4);
      this._callback();
      return this;
    };
  } else {
    throw Error("Methods with more than 5 args are not supported.");
  }
};
for (methodName in _ref) {
  method = _ref[methodName];
  if (!(method instanceof Function)) {
    continue;
  }
  if (ClassPrototype[methodName] != null) {
    continue;
  }
  if (methodName[0] === '_') {
    continue;
  }
  if (methodName.substr(0, 2) === 'to') {
    continue;
  }
  _fn();
}

ColorHolder;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29sb3JIb2xkZXIuanMiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLlxcLi5cXC4uXFwuLiIsInNvdXJjZXMiOlsiY29mZmVlXFxsaWJcXGVsXFxtaXhpblxcc3R5bGVTZXR0ZXJcXHRvb2xzXFxDb2xvckhvbGRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxnRUFBQTs7QUFBQSxDQUFBLEVBQVcsSUFBQSxDQUFYLHVCQUFXOztBQUVYLENBRkEsRUFFdUIsR0FBakIsQ0FBTjtDQUVjLENBQUEsQ0FBQSxNQUFBLFlBQUU7Q0FFZCxFQUZjLENBQUQsS0FFYjtBQUFVLENBQVYsRUFBVSxDQUFWLEVBQUEsRUFBQTtDQUZELEVBQWE7O0NBQWIsQ0FJYSxDQUFKLElBQVQsRUFBVTtDQUVULENBQW1CLEVBQW5CLEVBQU8sQ0FBUDtDQUFBLEdBRUcsS0FBSDtDQUpRLFVBTVI7Q0FWRCxFQUlTOztDQUpULENBWWEsQ0FBSixJQUFULEVBQVU7Q0FFVCxDQUFtQixFQUFuQixFQUFPLENBQVA7Q0FBQSxHQUVHLEtBQUg7Q0FKUSxVQU1SO0NBbEJELEVBWVM7O0NBWlQsRUFvQk8sRUFBUCxHQUFPLENBQUM7Q0FFUCxLQUFBLEVBQUE7Q0FBQSxFQUFTLENBQVQsRUFBQSxHQUFTLEVBQTBCO0NBQW5DLEVBRWdCLENBQWhCLENBQWdCLENBQVY7Q0FGTixFQUltQixDQUFuQixFQUFNLEVBSk4sQ0FJQTtDQU5NLFVBUU47Q0E1QkQsRUFvQk87O0NBcEJQOztDQUpEOztBQWtDQSxDQWxDQSxFQWtDaUIsTUFsQ2pCLEVBa0M0QixHQUE1Qjs7Q0FFQTtDQUFBLEVBVUksTUFBQTtDQUVGLEtBQUEsS0FBQTtDQUFBLENBQUEsQ0FBYyxPQUFkLENBQUE7Q0FFQSxDQUFBLEVBQUcsQ0FBaUIsQ0FBWDtDQUVPLEVBQWdCLE1BQUEsRUFBL0IsR0FBZTtDQUtkLEdBQUMsRUFBRCxLQUFRO0NBQVIsR0FFSSxFQUFELEdBQUg7Q0FQOEIsWUFTOUI7Q0FYRixJQUVnQztDQVdqQixHQWJmLENBYXlCLENBYnpCO0NBZWdCLEVBQWUsQ0FBQSxLQUFDLEVBQS9CLEdBQWU7Q0FFZCxHQUFDLEVBQUQsS0FBUTtDQUFSLEdBRUksRUFBRCxHQUFIO0NBSjZCLFlBTTdCO0NBckJGLElBZStCO0NBUWhCLEdBdkJmLENBdUJ5QixDQXZCekI7Q0F5QmdCLENBQXNCLENBQVAsQ0FBQSxLQUFDLEVBQS9CLEdBQWU7Q0FFZCxDQUEyQixFQUExQixFQUFELEtBQVE7Q0FBUixHQUVJLEVBQUQsR0FBSDtDQUo2QixZQU03QjtDQS9CRixJQXlCK0I7Q0FRaEIsR0FqQ2YsQ0FpQ3lCLENBakN6QjtDQW1DZ0IsQ0FBc0IsQ0FBUCxDQUFBLEtBQUMsRUFBL0IsR0FBZTtDQUVkLENBQTJCLEVBQTFCLEVBQUQsS0FBUTtDQUFSLEdBRUksRUFBRCxHQUFIO0NBSjZCLFlBTTdCO0NBekNGLElBbUMrQjtDQVFoQixHQTNDZixDQTJDeUIsQ0EzQ3pCO0NBNkNnQixDQUFzQixDQUFQLENBQUEsS0FBQyxFQUEvQixHQUFlO0NBRWQsQ0FBMkIsRUFBMUIsRUFBRCxLQUFRO0NBQVIsR0FFSSxFQUFELEdBQUg7Q0FKNkIsWUFNN0I7Q0FuREYsSUE2QytCO0NBUWhCLEdBckRmLENBcUR5QixDQXJEekI7Q0F1RGdCLENBQXNCLENBQVAsQ0FBQSxLQUFDLEVBQS9CLEdBQWU7Q0FFZCxDQUEyQixFQUExQixFQUFELEtBQVE7Q0FBUixHQUVJLEVBQUQsR0FBSDtDQUo2QixZQU03QjtDQTdERixJQXVEK0I7SUF2RC9CLEVBQUE7Q0FpRUMsSUFBTSxLQUFBLHdDQUFBO0lBckVMO0NBQUE7Q0FWSixJQUFBLGFBQUE7NkJBQUE7QUFFQyxDQUFBLENBQUEsRUFBQSxFQUFnQixFQUFoQixJQUFrQztDQUFsQyxZQUFBO0lBQUE7Q0FFQSxDQUFBLEVBQVksOEJBQVo7Q0FBQSxZQUFBO0lBRkE7Q0FJQSxDQUFBLENBQUEsQ0FBWSxDQUFpQixLQUFOO0NBQXZCLFlBQUE7SUFKQTtDQU1BLENBQUEsRUFBWSxDQUEyQixDQUEzQixJQUFVO0NBQXRCLFlBQUE7SUFOQTtDQUFBO0NBRkQ7O0FBaUZBLENBckhBLFVBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJDU1NDb2xvciA9IHJlcXVpcmUgJy4uLy4uLy4uLy4uL3V0aWxpdHkvY3NzL0NvbG9yJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIENvbG9ySG9sZGVyXG5cblx0Y29uc3RydWN0b3I6IChAX2NhbGxiYWNrKSAtPlxuXG5cdFx0QF9jb2xvciA9IG5ldyBDU1NDb2xvclxuXG5cdHdpdGhSZ2I6IChyLCBnLCBiKSAtPlxuXG5cdFx0QF9jb2xvci5mcm9tUmdiIHIsIGcsIGJcblxuXHRcdGRvIEBfY2FsbGJhY2tcblxuXHRcdEBcblxuXHR3aXRoSHNsOiAoaCwgcywgbCkgLT5cblxuXHRcdEBfY29sb3IuZnJvbUhzbCBoLCBzLCBsXG5cblx0XHRkbyBAX2NhbGxiYWNrXG5cblx0XHRAXG5cblx0Y2xvbmU6IChjYWxsYmFjaykgLT5cblxuXHRcdG5ld09iaiA9IE9iamVjdC5jcmVhdGUgQGNvbnN0cnVjdG9yOjpcblxuXHRcdG5ld09iai5fY29sb3IgPSBAX2NvbG9yLmNsb25lKClcblxuXHRcdG5ld09iai5fY2FsbGJhY2sgPSBjYWxsYmFja1xuXG5cdFx0bmV3T2JqXG5cbkNsYXNzUHJvdG90eXBlID0gQ29sb3JIb2xkZXIucHJvdG90eXBlXG5cbmZvciBtZXRob2ROYW1lLCBtZXRob2Qgb2YgQ1NTQ29sb3IucHJvdG90eXBlXG5cblx0Y29udGludWUgdW5sZXNzIG1ldGhvZCBpbnN0YW5jZW9mIEZ1bmN0aW9uXG5cblx0Y29udGludWUgaWYgQ2xhc3NQcm90b3R5cGVbbWV0aG9kTmFtZV0/XG5cblx0Y29udGludWUgaWYgbWV0aG9kTmFtZVswXSBpcyAnXydcblxuXHRjb250aW51ZSBpZiBtZXRob2ROYW1lLnN1YnN0cigwLCAyKSBpcyAndG8nXG5cblx0ZG8gLT5cblxuXHRcdF9tZXRob2ROYW1lID0gbWV0aG9kTmFtZVxuXG5cdFx0aWYgbWV0aG9kLmxlbmd0aCBpcyAwXG5cblx0XHRcdENsYXNzUHJvdG90eXBlW19tZXRob2ROYW1lXSA9ICAtPlxuXG5cdFx0XHRcdCMgVGhpcyBpcyBtb3JlIHBlcmZvcm1hbnQgdGhhbiBtZXRob2QuYXBwbHkoKVxuXHRcdFx0XHQjXG5cdFx0XHRcdCMgQXJndW1lbnQgc3BsYXRzIHdvbid0IHdvcmsgaGVyZSB0aG91Z2guXG5cdFx0XHRcdEBfY29sb3JbX21ldGhvZE5hbWVdKClcblxuXHRcdFx0XHRkbyBAX2NhbGxiYWNrXG5cblx0XHRcdFx0QFxuXG5cdFx0ZWxzZSBpZiBtZXRob2QubGVuZ3RoIGlzIDFcblxuXHRcdFx0Q2xhc3NQcm90b3R5cGVbX21ldGhvZE5hbWVdID0gKGFyZzApIC0+XG5cblx0XHRcdFx0QF9jb2xvcltfbWV0aG9kTmFtZV0gYXJnMFxuXG5cdFx0XHRcdGRvIEBfY2FsbGJhY2tcblxuXHRcdFx0XHRAXG5cblx0XHRlbHNlIGlmIG1ldGhvZC5sZW5ndGggaXMgMlxuXG5cdFx0XHRDbGFzc1Byb3RvdHlwZVtfbWV0aG9kTmFtZV0gPSAoYXJnMCwgYXJnMSkgLT5cblxuXHRcdFx0XHRAX2NvbG9yW19tZXRob2ROYW1lXSBhcmcwLCBhcmcxXG5cblx0XHRcdFx0ZG8gQF9jYWxsYmFja1xuXG5cdFx0XHRcdEBcblxuXHRcdGVsc2UgaWYgbWV0aG9kLmxlbmd0aCBpcyAzXG5cblx0XHRcdENsYXNzUHJvdG90eXBlW19tZXRob2ROYW1lXSA9IChhcmcwLCBhcmcxLCBhcmcyKSAtPlxuXG5cdFx0XHRcdEBfY29sb3JbX21ldGhvZE5hbWVdIGFyZzAsIGFyZzEsIGFyZzJcblxuXHRcdFx0XHRkbyBAX2NhbGxiYWNrXG5cblx0XHRcdFx0QFxuXG5cdFx0ZWxzZSBpZiBtZXRob2QubGVuZ3RoIGlzIDRcblxuXHRcdFx0Q2xhc3NQcm90b3R5cGVbX21ldGhvZE5hbWVdID0gKGFyZzAsIGFyZzEsIGFyZzIsIGFyZzMpIC0+XG5cblx0XHRcdFx0QF9jb2xvcltfbWV0aG9kTmFtZV0gYXJnMCwgYXJnMSwgYXJnMiwgYXJnM1xuXG5cdFx0XHRcdGRvIEBfY2FsbGJhY2tcblxuXHRcdFx0XHRAXG5cblx0XHRlbHNlIGlmIG1ldGhvZC5sZW5ndGggaXMgNVxuXG5cdFx0XHRDbGFzc1Byb3RvdHlwZVtfbWV0aG9kTmFtZV0gPSAoYXJnMCwgYXJnMSwgYXJnMiwgYXJnMywgYXJnNCkgLT5cblxuXHRcdFx0XHRAX2NvbG9yW19tZXRob2ROYW1lXSBhcmcwLCBhcmcxLCBhcmcyLCBhcmczLCBhcmc0XG5cblx0XHRcdFx0ZG8gQF9jYWxsYmFja1xuXG5cdFx0XHRcdEBcblxuXHRcdGVsc2VcblxuXHRcdFx0dGhyb3cgRXJyb3IgXCJNZXRob2RzIHdpdGggbW9yZSB0aGFuIDUgYXJncyBhcmUgbm90IHN1cHBvcnRlZC5cIlxuXG5Db2xvckhvbGRlciJdfQ==
},{"../../../../utility/css/Color":43}],37:[function(require,module,exports){
var Fill_, Layout_, Transforms_, Transitioner, classic, easing, object, timing, _ref;

Fill_ = require('./mixin/Fill_');

Transforms_ = require('./mixin/Transforms_');

Layout_ = require('./mixin/Layout_');

timing = require('../../../timing');

easing = require('../../../visuals/animation/easing');

_ref = require('utila'), classic = _ref.classic, object = _ref.object;

module.exports = classic.mix(Fill_, Transforms_, Layout_, Transitioner = (function() {
  function Transitioner(el) {
    this.el = el;
    this._styleSetter = this.el._styleSetter;
    this._enabled = false;
    this._duration = 1000;
    this._startTime = 0;
    Transitioner.__initMixinsFor(this);
    this._needsUpdate = {
      transformMovement: false,
      transformRotation: false,
      transformScale: false,
      transformPerspective: false,
      transformLocalMovement: false,
      opacity: false,
      width: false,
      height: false,
      clip: false
    };
    this._shouldUpdate = false;
    this.ease('cubic.easeOut');
  }

  Transitioner.prototype.ease = function(funcNameOrFirstNumOfCubicBezier, secondNum, thirdNum, fourthNum) {
    this._easing = easing.get.apply(easing, arguments);
    return this;
  };

  Transitioner.prototype.clone = function(el) {
    var key, newObj;
    newObj = Object.create(this.constructor.prototype);
    newObj.el = el;
    newObj._startTime = new Int32Array(1);
    newObj._startTime[0] = 0;
    newObj._styleSetter = el._styleSetter;
    newObj._needsUpdate = {
      transformMovement: false,
      transformRotation: false,
      transformScale: false,
      transformPerspective: false,
      transformLocalMovement: false,
      width: false,
      height: false,
      opacity: false,
      clip: false
    };
    Transitioner.__applyClonersFor(this, [newObj]);
    for (key in this) {
      if (newObj[key] !== void 0) {
        continue;
      }
      if (this.hasOwnProperty(key)) {
        newObj[key] = object.clone(this[key], true);
      }
    }
    return newObj;
  };

  Transitioner.prototype.enable = function(duration) {
    this._enabled = true;
    this._duration = duration;
    return this;
  };

  Transitioner.prototype.disable = function() {
    this._enabled = false;
    this._stop();
    return this;
  };

  Transitioner.prototype._stop = function() {
    this._shouldUpdate = false;
    this._disableTransitionForTransforms();
    this._disableTransitionForFill();
    this._disableTransitionForLayout();
  };

  Transitioner.prototype._update = function() {
    if (this._startTime === timing.time) {
      return;
    }
    this._startOver();
  };

  Transitioner.prototype._startOver = function() {
    this._startTime = timing.time;
    this._adjustFromValues();
    this._shouldUpdate = true;
    return this._scheduleUpdate();
  };

  Transitioner.prototype._adjustFromValues = function() {
    this._adjustFromValuesForTransforms();
    this._adjustFromValuesForFill();
    this._adjustFromValuesForLayout();
    return this;
  };

  Transitioner.prototype._scheduleUpdate = function() {
    return this.el._scheduleUpdate();
  };

  Transitioner.prototype._updateTransition = function() {
    if (!this._enabled || !this._shouldUpdate) {
      return;
    }
    return this._updateForTime(timing.time);
  };

  Transitioner.prototype._updateForTime = function(t) {
    var ellapsed, progress;
    ellapsed = t - this._startTime;
    progress = ellapsed / this._duration;
    if (progress >= 1) {
      progress = 1;
    } else {
      this._scheduleUpdate();
    }
    progress = this._ease(progress);
    this._updateByProgress(progress);
    if (progress === 1) {
      this._stop();
    }
  };

  Transitioner.prototype._updateByProgress = function(progress) {
    this._updateTransitionForTransforms(progress);
    this._updateTransitionForFill(progress);
    this._updateTransitionForLayout(progress);
    return null;
  };

  Transitioner.prototype._ease = function(progress) {
    return this._easing(progress);
  };

  return Transitioner;

})());

},{"../../../timing":41,"../../../visuals/animation/easing":56,"./mixin/Fill_":38,"./mixin/Layout_":39,"./mixin/Transforms_":40,"utila":24}],38:[function(require,module,exports){
var Fill_;

module.exports = Fill_ = (function() {
  function Fill_() {}

  Fill_.prototype.__initMixinFill = function() {
    this._fromFill = {
      opacity: null
    };
    this._toFill = {
      opacity: null
    };
    this._currentFill = this.el._styleSetter._fill;
  };

  Fill_.prototype.__clonerForFill = function(newTransitioner) {
    newTransitioner._currentFill = newTransitioner.el._styleSetter._fill;
  };

  Fill_.prototype._adjustFromValuesForFill = function() {
    this._fromFill.opacity = this._currentFill.opacity;
  };

  Fill_.prototype._disableTransitionForFill = function() {
    this._toFill.opacity = this._currentFill.opacity;
    this._needsUpdate.opacity = false;
  };

  Fill_.prototype._updateTransitionForFill = function(progress) {
    if (this._needsUpdate.opacity) {
      this._updateOpacity(progress);
    }
  };

  Fill_.prototype.setOpacity = function(d) {
    this._toFill.opacity = d;
    this._needsUpdate.opacity = true;
    this._update();
    return this;
  };

  Fill_.prototype.adjustOpacity = function(d) {
    this._toFill.opacity = this._currentFill.opacity + d;
    this._needsUpdate.opacity = true;
    this._update();
    return this;
  };

  Fill_.prototype._updateOpacity = function(progress) {
    this._styleSetter.setOpacity(this._fromFill.opacity + (this._toFill.opacity - this._fromFill.opacity) * progress);
  };

  return Fill_;

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsbF8uanMiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLlxcLi5cXC4uXFwuLiIsInNvdXJjZXMiOlsiY29mZmVlXFxsaWJcXGVsXFxtaXhpblxcdHJhbnNpdGlvbmVyXFxtaXhpblxcRmlsbF8uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsQ0FBQTs7QUFBQSxDQUFBLEVBQXVCLEdBQWpCLENBQU47Q0FFQzs7Q0FBQSxFQUFpQixNQUFBLE1BQWpCO0NBRUMsRUFFQyxDQUZELEtBQUE7Q0FFQyxDQUFTLEVBQVQsRUFBQSxDQUFBO0NBRkQsS0FBQTtDQUFBLEVBTUMsQ0FGRCxHQUFBO0NBRUMsQ0FBUyxFQUFULEVBQUEsQ0FBQTtDQU5ELEtBQUE7Q0FBQSxDQVFtQixDQUFILENBQWhCLENBUkEsT0FRQTtDQVZELEVBQWlCOztDQUFqQixFQWNpQixNQUFDLE1BQWxCO0NBRUMsQ0FBaUQsQ0FBbEIsQ0FBL0IsQ0FBQSxPQUFBLEdBQWU7Q0FoQmhCLEVBY2lCOztDQWRqQixFQW9CMEIsTUFBQSxlQUExQjtDQUVDLEVBQXFCLENBQXJCLEdBQUEsRUFBVSxHQUF3QjtDQXRCbkMsRUFvQjBCOztDQXBCMUIsRUEwQjJCLE1BQUEsZ0JBQTNCO0NBRUMsRUFBbUIsQ0FBbkIsR0FBUSxLQUF3QjtDQUFoQyxFQUV3QixDQUF4QixDQUZBLEVBRUEsS0FBYTtDQTlCZCxFQTBCMkI7O0NBMUIzQixFQWtDMEIsS0FBQSxDQUFDLGVBQTNCO0NBRUMsR0FBQSxHQUFBLEtBQWdCO0NBRWYsR0FBQyxFQUFELEVBQUEsTUFBQTtNQUp3QjtDQWxDMUIsRUFrQzBCOztDQWxDMUIsRUEwQ1ksTUFBQyxDQUFiO0NBRUMsRUFBbUIsQ0FBbkIsR0FBUTtDQUFSLEVBRXdCLENBQXhCLEdBQUEsS0FBYTtDQUZiLEdBSUcsR0FBSDtDQU5XLFVBUVg7Q0FsREQsRUEwQ1k7O0NBMUNaLEVBb0RlLE1BQUMsSUFBaEI7Q0FFQyxFQUFtQixDQUFuQixHQUFRLEtBQXdCO0NBQWhDLEVBRXdCLENBQXhCLEdBQUEsS0FBYTtDQUZiLEdBSUcsR0FBSDtDQU5jLFVBUWQ7Q0E1REQsRUFvRGU7O0NBcERmLEVBOERnQixLQUFBLENBQUMsS0FBakI7Q0FFQyxFQUlDLENBSkQsR0FFQyxDQUZELENBRVcsQ0FGWCxFQUFhO0NBaEVkLEVBOERnQjs7Q0E5RGhCOztDQUZEIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBGaWxsX1xuXG5cdF9faW5pdE1peGluRmlsbDogLT5cblxuXHRcdEBfZnJvbUZpbGwgPVxuXG5cdFx0XHRvcGFjaXR5OiBudWxsXG5cblx0XHRAX3RvRmlsbCA9XG5cblx0XHRcdG9wYWNpdHk6IG51bGxcblxuXHRcdEBfY3VycmVudEZpbGwgPSBAZWwuX3N0eWxlU2V0dGVyLl9maWxsXG5cblx0XHRyZXR1cm5cblxuXHRfX2Nsb25lckZvckZpbGw6IChuZXdUcmFuc2l0aW9uZXIpIC0+XG5cblx0XHRuZXdUcmFuc2l0aW9uZXIuX2N1cnJlbnRGaWxsID0gbmV3VHJhbnNpdGlvbmVyLmVsLl9zdHlsZVNldHRlci5fZmlsbFxuXG5cdFx0cmV0dXJuXG5cblx0X2FkanVzdEZyb21WYWx1ZXNGb3JGaWxsOiAtPlxuXG5cdFx0QF9mcm9tRmlsbC5vcGFjaXR5ID0gQF9jdXJyZW50RmlsbC5vcGFjaXR5XG5cblx0XHRyZXR1cm5cblxuXHRfZGlzYWJsZVRyYW5zaXRpb25Gb3JGaWxsOiAtPlxuXG5cdFx0QF90b0ZpbGwub3BhY2l0eSA9IEBfY3VycmVudEZpbGwub3BhY2l0eVxuXG5cdFx0QF9uZWVkc1VwZGF0ZS5vcGFjaXR5ID0gbm9cblxuXHRcdHJldHVyblxuXG5cdF91cGRhdGVUcmFuc2l0aW9uRm9yRmlsbDogKHByb2dyZXNzKSAtPlxuXG5cdFx0aWYgQF9uZWVkc1VwZGF0ZS5vcGFjaXR5XG5cblx0XHRcdEBfdXBkYXRlT3BhY2l0eSBwcm9ncmVzc1xuXG5cdFx0cmV0dXJuXG5cblx0c2V0T3BhY2l0eTogKGQpIC0+XG5cblx0XHRAX3RvRmlsbC5vcGFjaXR5ID0gZFxuXG5cdFx0QF9uZWVkc1VwZGF0ZS5vcGFjaXR5ID0geWVzXG5cblx0XHRkbyBAX3VwZGF0ZVxuXG5cdFx0QFxuXG5cdGFkanVzdE9wYWNpdHk6IChkKSAtPlxuXG5cdFx0QF90b0ZpbGwub3BhY2l0eSA9IEBfY3VycmVudEZpbGwub3BhY2l0eSArIGRcblxuXHRcdEBfbmVlZHNVcGRhdGUub3BhY2l0eSA9IHllc1xuXG5cdFx0ZG8gQF91cGRhdGVcblxuXHRcdEBcblxuXHRfdXBkYXRlT3BhY2l0eTogKHByb2dyZXNzKSAtPlxuXG5cdFx0QF9zdHlsZVNldHRlci5zZXRPcGFjaXR5IChcblxuXHRcdFx0QF9mcm9tRmlsbC5vcGFjaXR5ICtcblxuXHRcdFx0KEBfdG9GaWxsLm9wYWNpdHkgLSBAX2Zyb21GaWxsLm9wYWNpdHkpICogcHJvZ3Jlc3NcblxuXHRcdClcblxuXHRcdHJldHVybiJdfQ==
},{}],39:[function(require,module,exports){
var Layout_;

module.exports = Layout_ = (function() {
  function Layout_() {}

  Layout_.prototype.__initMixinLayout = function() {
    this._fromLayout = {
      width: null,
      height: null,
      clipLeft: 'auto',
      clipRight: 'auto',
      clipTop: 'auto',
      clipBottom: 'auto'
    };
    this._toLayout = {
      width: null,
      height: null,
      clipLeft: 'auto',
      clipRight: 'auto',
      clipTop: 'auto',
      clipBottom: 'auto'
    };
    this._currentLayout = this.el._styleSetter._layout;
  };

  Layout_.prototype.__clonerForLayout = function(newTransitioner) {
    newTransitioner._currentLayout = newTransitioner.el._styleSetter._layout;
  };

  Layout_.prototype._adjustFromValuesForLayout = function() {
    this._fromLayout.width = this._currentLayout.width;
    this._fromLayout.height = this._currentLayout.height;
    this._fromLayout.clipTop = this._currentLayout.clipTop;
    this._fromLayout.clipRight = this._currentLayout.clipRight;
    this._fromLayout.clipBottom = this._currentLayout.clipBottom;
    this._fromLayout.clipLeft = this._currentLayout.clipLeft;
  };

  Layout_.prototype._disableTransitionForLayout = function() {
    this._toLayout.width = this._currentLayout.width;
    this._toLayout.height = this._currentLayout.height;
    this._toLayout.clipTop = this._currentLayout.clipTop;
    this._toLayout.clipRight = this._currentLayout.clipRight;
    this._toLayout.clipBottom = this._currentLayout.clipBottom;
    this._toLayout.clipLeft = this._currentLayout.clipLeft;
    this._needsUpdate.width = false;
    this._needsUpdate.height = false;
    this._needsUpdate.clip = false;
  };

  Layout_.prototype._updateTransitionForLayout = function(progress) {
    if (this._needsUpdate.width) {
      this._updateWidth(progress);
    }
    if (this._needsUpdate.height) {
      this._updateHeight(progress);
    }
    if (this._needsUpdate.clip) {
      this._updateClip(progress);
    }
  };

  Layout_.prototype._updateClip = function(progress) {
    this._styleSetter.clip(this._fromLayout.clipTop + (this._toLayout.clipTop - this._fromLayout.clipTop) * progress, this._fromLayout.clipRight + (this._toLayout.clipRight - this._fromLayout.clipRight) * progress, this._fromLayout.clipBottom + (this._toLayout.clipBottom - this._fromLayout.clipBottom) * progress, this._fromLayout.clipLeft + (this._toLayout.clipLeft - this._fromLayout.clipLeft) * progress);
  };

  Layout_.prototype._updateWidth = function(progress) {
    this._styleSetter.setWidth(this._fromLayout.width + (this._toLayout.width - this._fromLayout.width) * progress);
  };

  Layout_.prototype._updateHeight = function(progress) {
    this._styleSetter.setHeight(this._fromLayout.height + (this._toLayout.height - this._fromLayout.height) * progress);
  };

  Layout_.prototype.setWidth = function(d) {
    this._toLayout.width = d;
    this._needsUpdate.width = true;
    this._update();
    return this;
  };

  Layout_.prototype.setHeight = function(d) {
    this._toLayout.height = d;
    this._needsUpdate.height = true;
    this._update();
    return this;
  };

  Layout_.prototype.clip = function(t, r, b, l) {
    this._toLayout.clipTop = t;
    this._toLayout.clipRight = r;
    this._toLayout.clipBottom = b;
    this._toLayout.clipLeft = l;
    this._needsUpdate.clip = true;
    this._update();
    return this;
  };

  Layout_.prototype.clipTop = function(t) {
    this._toLayout.clipTop = t;
    this._needsUpdate.clip = true;
    this._update();
    return this;
  };

  Layout_.prototype.clipRight = function(r) {
    this._toLayout.clipRight = r;
    this._needsUpdate.clip = true;
    this._update();
    return this;
  };

  Layout_.prototype.clipBottom = function(b) {
    this._toLayout.clipBottom = b;
    this._needsUpdate.clip = true;
    this._update();
    return this;
  };

  Layout_.prototype.clipLeft = function(l) {
    this._toLayout.clipLeft = l;
    this._needsUpdate.clip = true;
    this._update();
    return this;
  };

  return Layout_;

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGF5b3V0Xy5qcyIsInNvdXJjZVJvb3QiOiIuLlxcLi5cXC4uXFwuLlxcLi5cXC4uIiwic291cmNlcyI6WyJjb2ZmZWVcXGxpYlxcZWxcXG1peGluXFx0cmFuc2l0aW9uZXJcXG1peGluXFxMYXlvdXRfLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLEdBQUE7O0FBQUEsQ0FBQSxFQUF1QixHQUFqQixDQUFOO0NBRUM7O0NBQUEsRUFBbUIsTUFBQSxRQUFuQjtDQUVDLEVBRUMsQ0FGRCxPQUFBO0NBRUMsQ0FBTyxFQUFQLENBQUEsQ0FBQTtDQUFBLENBRVEsRUFGUixFQUVBO0NBRkEsQ0FJVSxJQUFWLEVBQUE7Q0FKQSxDQU1XLElBQVgsR0FBQTtDQU5BLENBUVMsSUFBVCxDQUFBO0NBUkEsQ0FVWSxJQUFaLElBQUE7Q0FaRCxLQUFBO0NBQUEsRUFnQkMsQ0FGRCxLQUFBO0NBRUMsQ0FBTyxFQUFQLENBQUEsQ0FBQTtDQUFBLENBRVEsRUFGUixFQUVBO0NBRkEsQ0FJVSxJQUFWLEVBQUE7Q0FKQSxDQU1XLElBQVgsR0FBQTtDQU5BLENBUVMsSUFBVCxDQUFBO0NBUkEsQ0FVWSxJQUFaLElBQUE7Q0ExQkQsS0FBQTtDQUFBLENBNEJxQixDQUFILENBQWxCLEdBNUJBLEtBNEJrQyxFQUFsQztDQTlCRCxFQUFtQjs7Q0FBbkIsRUFrQ21CLE1BQUMsTUFBRCxFQUFuQjtDQUVDLENBQW1ELENBQWxCLENBQWpDLEdBQUEsS0FBZ0UsRUFBaEUsQ0FBZTtDQXBDaEIsRUFrQ21COztDQWxDbkIsRUF3QzRCLE1BQUEsaUJBQTVCO0NBRUMsRUFBcUIsQ0FBckIsQ0FBQSxNQUFZLEdBQXdCO0NBQXBDLEVBQ3NCLENBQXRCLEVBQUEsS0FBWSxHQUF5QjtDQURyQyxFQUd1QixDQUF2QixHQUFBLElBQVksR0FBMEI7Q0FIdEMsRUFJeUIsQ0FBekIsS0FBQSxFQUFZLEdBQTRCO0NBSnhDLEVBSzBCLENBQTFCLE1BQUEsQ0FBWSxHQUE2QjtDQUx6QyxFQU13QixDQUF4QixJQUFBLEdBQVksR0FBMkI7Q0FoRHhDLEVBd0M0Qjs7Q0F4QzVCLEVBcUQ2QixNQUFBLGtCQUE3QjtDQUVDLEVBQW1CLENBQW5CLENBQUEsSUFBVSxLQUF3QjtDQUFsQyxFQUNvQixDQUFwQixFQUFBLEdBQVUsS0FBeUI7Q0FEbkMsRUFHcUIsQ0FBckIsR0FBQSxFQUFVLEtBQTBCO0NBSHBDLEVBSXVCLENBQXZCLEtBQVUsS0FBNEI7Q0FKdEMsRUFLd0IsQ0FBeEIsS0FBVSxDQUFWLElBQXVDO0NBTHZDLEVBTXNCLENBQXRCLElBQUEsQ0FBVSxLQUEyQjtDQU5yQyxFQVFzQixDQUF0QixDQUFBLE9BQWE7Q0FSYixFQVN1QixDQUF2QixDQVRBLENBU0EsTUFBYTtDQVRiLEVBVXFCLENBQXJCLENBVkEsT0FVYTtDQWpFZCxFQXFENkI7O0NBckQ3QixFQXFFNEIsS0FBQSxDQUFDLGlCQUE3QjtDQUVDLEdBQUEsQ0FBQSxPQUFnQjtDQUVmLEdBQUMsRUFBRCxFQUFBLElBQUE7TUFGRDtDQUlBLEdBQUEsRUFBQSxNQUFnQjtDQUVmLEdBQUMsRUFBRCxFQUFBLEtBQUE7TUFORDtDQVFBLEdBQUEsUUFBZ0I7Q0FFZixHQUFDLEVBQUQsRUFBQSxHQUFBO01BWjBCO0NBckU1QixFQXFFNEI7O0NBckU1QixFQXFGYSxLQUFBLENBQUMsRUFBZDtDQUVDLENBTUUsQ0FGQSxDQUpGLEdBRUMsQ0FGRCxDQUlhLENBTVgsQ0FSVyxDQUZBO0NBdkZkLEVBcUZhOztDQXJGYixFQTZHYyxLQUFBLENBQUMsR0FBZjtDQUVDLEVBSUMsQ0FKRCxDQUVDLEdBRkQsQ0FJWSxFQUZDLENBRkE7Q0EvR2QsRUE2R2M7O0NBN0dkLEVBeUhlLEtBQUEsQ0FBQyxJQUFoQjtDQUVDLEVBSUMsQ0FKRCxFQUVDLEVBRkQsQ0FBQSxFQUVhLENBRkE7Q0EzSGQsRUF5SGU7O0NBekhmLEVBcUlVLEtBQVYsQ0FBVztDQUVWLEVBQW1CLENBQW5CLENBQUEsSUFBVTtDQUFWLEVBRXNCLENBQXRCLENBQUEsT0FBYTtDQUZiLEdBSUcsR0FBSDtDQU5TLFVBUVQ7Q0E3SUQsRUFxSVU7O0NBcklWLEVBK0lXLE1BQVg7Q0FFQyxFQUFvQixDQUFwQixFQUFBLEdBQVU7Q0FBVixFQUV1QixDQUF2QixFQUFBLE1BQWE7Q0FGYixHQUlHLEdBQUg7Q0FOVSxVQVFWO0NBdkpELEVBK0lXOztDQS9JWCxDQXlKVSxDQUFKLENBQU4sS0FBTztDQUVOLEVBQXFCLENBQXJCLEdBQUEsRUFBVTtDQUFWLEVBQ3VCLENBQXZCLEtBQVU7Q0FEVixFQUV3QixDQUF4QixLQUFVLENBQVY7Q0FGQSxFQUdzQixDQUF0QixJQUFBLENBQVU7Q0FIVixFQUtxQixDQUFyQixRQUFhO0NBTGIsR0FPRyxHQUFIO0NBVEssVUFXTDtDQXBLRCxFQXlKTTs7Q0F6Sk4sRUFzS1MsSUFBVCxFQUFVO0NBRVQsRUFBcUIsQ0FBckIsR0FBQSxFQUFVO0NBQVYsRUFFcUIsQ0FBckIsUUFBYTtDQUZiLEdBSUcsR0FBSDtDQU5RLFVBUVI7Q0E5S0QsRUFzS1M7O0NBdEtULEVBZ0xXLE1BQVg7Q0FFQyxFQUF1QixDQUF2QixLQUFVO0NBQVYsRUFFcUIsQ0FBckIsUUFBYTtDQUZiLEdBSUcsR0FBSDtDQU5VLFVBUVY7Q0F4TEQsRUFnTFc7O0NBaExYLEVBMExZLE1BQUMsQ0FBYjtDQUVDLEVBQXdCLENBQXhCLEtBQVUsQ0FBVjtDQUFBLEVBRXFCLENBQXJCLFFBQWE7Q0FGYixHQUlHLEdBQUg7Q0FOVyxVQVFYO0NBbE1ELEVBMExZOztDQTFMWixFQW9NVSxLQUFWLENBQVc7Q0FFVixFQUFzQixDQUF0QixJQUFBLENBQVU7Q0FBVixFQUVxQixDQUFyQixRQUFhO0NBRmIsR0FJRyxHQUFIO0NBTlMsVUFRVDtDQTVNRCxFQW9NVTs7Q0FwTVY7O0NBRkQiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGNsYXNzIExheW91dF9cblxuXHRfX2luaXRNaXhpbkxheW91dDogLT5cblxuXHRcdEBfZnJvbUxheW91dCA9XG5cblx0XHRcdHdpZHRoOiBudWxsXG5cblx0XHRcdGhlaWdodDogbnVsbFxuXG5cdFx0XHRjbGlwTGVmdDogJ2F1dG8nXG5cblx0XHRcdGNsaXBSaWdodDogJ2F1dG8nXG5cblx0XHRcdGNsaXBUb3A6ICdhdXRvJ1xuXG5cdFx0XHRjbGlwQm90dG9tOiAnYXV0bydcblxuXHRcdEBfdG9MYXlvdXQgPVxuXG5cdFx0XHR3aWR0aDogbnVsbFxuXG5cdFx0XHRoZWlnaHQ6IG51bGxcblxuXHRcdFx0Y2xpcExlZnQ6ICdhdXRvJ1xuXG5cdFx0XHRjbGlwUmlnaHQ6ICdhdXRvJ1xuXG5cdFx0XHRjbGlwVG9wOiAnYXV0bydcblxuXHRcdFx0Y2xpcEJvdHRvbTogJ2F1dG8nXG5cblx0XHRAX2N1cnJlbnRMYXlvdXQgPSBAZWwuX3N0eWxlU2V0dGVyLl9sYXlvdXRcblxuXHRcdHJldHVyblxuXG5cdF9fY2xvbmVyRm9yTGF5b3V0OiAobmV3VHJhbnNpdGlvbmVyKSAtPlxuXG5cdFx0bmV3VHJhbnNpdGlvbmVyLl9jdXJyZW50TGF5b3V0ID0gbmV3VHJhbnNpdGlvbmVyLmVsLl9zdHlsZVNldHRlci5fbGF5b3V0XG5cblx0XHRyZXR1cm5cblxuXHRfYWRqdXN0RnJvbVZhbHVlc0ZvckxheW91dDogLT5cblxuXHRcdEBfZnJvbUxheW91dC53aWR0aCA9IEBfY3VycmVudExheW91dC53aWR0aFxuXHRcdEBfZnJvbUxheW91dC5oZWlnaHQgPSBAX2N1cnJlbnRMYXlvdXQuaGVpZ2h0XG5cblx0XHRAX2Zyb21MYXlvdXQuY2xpcFRvcCA9IEBfY3VycmVudExheW91dC5jbGlwVG9wXG5cdFx0QF9mcm9tTGF5b3V0LmNsaXBSaWdodCA9IEBfY3VycmVudExheW91dC5jbGlwUmlnaHRcblx0XHRAX2Zyb21MYXlvdXQuY2xpcEJvdHRvbSA9IEBfY3VycmVudExheW91dC5jbGlwQm90dG9tXG5cdFx0QF9mcm9tTGF5b3V0LmNsaXBMZWZ0ID0gQF9jdXJyZW50TGF5b3V0LmNsaXBMZWZ0XG5cblxuXHRcdHJldHVyblxuXG5cdF9kaXNhYmxlVHJhbnNpdGlvbkZvckxheW91dDogLT5cblxuXHRcdEBfdG9MYXlvdXQud2lkdGggPSBAX2N1cnJlbnRMYXlvdXQud2lkdGhcblx0XHRAX3RvTGF5b3V0LmhlaWdodCA9IEBfY3VycmVudExheW91dC5oZWlnaHRcblxuXHRcdEBfdG9MYXlvdXQuY2xpcFRvcCA9IEBfY3VycmVudExheW91dC5jbGlwVG9wXG5cdFx0QF90b0xheW91dC5jbGlwUmlnaHQgPSBAX2N1cnJlbnRMYXlvdXQuY2xpcFJpZ2h0XG5cdFx0QF90b0xheW91dC5jbGlwQm90dG9tID0gQF9jdXJyZW50TGF5b3V0LmNsaXBCb3R0b21cblx0XHRAX3RvTGF5b3V0LmNsaXBMZWZ0ID0gQF9jdXJyZW50TGF5b3V0LmNsaXBMZWZ0XG5cblx0XHRAX25lZWRzVXBkYXRlLndpZHRoID0gbm9cblx0XHRAX25lZWRzVXBkYXRlLmhlaWdodCA9IG5vXG5cdFx0QF9uZWVkc1VwZGF0ZS5jbGlwID0gbm9cblxuXHRcdHJldHVyblxuXG5cdF91cGRhdGVUcmFuc2l0aW9uRm9yTGF5b3V0OiAocHJvZ3Jlc3MpIC0+XG5cblx0XHRpZiBAX25lZWRzVXBkYXRlLndpZHRoXG5cblx0XHRcdEBfdXBkYXRlV2lkdGggcHJvZ3Jlc3NcblxuXHRcdGlmIEBfbmVlZHNVcGRhdGUuaGVpZ2h0XG5cblx0XHRcdEBfdXBkYXRlSGVpZ2h0IHByb2dyZXNzXG5cblx0XHRpZiBAX25lZWRzVXBkYXRlLmNsaXBcblxuXHRcdFx0QF91cGRhdGVDbGlwIHByb2dyZXNzXG5cblx0XHRyZXR1cm5cblxuXHRfdXBkYXRlQ2xpcDogKHByb2dyZXNzKSAtPlxuXG5cdFx0QF9zdHlsZVNldHRlci5jbGlwIChcblxuXHRcdFx0QF9mcm9tTGF5b3V0LmNsaXBUb3AgK1xuXG5cdFx0XHRcdChAX3RvTGF5b3V0LmNsaXBUb3AgLSBAX2Zyb21MYXlvdXQuY2xpcFRvcCkgKiBwcm9ncmVzcyksXG5cblx0XHRcdChAX2Zyb21MYXlvdXQuY2xpcFJpZ2h0ICtcblxuXHRcdFx0XHQoQF90b0xheW91dC5jbGlwUmlnaHQgLSBAX2Zyb21MYXlvdXQuY2xpcFJpZ2h0KSAqIHByb2dyZXNzKSxcblxuXHRcdFx0KEBfZnJvbUxheW91dC5jbGlwQm90dG9tICtcblxuXHRcdFx0XHQoQF90b0xheW91dC5jbGlwQm90dG9tIC0gQF9mcm9tTGF5b3V0LmNsaXBCb3R0b20pICogcHJvZ3Jlc3MpLFxuXG5cdFx0XHQoQF9mcm9tTGF5b3V0LmNsaXBMZWZ0ICtcblxuXHRcdFx0XHQoQF90b0xheW91dC5jbGlwTGVmdCAtIEBfZnJvbUxheW91dC5jbGlwTGVmdCkgKiBwcm9ncmVzcylcblxuXG5cblx0XHRyZXR1cm5cblxuXHRfdXBkYXRlV2lkdGg6IChwcm9ncmVzcykgLT5cblxuXHRcdEBfc3R5bGVTZXR0ZXIuc2V0V2lkdGggKFxuXG5cdFx0XHRAX2Zyb21MYXlvdXQud2lkdGggK1xuXG5cdFx0XHQoQF90b0xheW91dC53aWR0aCAtIEBfZnJvbUxheW91dC53aWR0aCkgKiBwcm9ncmVzc1xuXG5cdFx0KVxuXG5cdFx0cmV0dXJuXG5cblx0X3VwZGF0ZUhlaWdodDogKHByb2dyZXNzKSAtPlxuXG5cdFx0QF9zdHlsZVNldHRlci5zZXRIZWlnaHQgKFxuXG5cdFx0XHRAX2Zyb21MYXlvdXQuaGVpZ2h0ICtcblxuXHRcdFx0KEBfdG9MYXlvdXQuaGVpZ2h0IC0gQF9mcm9tTGF5b3V0LmhlaWdodCkgKiBwcm9ncmVzc1xuXG5cdFx0KVxuXG5cdFx0cmV0dXJuXG5cblx0c2V0V2lkdGg6IChkKSAtPlxuXG5cdFx0QF90b0xheW91dC53aWR0aCA9IGRcblxuXHRcdEBfbmVlZHNVcGRhdGUud2lkdGggPSB5ZXNcblxuXHRcdGRvIEBfdXBkYXRlXG5cblx0XHRAXG5cblx0c2V0SGVpZ2h0OiAoZCkgLT5cblxuXHRcdEBfdG9MYXlvdXQuaGVpZ2h0ID0gZFxuXG5cdFx0QF9uZWVkc1VwZGF0ZS5oZWlnaHQgPSB5ZXNcblxuXHRcdGRvIEBfdXBkYXRlXG5cblx0XHRAXG5cblx0Y2xpcDogKHQsIHIsIGIsIGwpIC0+XG5cblx0XHRAX3RvTGF5b3V0LmNsaXBUb3AgPSB0XG5cdFx0QF90b0xheW91dC5jbGlwUmlnaHQgPSByXG5cdFx0QF90b0xheW91dC5jbGlwQm90dG9tID0gYlxuXHRcdEBfdG9MYXlvdXQuY2xpcExlZnQgPSBsXG5cblx0XHRAX25lZWRzVXBkYXRlLmNsaXAgPSB5ZXNcblxuXHRcdGRvIEBfdXBkYXRlXG5cblx0XHRAXG5cblx0Y2xpcFRvcDogKHQpIC0+XG5cblx0XHRAX3RvTGF5b3V0LmNsaXBUb3AgPSB0XG5cblx0XHRAX25lZWRzVXBkYXRlLmNsaXAgPSB5ZXNcblxuXHRcdGRvIEBfdXBkYXRlXG5cblx0XHRAXG5cblx0Y2xpcFJpZ2h0OiAocikgLT5cblxuXHRcdEBfdG9MYXlvdXQuY2xpcFJpZ2h0ID0gclxuXG5cdFx0QF9uZWVkc1VwZGF0ZS5jbGlwID0geWVzXG5cblx0XHRkbyBAX3VwZGF0ZVxuXG5cdFx0QFxuXG5cdGNsaXBCb3R0b206IChiKSAtPlxuXG5cdFx0QF90b0xheW91dC5jbGlwQm90dG9tID0gYlxuXG5cdFx0QF9uZWVkc1VwZGF0ZS5jbGlwID0geWVzXG5cblx0XHRkbyBAX3VwZGF0ZVxuXG5cdFx0QFxuXG5cdGNsaXBMZWZ0OiAobCkgLT5cblxuXHRcdEBfdG9MYXlvdXQuY2xpcExlZnQgPSBsXG5cblx0XHRAX25lZWRzVXBkYXRlLmNsaXAgPSB5ZXNcblxuXHRcdGRvIEBfdXBkYXRlXG5cblx0XHRAIl19
},{}],40:[function(require,module,exports){
var Transformation, Transforms_;

Transformation = require('Transformation');

module.exports = Transforms_ = (function() {
  function Transforms_() {}

  Transforms_.prototype.__initMixinTransforms = function() {
    this._toMatrix = Transformation._emptyStack();
    this._fromMatrix = Transformation._emptyStack();
    return this._currentMatrix = this.el._styleSetter._transformer._current;
  };

  Transforms_.prototype.__clonerForTransforms = function(newTransitioner) {
    newTransitioner._currentMatrix = newTransitioner.el._styleSetter._transformer._current;
  };

  Transforms_.prototype._adjustFromValuesForTransforms = function() {
    this._fromMatrix[0] = this._currentMatrix[0];
    this._fromMatrix[1] = this._currentMatrix[1];
    this._fromMatrix[2] = this._currentMatrix[2];
    this._fromMatrix[3] = this._currentMatrix[3];
    this._fromMatrix[4] = this._currentMatrix[4];
    this._fromMatrix[5] = this._currentMatrix[5];
    this._fromMatrix[6] = this._currentMatrix[6];
    this._fromMatrix[7] = this._currentMatrix[7];
    this._fromMatrix[8] = this._currentMatrix[8];
    this._fromMatrix[9] = this._currentMatrix[9];
    this._fromMatrix[10] = this._currentMatrix[10];
    this._fromMatrix[11] = this._currentMatrix[11];
    this._fromMatrix[12] = this._currentMatrix[12];
    this._fromMatrix[13] = this._currentMatrix[13];
    this._fromMatrix[14] = this._currentMatrix[14];
    this._fromMatrix[15] = this._currentMatrix[15];
    return this;
  };

  Transforms_.prototype._disableTransitionForTransforms = function() {
    this._needsUpdate.transformMovement = false;
    this._toMatrix[0] = this._currentMatrix[0];
    this._toMatrix[1] = this._currentMatrix[1];
    this._toMatrix[2] = this._currentMatrix[2];
    this._needsUpdate.transformScale = false;
    this._toMatrix[3] = this._currentMatrix[3];
    this._toMatrix[4] = this._currentMatrix[4];
    this._toMatrix[5] = this._currentMatrix[5];
    this._needsUpdate.transformPerspective = false;
    this._toMatrix[6] = this._currentMatrix[6];
    this._needsUpdate.transformRotation = false;
    this._toMatrix[7] = this._currentMatrix[7];
    this._toMatrix[8] = this._currentMatrix[8];
    this._toMatrix[9] = this._currentMatrix[9];
    this._needsUpdate.transformLocalMovement = false;
    this._toMatrix[10] = this._currentMatrix[10];
    this._toMatrix[11] = this._currentMatrix[11];
    this._toMatrix[12] = this._currentMatrix[12];
    this._needsUpdate.transformLocalRotation = false;
    this._toMatrix[13] = this._currentMatrix[13];
    this._toMatrix[14] = this._currentMatrix[14];
    this._toMatrix[15] = this._currentMatrix[15];
    return this;
  };

  Transforms_.prototype._updateTransitionForTransforms = function(progress) {
    if (this._needsUpdate.transformMovement) {
      this._updateMovement(progress);
    }
    if (this._needsUpdate.transformRotation) {
      this._updateRotation(progress);
    }
    if (this._needsUpdate.transformScale) {
      this._updateScale(progress);
    }
    if (this._needsUpdate.transformPerspective) {
      this._updatePerspective(progress);
    }
    if (this._needsUpdate.transformLocalMovement) {
      this._updateLocalMovement(progress);
    }
    if (this._needsUpdate.transformLocalRotation) {
      this._updateLocalRotation(progress);
    }
  };

  Transforms_.prototype._updateMovement = function(progress) {
    this._styleSetter.moveTo(this._fromMatrix[0] + ((this._toMatrix[0] - this._fromMatrix[0]) * progress), this._fromMatrix[1] + ((this._toMatrix[1] - this._fromMatrix[1]) * progress), this._fromMatrix[2] + ((this._toMatrix[2] - this._fromMatrix[2]) * progress));
    return null;
  };

  Transforms_.prototype._reportUpdateForMove = function() {
    if (this._needsUpdate.transformMovement) {
      return;
    }
    this._needsUpdate.transformMovement = true;
    this._toMatrix[0] = this._currentMatrix[0];
    this._toMatrix[1] = this._currentMatrix[1];
    this._toMatrix[2] = this._currentMatrix[2];
  };

  Transforms_.prototype.resetMovement = function() {
    this._reportUpdateForMove();
    this._toMatrix[0] = 0;
    this._toMatrix[1] = 0;
    this._toMatrix[2] = 0;
    this._update();
    return this;
  };

  Transforms_.prototype.moveTo = function(x, y, z) {
    this._reportUpdateForMove();
    this._toMatrix[0] = x;
    this._toMatrix[1] = y;
    this._toMatrix[2] = z;
    this._update();
    return this;
  };

  Transforms_.prototype.moveXTo = function(x) {
    this._reportUpdateForMove();
    this._toMatrix[0] = x;
    this._update();
    return this;
  };

  Transforms_.prototype.moveYTo = function(y) {
    this._reportUpdateForMove();
    this._toMatrix[1] = y;
    this._update();
    return this;
  };

  Transforms_.prototype.moveZTo = function(z) {
    this._reportUpdateForMove();
    this._toMatrix[2] = z;
    this._update();
    return this;
  };

  Transforms_.prototype.move = function(x, y, z) {
    this._reportUpdateForMove();
    this._toMatrix[0] = this._currentMatrix[0] + x;
    this._toMatrix[1] = this._currentMatrix[1] + y;
    this._toMatrix[2] = this._currentMatrix[2] + z;
    this._update();
    return this;
  };

  Transforms_.prototype.moveX = function(x) {
    this._reportUpdateForMove();
    this._toMatrix[0] = this._currentMatrix[0] + x;
    this._update();
    return this;
  };

  Transforms_.prototype.moveY = function(y) {
    this._reportUpdateForMove();
    this._toMatrix[1] = this._currentMatrix[1] + y;
    this._update();
    return this;
  };

  Transforms_.prototype.moveZ = function(z) {
    this._reportUpdateForMove();
    this._toMatrix[2] = this._currentMatrix[2] + z;
    this._update();
    return this;
  };

  /*
  	Scale
  */


  Transforms_.prototype._updateScale = function(progress) {
    this._styleSetter.scaleTo(this._fromMatrix[3] + ((this._toMatrix[3] - this._fromMatrix[3]) * progress), this._fromMatrix[4] + ((this._toMatrix[4] - this._fromMatrix[4]) * progress), this._fromMatrix[5] + ((this._toMatrix[5] - this._fromMatrix[5]) * progress));
    return null;
  };

  Transforms_.prototype._reportUpdateForScale = function() {
    if (this._needsUpdate.transformScale) {
      return;
    }
    this._needsUpdate.transformScale = true;
    this._toMatrix[3] = this._currentMatrix[3];
    this._toMatrix[4] = this._currentMatrix[4];
    this._toMatrix[5] = this._currentMatrix[5];
  };

  Transforms_.prototype.resetScale = function() {
    this._reportUpdateForScale();
    this._toMatrix[3] = 1;
    this._toMatrix[4] = 1;
    this._toMatrix[5] = 1;
    this._update();
    return this;
  };

  Transforms_.prototype.scaleTo = function(x, y, z) {
    this._reportUpdateForScale();
    this._toMatrix[3] = x;
    this._toMatrix[4] = y;
    this._toMatrix[5] = z;
    this._update();
    return this;
  };

  Transforms_.prototype.scaleXTo = function(x) {
    this._reportUpdateForScale();
    this._toMatrix[3] = x;
    this._update();
    return this;
  };

  Transforms_.prototype.scaleYTo = function(y) {
    this._reportUpdateForScale();
    this._toMatrix[4] = y;
    this._update();
    return this;
  };

  Transforms_.prototype.scaleZTo = function(z) {
    this._reportUpdateForScale();
    this._toMatrix[5] = z;
    this._update();
    return this;
  };

  Transforms_.prototype.scale = function(x, y, z) {
    this._reportUpdateForScale();
    this._toMatrix[3] = this._currentMatrix[3] * x;
    this._toMatrix[4] = this._currentMatrix[4] * y;
    this._toMatrix[5] = this._currentMatrix[5] * z;
    this._update();
    return this;
  };

  Transforms_.prototype.scaleAllTo = function(x) {
    this._reportUpdateForScale();
    this._toMatrix[3] = this._toMatrix[4] = this._toMatrix[5] = x;
    this._update();
    return this;
  };

  Transforms_.prototype.scaleX = function(x) {
    this._reportUpdateForScale();
    this._toMatrix[3] = this._currentMatrix[3] * x;
    this._update();
    return this;
  };

  Transforms_.prototype.scaleY = function(y) {
    this._reportUpdateForScale();
    this._toMatrix[4] = this._currentMatrix[4] * y;
    this._update();
    return this;
  };

  Transforms_.prototype.scaleZ = function(z) {
    this._reportUpdateForScale();
    this._toMatrix[5] = this._currentMatrix[5] * z;
    this._update();
    return this;
  };

  Transforms_.prototype._reportUpdateForPerspective = function() {
    if (this._needsUpdate.transformPerspective) {
      return;
    }
    this._needsUpdate.transformPerspective = true;
    this._toMatrix[6] = this._currentMatrix[6];
  };

  /*
  	Perspective
  */


  Transforms_.prototype._updatePerspective = function(progress) {
    this._styleSetter.perspective(this._fromMatrix[6] + ((this._toMatrix[6] - this._fromMatrix[6]) * progress));
    return null;
  };

  Transforms_.prototype.resetPerspective = function() {
    this._reportUpdateForPerspective();
    this._toMatrix[6] = 0;
    this._update();
    return this;
  };

  Transforms_.prototype.perspective = function(d) {
    this._reportUpdateForPerspective();
    this._toMatrix[6] = d;
    this._update();
    return this;
  };

  /*
  	Rotation
  */


  Transforms_.prototype._updateRotation = function(progress) {
    this._styleSetter.rotateTo(this._fromMatrix[7] + ((this._toMatrix[7] - this._fromMatrix[7]) * progress), this._fromMatrix[8] + ((this._toMatrix[8] - this._fromMatrix[8]) * progress), this._fromMatrix[9] + ((this._toMatrix[9] - this._fromMatrix[9]) * progress));
    return null;
  };

  Transforms_.prototype._reportUpdateForRotation = function() {
    if (this._needsUpdate.transformRotation) {
      return;
    }
    this._needsUpdate.transformRotation = true;
    this._toMatrix[7] = this._currentMatrix[7];
    this._toMatrix[8] = this._currentMatrix[8];
    this._toMatrix[9] = this._currentMatrix[9];
  };

  Transforms_.prototype.resetRotation = function() {
    this._reportUpdateForRotation();
    this._toMatrix[7] = 0;
    this._toMatrix[8] = 0;
    this._toMatrix[9] = 0;
    this._update();
    return this;
  };

  Transforms_.prototype.rotateTo = function(x, y, z) {
    this._reportUpdateForRotation();
    this._toMatrix[7] = x;
    this._toMatrix[8] = y;
    this._toMatrix[9] = z;
    this._update();
    return this;
  };

  Transforms_.prototype.rotateXTo = function(x) {
    this._reportUpdateForRotation();
    this._toMatrix[7] = x;
    this._update();
    return this;
  };

  Transforms_.prototype.rotateYTo = function(y) {
    this._reportUpdateForRotation();
    this._toMatrix[8] = y;
    this._update();
    return this;
  };

  Transforms_.prototype.rotateZTo = function(z) {
    this._reportUpdateForRotation();
    this._toMatrix[9] = z;
    this._update();
    return this;
  };

  Transforms_.prototype.rotate = function(x, y, z) {
    this._reportUpdateForRotation();
    this._toMatrix[7] = this._currentMatrix[7] + x;
    this._toMatrix[8] = this._currentMatrix[8] + y;
    this._toMatrix[9] = this._currentMatrix[9] + z;
    this._update();
    return this;
  };

  Transforms_.prototype.rotateX = function(x) {
    this._reportUpdateForRotation();
    this._toMatrix[7] = this._currentMatrix[7] + x;
    this._update();
    return this;
  };

  Transforms_.prototype.rotateY = function(y) {
    this._reportUpdateForRotation();
    this._toMatrix[8] = this._currentMatrix[8] + y;
    this._update();
    return this;
  };

  Transforms_.prototype.rotateZ = function(z) {
    this._reportUpdateForRotation();
    this._toMatrix[9] = this._currentMatrix[9] + z;
    this._update();
    return this;
  };

  /*
  	LocalMovement
  */


  Transforms_.prototype._updateLocalMovement = function(progress) {
    this._styleSetter.localMoveTo(this._fromMatrix[10] + ((this._toMatrix[10] - this._fromMatrix[10]) * progress), this._fromMatrix[11] + ((this._toMatrix[11] - this._fromMatrix[11]) * progress), this._fromMatrix[12] + ((this._toMatrix[12] - this._fromMatrix[12]) * progress));
    return null;
  };

  Transforms_.prototype._reportUpdateForLocalMovement = function() {
    if (this._needsUpdate.transformLocalMovement) {
      return;
    }
    this._needsUpdate.transformLocalMovement = true;
    this._toMatrix[10] = this._currentMatrix[10];
    this._toMatrix[11] = this._currentMatrix[11];
    this._toMatrix[12] = this._currentMatrix[12];
  };

  Transforms_.prototype.resetLocalMovement = function() {
    this._reportUpdateForLocalMovement();
    this._toMatrix[10] = 0;
    this._toMatrix[11] = 0;
    this._toMatrix[12] = 0;
    this._update();
    return this;
  };

  Transforms_.prototype.localMoveTo = function(x, y, z) {
    this._reportUpdateForLocalMovement();
    this._toMatrix[10] = x;
    this._toMatrix[11] = y;
    this._toMatrix[12] = z;
    this._update();
    return this;
  };

  Transforms_.prototype.localMoveXTo = function(x) {
    this._reportUpdateForLocalMovement();
    this._toMatrix[10] = x;
    this._update();
    return this;
  };

  Transforms_.prototype.localMoveYTo = function(y) {
    this._reportUpdateForLocalMovement();
    this._toMatrix[11] = y;
    this._update();
    return this;
  };

  Transforms_.prototype.localMoveZTo = function(z) {
    this._reportUpdateForLocalMovement();
    this._toMatrix[12] = z;
    this._update();
    return this;
  };

  Transforms_.prototype.localMove = function(x, y, z) {
    this._reportUpdateForLocalMovement();
    this._toMatrix[10] = this._currentMatrix[10] + x;
    this._toMatrix[11] = this._currentMatrix[11] + y;
    this._toMatrix[12] = this._currentMatrix[12] + z;
    this._update();
    return this;
  };

  Transforms_.prototype.localMoveX = function(x) {
    this._reportUpdateForLocalMovement();
    this._toMatrix[10] = this._currentMatrix[10] + x;
    this._update();
    return this;
  };

  Transforms_.prototype.localMoveY = function(y) {
    this._reportUpdateForLocalMovement();
    this._toMatrix[11] = this._currentMatrix[11] + y;
    this._update();
    return this;
  };

  Transforms_.prototype.localMoveZ = function(z) {
    this._reportUpdateForLocalMovement();
    this._toMatrix[12] = this._currentMatrix[12] + z;
    this._update();
    return this;
  };

  /*
  	Rotation
  */


  Transforms_.prototype._updateLocalRotation = function(progress) {
    this._styleSetter.localRotateTo(this._fromMatrix[13] + ((this._toMatrix[13] - this._fromMatrix[13]) * progress), this._fromMatrix[14] + ((this._toMatrix[14] - this._fromMatrix[14]) * progress), this._fromMatrix[15] + ((this._toMatrix[15] - this._fromMatrix[15]) * progress));
    return null;
  };

  Transforms_.prototype._reportUpdateForLocalRotation = function() {
    if (this._needsUpdate.transformLocalRotation) {
      return;
    }
    this._needsUpdate.transformLocalRotation = true;
    this._toMatrix[13] = this._currentMatrix[13];
    this._toMatrix[14] = this._currentMatrix[14];
    this._toMatrix[15] = this._currentMatrix[15];
  };

  Transforms_.prototype.resetLocalRotation = function() {
    this._reportUpdateForLocalRotation();
    this._toMatrix[13] = 0;
    this._toMatrix[14] = 0;
    this._toMatrix[15] = 0;
    this._update();
    return this;
  };

  Transforms_.prototype.localRotateTo = function(x, y, z) {
    this._reportUpdateForLocalRotation();
    this._toMatrix[13] = x;
    this._toMatrix[14] = y;
    this._toMatrix[15] = z;
    this._update();
    return this;
  };

  Transforms_.prototype.localRotateXTo = function(x) {
    this._reportUpdateForLocalRotation();
    this._toMatrix[13] = x;
    this._update();
    return this;
  };

  Transforms_.prototype.localRotateYTo = function(y) {
    this._reportUpdateForLocalRotation();
    this._toMatrix[14] = y;
    this._update();
    return this;
  };

  Transforms_.prototype.localRotateZTo = function(z) {
    this._reportUpdateForLocalRotation();
    this._toMatrix[15] = z;
    this._update();
    return this;
  };

  Transforms_.prototype.localRotate = function(x, y, z) {
    this._reportUpdateForLocalRotation();
    this._toMatrix[13] = this._currentMatrix[13] + x;
    this._toMatrix[14] = this._currentMatrix[14] + y;
    this._toMatrix[15] = this._currentMatrix[15] + z;
    this._update();
    return this;
  };

  Transforms_.prototype.localRotateX = function(x) {
    this._reportUpdateForLocalRotation();
    this._toMatrix[13] = this._currentMatrix[13] + x;
    this._update();
    return this;
  };

  Transforms_.prototype.localRotateY = function(y) {
    this._reportUpdateForLocalRotation();
    this._toMatrix[14] = this._currentMatrix[14] + y;
    this._update();
    return this;
  };

  Transforms_.prototype.localRotateZ = function(z) {
    this._reportUpdateForLocalRotation();
    this._toMatrix[15] = this._currentMatrix[15] + z;
    this._update();
    return this;
  };

  Transforms_.prototype.resetAll = function() {
    this.resetMovement();
    this.resetScale();
    this.resetPerspective();
    this.resetRotation();
    this.resetLocalMovement();
    return this.resetLocalRotation();
  };

  return Transforms_;

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHJhbnNmb3Jtc18uanMiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLlxcLi5cXC4uXFwuLiIsInNvdXJjZXMiOlsiY29mZmVlXFxsaWJcXGVsXFxtaXhpblxcdHJhbnNpdGlvbmVyXFxtaXhpblxcVHJhbnNmb3Jtc18uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsdUJBQUE7O0FBQUEsQ0FBQSxFQUFpQixJQUFBLE9BQWpCLEVBQWlCOztBQUVqQixDQUZBLEVBRXVCLEdBQWpCLENBQU47Q0FFQzs7Q0FBQSxFQUF1QixNQUFBLFlBQXZCO0NBRUMsRUFBYSxDQUFiLEtBQUEsRUFBYSxHQUFjO0NBQTNCLEVBRWUsQ0FBZixPQUFBLEdBQTZCO0NBRTVCLENBQW9CLENBQUgsQ0FBakIsT0FBRCxDQUFrQyxFQUFsQztDQU5ELEVBQXVCOztDQUF2QixFQVF1QixNQUFDLE1BQUQsTUFBdkI7Q0FFQyxDQUFtRCxDQUFsQixDQUFqQyxJQUFBLElBQWdFLEVBQWhFLENBQWU7Q0FWaEIsRUFRdUI7O0NBUnZCLEVBY2dDLE1BQUEscUJBQWhDO0NBRUMsRUFBa0IsQ0FBbEIsT0FBYSxHQUFxQjtDQUFsQyxFQUNrQixDQUFsQixPQUFhLEdBQXFCO0NBRGxDLEVBRWtCLENBQWxCLE9BQWEsR0FBcUI7Q0FGbEMsRUFJa0IsQ0FBbEIsT0FBYSxHQUFxQjtDQUpsQyxFQUtrQixDQUFsQixPQUFhLEdBQXFCO0NBTGxDLEVBTWtCLENBQWxCLE9BQWEsR0FBcUI7Q0FObEMsRUFRa0IsQ0FBbEIsT0FBYSxHQUFxQjtDQVJsQyxFQVVrQixDQUFsQixPQUFhLEdBQXFCO0NBVmxDLEVBV2tCLENBQWxCLE9BQWEsR0FBcUI7Q0FYbEMsRUFZa0IsQ0FBbEIsT0FBYSxHQUFxQjtDQVpsQyxDQWNhLENBQU0sQ0FBbkIsT0FBYSxHQUFzQjtDQWRuQyxDQWVhLENBQU0sQ0FBbkIsT0FBYSxHQUFzQjtDQWZuQyxDQWdCYSxDQUFNLENBQW5CLE9BQWEsR0FBc0I7Q0FoQm5DLENB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bnRlbnQiOlsiVHJhbnNmb3JtYXRpb24gPSByZXF1aXJlICdUcmFuc2Zvcm1hdGlvbidcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBUcmFuc2Zvcm1zX1xuXG5cdF9faW5pdE1peGluVHJhbnNmb3JtczogLT5cblxuXHRcdEBfdG9NYXRyaXggPSBUcmFuc2Zvcm1hdGlvbi5fZW1wdHlTdGFjaygpXG5cblx0XHRAX2Zyb21NYXRyaXggPSBUcmFuc2Zvcm1hdGlvbi5fZW1wdHlTdGFjaygpXG5cblx0XHRAX2N1cnJlbnRNYXRyaXggPSBAZWwuX3N0eWxlU2V0dGVyLl90cmFuc2Zvcm1lci5fY3VycmVudFxuXG5cdF9fY2xvbmVyRm9yVHJhbnNmb3JtczogKG5ld1RyYW5zaXRpb25lcikgLT5cblxuXHRcdG5ld1RyYW5zaXRpb25lci5fY3VycmVudE1hdHJpeCA9IG5ld1RyYW5zaXRpb25lci5lbC5fc3R5bGVTZXR0ZXIuX3RyYW5zZm9ybWVyLl9jdXJyZW50XG5cblx0XHRyZXR1cm5cblxuXHRfYWRqdXN0RnJvbVZhbHVlc0ZvclRyYW5zZm9ybXM6IC0+XG5cblx0XHRAX2Zyb21NYXRyaXhbMF0gPSBAX2N1cnJlbnRNYXRyaXhbMF1cblx0XHRAX2Zyb21NYXRyaXhbMV0gPSBAX2N1cnJlbnRNYXRyaXhbMV1cblx0XHRAX2Zyb21NYXRyaXhbMl0gPSBAX2N1cnJlbnRNYXRyaXhbMl1cblxuXHRcdEBfZnJvbU1hdHJpeFszXSA9IEBfY3VycmVudE1hdHJpeFszXVxuXHRcdEBfZnJvbU1hdHJpeFs0XSA9IEBfY3VycmVudE1hdHJpeFs0XVxuXHRcdEBfZnJvbU1hdHJpeFs1XSA9IEBfY3VycmVudE1hdHJpeFs1XVxuXG5cdFx0QF9mcm9tTWF0cml4WzZdID0gQF9jdXJyZW50TWF0cml4WzZdXG5cblx0XHRAX2Zyb21NYXRyaXhbN10gPSBAX2N1cnJlbnRNYXRyaXhbN11cblx0XHRAX2Zyb21NYXRyaXhbOF0gPSBAX2N1cnJlbnRNYXRyaXhbOF1cblx0XHRAX2Zyb21NYXRyaXhbOV0gPSBAX2N1cnJlbnRNYXRyaXhbOV1cblxuXHRcdEBfZnJvbU1hdHJpeFsxMF0gPSBAX2N1cnJlbnRNYXRyaXhbMTBdXG5cdFx0QF9mcm9tTWF0cml4WzExXSA9IEBfY3VycmVudE1hdHJpeFsxMV1cblx0XHRAX2Zyb21NYXRyaXhbMTJdID0gQF9jdXJyZW50TWF0cml4WzEyXVxuXG5cdFx0QF9mcm9tTWF0cml4WzEzXSA9IEBfY3VycmVudE1hdHJpeFsxM11cblx0XHRAX2Zyb21NYXRyaXhbMTRdID0gQF9jdXJyZW50TWF0cml4WzE0XVxuXHRcdEBfZnJvbU1hdHJpeFsxNV0gPSBAX2N1cnJlbnRNYXRyaXhbMTVdXG5cblx0XHRAXG5cblx0X2Rpc2FibGVUcmFuc2l0aW9uRm9yVHJhbnNmb3JtczogLT5cblxuXHRcdEBfbmVlZHNVcGRhdGUudHJhbnNmb3JtTW92ZW1lbnQgPSBub1xuXHRcdEBfdG9NYXRyaXhbMF0gPSBAX2N1cnJlbnRNYXRyaXhbMF1cblx0XHRAX3RvTWF0cml4WzFdID0gQF9jdXJyZW50TWF0cml4WzFdXG5cdFx0QF90b01hdHJpeFsyXSA9IEBfY3VycmVudE1hdHJpeFsyXVxuXG5cdFx0QF9uZWVkc1VwZGF0ZS50cmFuc2Zvcm1TY2FsZSA9IG5vXG5cdFx0QF90b01hdHJpeFszXSA9IEBfY3VycmVudE1hdHJpeFszXVxuXHRcdEBfdG9NYXRyaXhbNF0gPSBAX2N1cnJlbnRNYXRyaXhbNF1cblx0XHRAX3RvTWF0cml4WzVdID0gQF9jdXJyZW50TWF0cml4WzVdXG5cblx0XHRAX25lZWRzVXBkYXRlLnRyYW5zZm9ybVBlcnNwZWN0aXZlID0gbm9cblx0XHRAX3RvTWF0cml4WzZdID0gQF9jdXJyZW50TWF0cml4WzZdXG5cblx0XHRAX25lZWRzVXBkYXRlLnRyYW5zZm9ybVJvdGF0aW9uID0gbm9cblx0XHRAX3RvTWF0cml4WzddID0gQF9jdXJyZW50TWF0cml4WzddXG5cdFx0QF90b01hdHJpeFs4XSA9IEBfY3VycmVudE1hdHJpeFs4XVxuXHRcdEBfdG9NYXRyaXhbOV0gPSBAX2N1cnJlbnRNYXRyaXhbOV1cblxuXHRcdEBfbmVlZHNVcGRhdGUudHJhbnNmb3JtTG9jYWxNb3ZlbWVudCA9IG5vXG5cdFx0QF90b01hdHJpeFsxMF0gPSBAX2N1cnJlbnRNYXRyaXhbMTBdXG5cdFx0QF90b01hdHJpeFsxMV0gPSBAX2N1cnJlbnRNYXRyaXhbMTFdXG5cdFx0QF90b01hdHJpeFsxMl0gPSBAX2N1cnJlbnRNYXRyaXhbMTJdXG5cblx0XHRAX25lZWRzVXBkYXRlLnRyYW5zZm9ybUxvY2FsUm90YXRpb24gPSBub1xuXHRcdEBfdG9NYXRyaXhbMTNdID0gQF9jdXJyZW50TWF0cml4WzEzXVxuXHRcdEBfdG9NYXRyaXhbMTRdID0gQF9jdXJyZW50TWF0cml4WzE0XVxuXHRcdEBfdG9NYXRyaXhbMTVdID0gQF9jdXJyZW50TWF0cml4WzE1XVxuXG5cdFx0QFxuXG5cdF91cGRhdGVUcmFuc2l0aW9uRm9yVHJhbnNmb3JtczogKHByb2dyZXNzKSAtPlxuXG5cdFx0aWYgQF9uZWVkc1VwZGF0ZS50cmFuc2Zvcm1Nb3ZlbWVudFxuXG5cdFx0XHRAX3VwZGF0ZU1vdmVtZW50IHByb2dyZXNzXG5cblx0XHRpZiBAX25lZWRzVXBkYXRlLnRyYW5zZm9ybVJvdGF0aW9uXG5cblx0XHRcdEBfdXBkYXRlUm90YXRpb24gcHJvZ3Jlc3NcblxuXHRcdGlmIEBfbmVlZHNVcGRhdGUudHJhbnNmb3JtU2NhbGVcblxuXHRcdFx0QF91cGRhdGVTY2FsZSBwcm9ncmVzc1xuXG5cdFx0aWYgQF9uZWVkc1VwZGF0ZS50cmFuc2Zvcm1QZXJzcGVjdGl2ZVxuXG5cdFx0XHRAX3VwZGF0ZVBlcnNwZWN0aXZlIHByb2dyZXNzXG5cblx0XHRpZiBAX25lZWRzVXBkYXRlLnRyYW5zZm9ybUxvY2FsTW92ZW1lbnRcblxuXHRcdFx0QF91cGRhdGVMb2NhbE1vdmVtZW50IHByb2dyZXNzXG5cblx0XHRpZiBAX25lZWRzVXBkYXRlLnRyYW5zZm9ybUxvY2FsUm90YXRpb25cblxuXHRcdFx0QF91cGRhdGVMb2NhbFJvdGF0aW9uIHByb2dyZXNzXG5cblx0XHRyZXR1cm5cblxuXHRfdXBkYXRlTW92ZW1lbnQ6IChwcm9ncmVzcykgLT5cblxuXHRcdEBfc3R5bGVTZXR0ZXIubW92ZVRvIChcblx0XHRcdFx0QF9mcm9tTWF0cml4WzBdICtcblx0XHRcdFx0KChAX3RvTWF0cml4WzBdIC0gQF9mcm9tTWF0cml4WzBdKSAqIHByb2dyZXNzKVxuXHRcdFx0KSxcblx0XHRcdChcblx0XHRcdFx0QF9mcm9tTWF0cml4WzFdICtcblx0XHRcdFx0KChAX3RvTWF0cml4WzFdIC0gQF9mcm9tTWF0cml4WzFdKSAqIHByb2dyZXNzKVxuXHRcdFx0KSxcblx0XHRcdChcblx0XHRcdFx0QF9mcm9tTWF0cml4WzJdICtcblx0XHRcdFx0KChAX3RvTWF0cml4WzJdIC0gQF9mcm9tTWF0cml4WzJdKSAqIHByb2dyZXNzKVxuXHRcdFx0KVxuXG5cdFx0bnVsbFxuXG5cdF9yZXBvcnRVcGRhdGVGb3JNb3ZlOiAtPlxuXG5cdFx0cmV0dXJuIGlmIEBfbmVlZHNVcGRhdGUudHJhbnNmb3JtTW92ZW1lbnRcblxuXHRcdEBfbmVlZHNVcGRhdGUudHJhbnNmb3JtTW92ZW1lbnQgPSB5ZXNcblxuXHRcdEBfdG9NYXRyaXhbMF0gPSBAX2N1cnJlbnRNYXRyaXhbMF1cblx0XHRAX3RvTWF0cml4WzFdID0gQF9jdXJyZW50TWF0cml4WzFdXG5cdFx0QF90b01hdHJpeFsyXSA9IEBfY3VycmVudE1hdHJpeFsyXVxuXG5cdFx0cmV0dXJuXG5cblx0cmVzZXRNb3ZlbWVudDogLT5cblxuXHRcdGRvIEBfcmVwb3J0VXBkYXRlRm9yTW92ZVxuXG5cdFx0QF90b01hdHJpeFswXSA9IDBcblx0XHRAX3RvTWF0cml4WzFdID0gMFxuXHRcdEBfdG9NYXRyaXhbMl0gPSAwXG5cblx0XHRkbyBAX3VwZGF0ZVxuXG5cdFx0QFxuXG5cdG1vdmVUbzogKHgsIHksIHopIC0+XG5cblx0XHRkbyBAX3JlcG9ydFVwZGF0ZUZvck1vdmVcblxuXHRcdEBfdG9NYXRyaXhbMF0gPSB4XG5cdFx0QF90b01hdHJpeFsxXSA9IHlcblx0XHRAX3RvTWF0cml4WzJdID0gelxuXG5cdFx0ZG8gQF91cGRhdGVcblxuXHRcdEBcblxuXHRtb3ZlWFRvOiAoeCkgLT5cblxuXHRcdGRvIEBfcmVwb3J0VXBkYXRlRm9yTW92ZVxuXG5cdFx0QF90b01hdHJpeFswXSA9IHhcblxuXHRcdGRvIEBfdXBkYXRlXG5cblx0XHRAXG5cblx0bW92ZVlUbzogKHkpIC0+XG5cblx0XHRkbyBAX3JlcG9ydFVwZGF0ZUZvck1vdmVcblxuXHRcdEBfdG9NYXRyaXhbMV0gPSB5XG5cblx0XHRkbyBAX3VwZGF0ZVxuXG5cdFx0QFxuXG5cdG1vdmVaVG86ICh6KSAtPlxuXG5cdFx0ZG8gQF9yZXBvcnRVcGRhdGVGb3JNb3ZlXG5cblx0XHRAX3RvTWF0cml4WzJdID0gelxuXG5cdFx0ZG8gQF91cGRhdGVcblxuXHRcdEBcblxuXHRtb3ZlOiAoeCwgeSwgeikgLT5cblxuXHRcdGRvIEBfcmVwb3J0VXBkYXRlRm9yTW92ZVxuXG5cdFx0QF90b01hdHJpeFswXSA9IEBfY3VycmVudE1hdHJpeFswXSArIHhcblx0XHRAX3RvTWF0cml4WzFdID0gQF9jdXJyZW50TWF0cml4WzFdICsgeVxuXHRcdEBfdG9NYXRyaXhbMl0gPSBAX2N1cnJlbnRNYXRyaXhbMl0gKyB6XG5cblx0XHRkbyBAX3VwZGF0ZVxuXG5cdFx0QFxuXG5cdG1vdmVYOiAoeCkgLT5cblxuXHRcdGRvIEBfcmVwb3J0VXBkYXRlRm9yTW92ZVxuXG5cdFx0QF90b01hdHJpeFswXSA9IEBfY3VycmVudE1hdHJpeFswXSArIHhcblxuXHRcdGRvIEBfdXBkYXRlXG5cblx0XHRAXG5cblx0bW92ZVk6ICh5KSAtPlxuXG5cdFx0ZG8gQF9yZXBvcnRVcGRhdGVGb3JNb3ZlXG5cblx0XHRAX3RvTWF0cml4WzFdID0gQF9jdXJyZW50TWF0cml4WzFdICsgeVxuXG5cdFx0ZG8gQF91cGRhdGVcblxuXHRcdEBcblxuXHRtb3ZlWjogKHopIC0+XG5cblx0XHRkbyBAX3JlcG9ydFVwZGF0ZUZvck1vdmVcblxuXHRcdEBfdG9NYXRyaXhbMl0gPSBAX2N1cnJlbnRNYXRyaXhbMl0gKyB6XG5cblx0XHRkbyBAX3VwZGF0ZVxuXG5cdFx0QFxuXG5cdCMjI1xuXHRTY2FsZVxuXHQjIyNcblxuXHRfdXBkYXRlU2NhbGU6IChwcm9ncmVzcykgLT5cblxuXHRcdEBfc3R5bGVTZXR0ZXIuc2NhbGVUbyAoXG5cdFx0XHRcdEBfZnJvbU1hdHJpeFszXSArXG5cdFx0XHRcdCgoQF90b01hdHJpeFszXSAtIEBfZnJvbU1hdHJpeFszXSkgKiBwcm9ncmVzcylcblx0XHRcdCksXG5cdFx0XHQoXG5cdFx0XHRcdEBfZnJvbU1hdHJpeFs0XSArXG5cdFx0XHRcdCgoQF90b01hdHJpeFs0XSAtIEBfZnJvbU1hdHJpeFs0XSkgKiBwcm9ncmVzcylcblx0XHRcdCksXG5cdFx0XHQoXG5cdFx0XHRcdEBfZnJvbU1hdHJpeFs1XSArXG5cdFx0XHRcdCgoQF90b01hdHJpeFs1XSAtIEBfZnJvbU1hdHJpeFs1XSkgKiBwcm9ncmVzcylcblx0XHRcdClcblxuXHRcdG51bGxcblxuXHRfcmVwb3J0VXBkYXRlRm9yU2NhbGU6IC0+XG5cblx0XHRyZXR1cm4gaWYgQF9uZWVkc1VwZGF0ZS50cmFuc2Zvcm1TY2FsZVxuXG5cdFx0QF9uZWVkc1VwZGF0ZS50cmFuc2Zvcm1TY2FsZSA9IHllc1xuXG5cdFx0QF90b01hdHJpeFszXSA9IEBfY3VycmVudE1hdHJpeFszXVxuXHRcdEBfdG9NYXRyaXhbNF0gPSBAX2N1cnJlbnRNYXRyaXhbNF1cblx0XHRAX3RvTWF0cml4WzVdID0gQF9jdXJyZW50TWF0cml4WzVdXG5cblx0XHRyZXR1cm5cblxuXHRyZXNldFNjYWxlOiAtPlxuXG5cdFx0ZG8gQF9yZXBvcnRVcGRhdGVGb3JTY2FsZVxuXG5cdFx0QF90b01hdHJpeFszXSA9IDFcblx0XHRAX3RvTWF0cml4WzRdID0gMVxuXHRcdEBfdG9NYXRyaXhbNV0gPSAxXG5cblx0XHRkbyBAX3VwZGF0ZVxuXG5cdFx0QFxuXG5cdHNjYWxlVG86ICh4LCB5LCB6KSAtPlxuXG5cdFx0ZG8gQF9yZXBvcnRVcGRhdGVGb3JTY2FsZVxuXG5cdFx0QF90b01hdHJpeFszXSA9IHhcblx0XHRAX3RvTWF0cml4WzRdID0geVxuXHRcdEBfdG9NYXRyaXhbNV0gPSB6XG5cblx0XHRkbyBAX3VwZGF0ZVxuXG5cdFx0QFxuXG5cdHNjYWxlWFRvOiAoeCkgLT5cblxuXHRcdGRvIEBfcmVwb3J0VXBkYXRlRm9yU2NhbGVcblxuXHRcdEBfdG9NYXRyaXhbM10gPSB4XG5cblx0XHRkbyBAX3VwZGF0ZVxuXG5cdFx0QFxuXG5cdHNjYWxlWVRvOiAoeSkgLT5cblxuXHRcdGRvIEBfcmVwb3J0VXBkYXRlRm9yU2NhbGVcblxuXHRcdEBfdG9NYXRyaXhbNF0gPSB5XG5cblx0XHRkbyBAX3VwZGF0ZVxuXG5cdFx0QFxuXG5cdHNjYWxlWlRvOiAoeikgLT5cblxuXHRcdGRvIEBfcmVwb3J0VXBkYXRlRm9yU2NhbGVcblxuXHRcdEBfdG9NYXRyaXhbNV0gPSB6XG5cblx0XHRkbyBAX3VwZGF0ZVxuXG5cdFx0QFxuXG5cdHNjYWxlOiAoeCwgeSwgeikgLT5cblxuXHRcdGRvIEBfcmVwb3J0VXBkYXRlRm9yU2NhbGVcblxuXHRcdEBfdG9NYXRyaXhbM10gPSBAX2N1cnJlbnRNYXRyaXhbM10gKiB4XG5cdFx0QF90b01hdHJpeFs0XSA9IEBfY3VycmVudE1hdHJpeFs0XSAqIHlcblx0XHRAX3RvTWF0cml4WzVdID0gQF9jdXJyZW50TWF0cml4WzVdICogelxuXG5cdFx0ZG8gQF91cGRhdGVcblxuXHRcdEBcblxuXHRzY2FsZUFsbFRvOiAoeCkgLT5cblxuXHRcdGRvIEBfcmVwb3J0VXBkYXRlRm9yU2NhbGVcblxuXHRcdEBfdG9NYXRyaXhbM10gPSBAX3RvTWF0cml4WzRdID0gQF90b01hdHJpeFs1XSA9IHhcblxuXHRcdGRvIEBfdXBkYXRlXG5cblx0XHRAXG5cblx0c2NhbGVYOiAoeCkgLT5cblxuXHRcdGRvIEBfcmVwb3J0VXBkYXRlRm9yU2NhbGVcblxuXHRcdEBfdG9NYXRyaXhbM10gPSBAX2N1cnJlbnRNYXRyaXhbM10gKiB4XG5cblx0XHRkbyBAX3VwZGF0ZVxuXG5cdFx0QFxuXG5cdHNjYWxlWTogKHkpIC0+XG5cblx0XHRkbyBAX3JlcG9ydFVwZGF0ZUZvclNjYWxlXG5cblx0XHRAX3RvTWF0cml4WzRdID0gQF9jdXJyZW50TWF0cml4WzRdICogeVxuXG5cdFx0ZG8gQF91cGRhdGVcblxuXHRcdEBcblxuXHRzY2FsZVo6ICh6KSAtPlxuXG5cdFx0ZG8gQF9yZXBvcnRVcGRhdGVGb3JTY2FsZVxuXG5cdFx0QF90b01hdHJpeFs1XSA9IEBfY3VycmVudE1hdHJpeFs1XSAqIHpcblxuXHRcdGRvIEBfdXBkYXRlXG5cblx0XHRAXG5cblx0X3JlcG9ydFVwZGF0ZUZvclBlcnNwZWN0aXZlOiAtPlxuXG5cdFx0cmV0dXJuIGlmIEBfbmVlZHNVcGRhdGUudHJhbnNmb3JtUGVyc3BlY3RpdmVcblxuXHRcdEBfbmVlZHNVcGRhdGUudHJhbnNmb3JtUGVyc3BlY3RpdmUgPSB5ZXNcblxuXHRcdEBfdG9NYXRyaXhbNl0gPSBAX2N1cnJlbnRNYXRyaXhbNl1cblxuXHRcdHJldHVyblxuXG5cdCMjI1xuXHRQZXJzcGVjdGl2ZVxuXHQjIyNcblxuXHRfdXBkYXRlUGVyc3BlY3RpdmU6IChwcm9ncmVzcykgLT5cblxuXHRcdEBfc3R5bGVTZXR0ZXIucGVyc3BlY3RpdmUgKFxuXHRcdFx0XHRAX2Zyb21NYXRyaXhbNl0gK1xuXHRcdFx0XHQoKEBfdG9NYXRyaXhbNl0gLSBAX2Zyb21NYXRyaXhbNl0pICogcHJvZ3Jlc3MpXG5cdFx0XHQpXG5cblx0XHRudWxsXG5cblx0cmVzZXRQZXJzcGVjdGl2ZTogLT5cblxuXHRcdGRvIEBfcmVwb3J0VXBkYXRlRm9yUGVyc3BlY3RpdmVcblxuXHRcdEBfdG9NYXRyaXhbNl0gPSAwXG5cblx0XHRkbyBAX3VwZGF0ZVxuXG5cdFx0QFxuXG5cdHBlcnNwZWN0aXZlOiAoZCkgLT5cblxuXHRcdGRvIEBfcmVwb3J0VXBkYXRlRm9yUGVyc3BlY3RpdmVcblxuXHRcdEBfdG9NYXRyaXhbNl0gPSBkXG5cblx0XHRkbyBAX3VwZGF0ZVxuXG5cdFx0QFxuXG5cdCMjI1xuXHRSb3RhdGlvblxuXHQjIyNcblxuXHRfdXBkYXRlUm90YXRpb246IChwcm9ncmVzcykgLT5cblxuXHRcdEBfc3R5bGVTZXR0ZXIucm90YXRlVG8gKFxuXHRcdFx0XHRAX2Zyb21NYXRyaXhbN10gK1xuXHRcdFx0XHQoKEBfdG9NYXRyaXhbN10gLSBAX2Zyb21NYXRyaXhbN10pICogcHJvZ3Jlc3MpXG5cdFx0XHQpLFxuXHRcdFx0KFxuXHRcdFx0XHRAX2Zyb21NYXRyaXhbOF0gK1xuXHRcdFx0XHQoKEBfdG9NYXRyaXhbOF0gLSBAX2Zyb21NYXRyaXhbOF0pICogcHJvZ3Jlc3MpXG5cdFx0XHQpLFxuXHRcdFx0KFxuXHRcdFx0XHRAX2Zyb21NYXRyaXhbOV0gK1xuXHRcdFx0XHQoKEBfdG9NYXRyaXhbOV0gLSBAX2Zyb21NYXRyaXhbOV0pICogcHJvZ3Jlc3MpXG5cdFx0XHQpXG5cblx0XHRudWxsXG5cblx0X3JlcG9ydFVwZGF0ZUZvclJvdGF0aW9uOiAtPlxuXG5cdFx0cmV0dXJuIGlmIEBfbmVlZHNVcGRhdGUudHJhbnNmb3JtUm90YXRpb25cblxuXHRcdEBfbmVlZHNVcGRhdGUudHJhbnNmb3JtUm90YXRpb24gPSB5ZXNcblxuXHRcdEBfdG9NYXRyaXhbN10gPSBAX2N1cnJlbnRNYXRyaXhbN11cblx0XHRAX3RvTWF0cml4WzhdID0gQF9jdXJyZW50TWF0cml4WzhdXG5cdFx0QF90b01hdHJpeFs5XSA9IEBfY3VycmVudE1hdHJpeFs5XVxuXG5cdFx0cmV0dXJuXG5cblx0cmVzZXRSb3RhdGlvbjogLT5cblxuXHRcdGRvIEBfcmVwb3J0VXBkYXRlRm9yUm90YXRpb25cblxuXHRcdEBfdG9NYXRyaXhbN10gPSAwXG5cdFx0QF90b01hdHJpeFs4XSA9IDBcblx0XHRAX3RvTWF0cml4WzldID0gMFxuXG5cdFx0ZG8gQF91cGRhdGVcblxuXHRcdEBcblxuXHRyb3RhdGVUbzogKHgsIHksIHopIC0+XG5cblx0XHRkbyBAX3JlcG9ydFVwZGF0ZUZvclJvdGF0aW9uXG5cblx0XHRAX3RvTWF0cml4WzddID0geFxuXHRcdEBfdG9NYXRyaXhbOF0gPSB5XG5cdFx0QF90b01hdHJpeFs5XSA9IHpcblxuXHRcdGRvIEBfdXBkYXRlXG5cblx0XHRAXG5cblx0cm90YXRlWFRvOiAoeCkgLT5cblxuXHRcdGRvIEBfcmVwb3J0VXBkYXRlRm9yUm90YXRpb25cblxuXHRcdEBfdG9NYXRyaXhbN10gPSB4XG5cblx0XHRkbyBAX3VwZGF0ZVxuXG5cdFx0QFxuXG5cdHJvdGF0ZVlUbzogKHkpIC0+XG5cblx0XHRkbyBAX3JlcG9ydFVwZGF0ZUZvclJvdGF0aW9uXG5cblx0XHRAX3RvTWF0cml4WzhdID0geVxuXG5cdFx0ZG8gQF91cGRhdGVcblxuXHRcdEBcblxuXHRyb3RhdGVaVG86ICh6KSAtPlxuXG5cdFx0ZG8gQF9yZXBvcnRVcGRhdGVGb3JSb3RhdGlvblxuXG5cdFx0QF90b01hdHJpeFs5XSA9IHpcblxuXHRcdGRvIEBfdXBkYXRlXG5cblx0XHRAXG5cblx0cm90YXRlOiAoeCwgeSwgeikgLT5cblxuXHRcdGRvIEBfcmVwb3J0VXBkYXRlRm9yUm90YXRpb25cblxuXHRcdEBfdG9NYXRyaXhbN10gPSBAX2N1cnJlbnRNYXRyaXhbN10gKyB4XG5cdFx0QF90b01hdHJpeFs4XSA9IEBfY3VycmVudE1hdHJpeFs4XSArIHlcblx0XHRAX3RvTWF0cml4WzldID0gQF9jdXJyZW50TWF0cml4WzldICsgelxuXG5cdFx0ZG8gQF91cGRhdGVcblxuXHRcdEBcblxuXHRyb3RhdGVYOiAoeCkgLT5cblxuXHRcdGRvIEBfcmVwb3J0VXBkYXRlRm9yUm90YXRpb25cblxuXHRcdEBfdG9NYXRyaXhbN10gPSBAX2N1cnJlbnRNYXRyaXhbN10gKyB4XG5cblx0XHRkbyBAX3VwZGF0ZVxuXG5cdFx0QFxuXG5cdHJvdGF0ZVk6ICh5KSAtPlxuXG5cdFx0ZG8gQF9yZXBvcnRVcGRhdGVGb3JSb3RhdGlvblxuXG5cdFx0QF90b01hdHJpeFs4XSA9IEBfY3VycmVudE1hdHJpeFs4XSArIHlcblxuXHRcdGRvIEBfdXBkYXRlXG5cblx0XHRAXG5cblx0cm90YXRlWjogKHopIC0+XG5cblx0XHRkbyBAX3JlcG9ydFVwZGF0ZUZvclJvdGF0aW9uXG5cblx0XHRAX3RvTWF0cml4WzldID0gQF9jdXJyZW50TWF0cml4WzldICsgelxuXG5cdFx0ZG8gQF91cGRhdGVcblxuXHRcdEBcblxuXHQjIyNcblx0TG9jYWxNb3ZlbWVudFxuXHQjIyNcblxuXHRfdXBkYXRlTG9jYWxNb3ZlbWVudDogKHByb2dyZXNzKSAtPlxuXG5cdFx0QF9zdHlsZVNldHRlci5sb2NhbE1vdmVUbyAoXG5cdFx0XHRcdEBfZnJvbU1hdHJpeFsxMF0gK1xuXHRcdFx0XHQoKEBfdG9NYXRyaXhbMTBdIC0gQF9mcm9tTWF0cml4WzEwXSkgKiBwcm9ncmVzcylcblx0XHRcdCksXG5cdFx0XHQoXG5cdFx0XHRcdEBfZnJvbU1hdHJpeFsxMV0gK1xuXHRcdFx0XHQoKEBfdG9NYXRyaXhbMTFdIC0gQF9mcm9tTWF0cml4WzExXSkgKiBwcm9ncmVzcylcblx0XHRcdCksXG5cdFx0XHQoXG5cdFx0XHRcdEBfZnJvbU1hdHJpeFsxMl0gK1xuXHRcdFx0XHQoKEBfdG9NYXRyaXhbMTJdIC0gQF9mcm9tTWF0cml4WzEyXSkgKiBwcm9ncmVzcylcblx0XHRcdClcblxuXHRcdG51bGxcblxuXHRfcmVwb3J0VXBkYXRlRm9yTG9jYWxNb3ZlbWVudDogLT5cblxuXHRcdHJldHVybiBpZiBAX25lZWRzVXBkYXRlLnRyYW5zZm9ybUxvY2FsTW92ZW1lbnRcblxuXHRcdEBfbmVlZHNVcGRhdGUudHJhbnNmb3JtTG9jYWxNb3ZlbWVudCA9IHllc1xuXG5cdFx0QF90b01hdHJpeFsxMF0gPSBAX2N1cnJlbnRNYXRyaXhbMTBdXG5cdFx0QF90b01hdHJpeFsxMV0gPSBAX2N1cnJlbnRNYXRyaXhbMTFdXG5cdFx0QF90b01hdHJpeFsxMl0gPSBAX2N1cnJlbnRNYXRyaXhbMTJdXG5cblx0XHRyZXR1cm5cblxuXHRyZXNldExvY2FsTW92ZW1lbnQ6IC0+XG5cblx0XHRkbyBAX3JlcG9ydFVwZGF0ZUZvckxvY2FsTW92ZW1lbnRcblxuXHRcdEBfdG9NYXRyaXhbMTBdID0gMFxuXHRcdEBfdG9NYXRyaXhbMTFdID0gMFxuXHRcdEBfdG9NYXRyaXhbMTJdID0gMFxuXG5cdFx0ZG8gQF91cGRhdGVcblxuXHRcdEBcblxuXHRsb2NhbE1vdmVUbzogKHgsIHksIHopIC0+XG5cblx0XHRkbyBAX3JlcG9ydFVwZGF0ZUZvckxvY2FsTW92ZW1lbnRcblxuXHRcdEBfdG9NYXRyaXhbMTBdID0geFxuXHRcdEBfdG9NYXRyaXhbMTFdID0geVxuXHRcdEBfdG9NYXRyaXhbMTJdID0gelxuXG5cdFx0ZG8gQF91cGRhdGVcblxuXHRcdEBcblxuXHRsb2NhbE1vdmVYVG86ICh4KSAtPlxuXG5cdFx0ZG8gQF9yZXBvcnRVcGRhdGVGb3JMb2NhbE1vdmVtZW50XG5cblx0XHRAX3RvTWF0cml4WzEwXSA9IHhcblxuXHRcdGRvIEBfdXBkYXRlXG5cblx0XHRAXG5cblx0bG9jYWxNb3ZlWVRvOiAoeSkgLT5cblxuXHRcdGRvIEBfcmVwb3J0VXBkYXRlRm9yTG9jYWxNb3ZlbWVudFxuXG5cdFx0QF90b01hdHJpeFsxMV0gPSB5XG5cblx0XHRkbyBAX3VwZGF0ZVxuXG5cdFx0QFxuXG5cdGxvY2FsTW92ZVpUbzogKHopIC0+XG5cblx0XHRkbyBAX3JlcG9ydFVwZGF0ZUZvckxvY2FsTW92ZW1lbnRcblxuXHRcdEBfdG9NYXRyaXhbMTJdID0gelxuXG5cdFx0ZG8gQF91cGRhdGVcblxuXHRcdEBcblxuXHRsb2NhbE1vdmU6ICh4LCB5LCB6KSAtPlxuXG5cdFx0ZG8gQF9yZXBvcnRVcGRhdGVGb3JMb2NhbE1vdmVtZW50XG5cblx0XHRAX3RvTWF0cml4WzEwXSA9IEBfY3VycmVudE1hdHJpeFsxMF0gKyB4XG5cdFx0QF90b01hdHJpeFsxMV0gPSBAX2N1cnJlbnRNYXRyaXhbMTFdICsgeVxuXHRcdEBfdG9NYXRyaXhbMTJdID0gQF9jdXJyZW50TWF0cml4WzEyXSArIHpcblxuXHRcdGRvIEBfdXBkYXRlXG5cblx0XHRAXG5cblx0bG9jYWxNb3ZlWDogKHgpIC0+XG5cblx0XHRkbyBAX3JlcG9ydFVwZGF0ZUZvckxvY2FsTW92ZW1lbnRcblxuXHRcdEBfdG9NYXRyaXhbMTBdID0gQF9jdXJyZW50TWF0cml4WzEwXSArIHhcblxuXHRcdGRvIEBfdXBkYXRlXG5cblx0XHRAXG5cblx0bG9jYWxNb3ZlWTogKHkpIC0+XG5cblx0XHRkbyBAX3JlcG9ydFVwZGF0ZUZvckxvY2FsTW92ZW1lbnRcblxuXHRcdEBfdG9NYXRyaXhbMTFdID0gQF9jdXJyZW50TWF0cml4WzExXSArIHlcblxuXHRcdGRvIEBfdXBkYXRlXG5cblx0XHRAXG5cblx0bG9jYWxNb3ZlWjogKHopIC0+XG5cblx0XHRkbyBAX3JlcG9ydFVwZGF0ZUZvckxvY2FsTW92ZW1lbnRcblxuXHRcdEBfdG9NYXRyaXhbMTJdID0gQF9jdXJyZW50TWF0cml4WzEyXSArIHpcblxuXHRcdGRvIEBfdXBkYXRlXG5cblx0XHRAXG5cblx0IyMjXG5cdFJvdGF0aW9uXG5cdCMjI1xuXG5cdF91cGRhdGVMb2NhbFJvdGF0aW9uOiAocHJvZ3Jlc3MpIC0+XG5cblx0XHRAX3N0eWxlU2V0dGVyLmxvY2FsUm90YXRlVG8gKFxuXHRcdFx0XHRAX2Zyb21NYXRyaXhbMTNdICtcblx0XHRcdFx0KChAX3RvTWF0cml4WzEzXSAtIEBfZnJvbU1hdHJpeFsxM10pICogcHJvZ3Jlc3MpXG5cdFx0XHQpLFxuXHRcdFx0KFxuXHRcdFx0XHRAX2Zyb21NYXRyaXhbMTRdICtcblx0XHRcdFx0KChAX3RvTWF0cml4WzE0XSAtIEBfZnJvbU1hdHJpeFsxNF0pICogcHJvZ3Jlc3MpXG5cdFx0XHQpLFxuXHRcdFx0KFxuXHRcdFx0XHRAX2Zyb21NYXRyaXhbMTVdICtcblx0XHRcdFx0KChAX3RvTWF0cml4WzE1XSAtIEBfZnJvbU1hdHJpeFsxNV0pICogcHJvZ3Jlc3MpXG5cdFx0XHQpXG5cblx0XHRudWxsXG5cblx0X3JlcG9ydFVwZGF0ZUZvckxvY2FsUm90YXRpb246IC0+XG5cblx0XHRyZXR1cm4gaWYgQF9uZWVkc1VwZGF0ZS50cmFuc2Zvcm1Mb2NhbFJvdGF0aW9uXG5cblx0XHRAX25lZWRzVXBkYXRlLnRyYW5zZm9ybUxvY2FsUm90YXRpb24gPSB5ZXNcblxuXHRcdEBfdG9NYXRyaXhbMTNdID0gQF9jdXJyZW50TWF0cml4WzEzXVxuXHRcdEBfdG9NYXRyaXhbMTRdID0gQF9jdXJyZW50TWF0cml4WzE0XVxuXHRcdEBfdG9NYXRyaXhbMTVdID0gQF9jdXJyZW50TWF0cml4WzE1XVxuXG5cdFx0cmV0dXJuXG5cblx0cmVzZXRMb2NhbFJvdGF0aW9uOiAtPlxuXG5cdFx0ZG8gQF9yZXBvcnRVcGRhdGVGb3JMb2NhbFJvdGF0aW9uXG5cblx0XHRAX3RvTWF0cml4WzEzXSA9IDBcblx0XHRAX3RvTWF0cml4WzE0XSA9IDBcblx0XHRAX3RvTWF0cml4WzE1XSA9IDBcblxuXHRcdGRvIEBfdXBkYXRlXG5cblx0XHRAXG5cblx0bG9jYWxSb3RhdGVUbzogKHgsIHksIHopIC0+XG5cblx0XHRkbyBAX3JlcG9ydFVwZGF0ZUZvckxvY2FsUm90YXRpb25cblxuXHRcdEBfdG9NYXRyaXhbMTNdID0geFxuXHRcdEBfdG9NYXRyaXhbMTRdID0geVxuXHRcdEBfdG9NYXRyaXhbMTVdID0gelxuXG5cdFx0ZG8gQF91cGRhdGVcblxuXHRcdEBcblxuXHRsb2NhbFJvdGF0ZVhUbzogKHgpIC0+XG5cblx0XHRkbyBAX3JlcG9ydFVwZGF0ZUZvckxvY2FsUm90YXRpb25cblxuXHRcdEBfdG9NYXRyaXhbMTNdID0geFxuXG5cdFx0ZG8gQF91cGRhdGVcblxuXHRcdEBcblxuXHRsb2NhbFJvdGF0ZVlUbzogKHkpIC0+XG5cblx0XHRkbyBAX3JlcG9ydFVwZGF0ZUZvckxvY2FsUm90YXRpb25cblxuXHRcdEBfdG9NYXRyaXhbMTRdID0geVxuXG5cdFx0ZG8gQF91cGRhdGVcblxuXHRcdEBcblxuXHRsb2NhbFJvdGF0ZVpUbzogKHopIC0+XG5cblx0XHRkbyBAX3JlcG9ydFVwZGF0ZUZvckxvY2FsUm90YXRpb25cblxuXHRcdEBfdG9NYXRyaXhbMTVdID0gelxuXG5cdFx0ZG8gQF91cGRhdGVcblxuXHRcdEBcblxuXHRsb2NhbFJvdGF0ZTogKHgsIHksIHopIC0+XG5cblx0XHRkbyBAX3JlcG9ydFVwZGF0ZUZvckxvY2FsUm90YXRpb25cblxuXHRcdEBfdG9NYXRyaXhbMTNdID0gQF9jdXJyZW50TWF0cml4WzEzXSArIHhcblx0XHRAX3RvTWF0cml4WzE0XSA9IEBfY3VycmVudE1hdHJpeFsxNF0gKyB5XG5cdFx0QF90b01hdHJpeFsxNV0gPSBAX2N1cnJlbnRNYXRyaXhbMTVdICsgelxuXG5cdFx0ZG8gQF91cGRhdGVcblxuXHRcdEBcblxuXHRsb2NhbFJvdGF0ZVg6ICh4KSAtPlxuXG5cdFx0ZG8gQF9yZXBvcnRVcGRhdGVGb3JMb2NhbFJvdGF0aW9uXG5cblx0XHRAX3RvTWF0cml4WzEzXSA9IEBfY3VycmVudE1hdHJpeFsxM10gKyB4XG5cblx0XHRkbyBAX3VwZGF0ZVxuXG5cdFx0QFxuXG5cdGxvY2FsUm90YXRlWTogKHkpIC0+XG5cblx0XHRkbyBAX3JlcG9ydFVwZGF0ZUZvckxvY2FsUm90YXRpb25cblxuXHRcdEBfdG9NYXRyaXhbMTRdID0gQF9jdXJyZW50TWF0cml4WzE0XSArIHlcblxuXHRcdGRvIEBfdXBkYXRlXG5cblx0XHRAXG5cblx0bG9jYWxSb3RhdGVaOiAoeikgLT5cblxuXHRcdGRvIEBfcmVwb3J0VXBkYXRlRm9yTG9jYWxSb3RhdGlvblxuXG5cdFx0QF90b01hdHJpeFsxNV0gPSBAX2N1cnJlbnRNYXRyaXhbMTVdICsgelxuXG5cdFx0ZG8gQF91cGRhdGVcblxuXHRcdEBcblxuXHRyZXNldEFsbDogLT5cblxuXHRcdGRvIEByZXNldE1vdmVtZW50XG5cdFx0ZG8gQHJlc2V0U2NhbGVcblx0XHRkbyBAcmVzZXRQZXJzcGVjdGl2ZVxuXHRcdGRvIEByZXNldFJvdGF0aW9uXG5cdFx0ZG8gQHJlc2V0TG9jYWxNb3ZlbWVudFxuXHRcdGRvIEByZXNldExvY2FsUm90YXRpb24iXX0=
},{"Transformation":1}],41:[function(require,module,exports){
var Timing, timing;

Timing = require('raf-timing');

timing = new Timing;

timing.start();

module.exports = timing;

},{"raf-timing":9}],42:[function(require,module,exports){
var css, cssPropertySetter, getCSSProp, getPossiblePropsFor;

getCSSProp = (function() {
  var el, p;
  p = null;
  el = document.createElement('div');
  return function(possibleProps) {
    var prop, _i, _len;
    for (_i = 0, _len = possibleProps.length; _i < _len; _i++) {
      prop = possibleProps[_i];
      if (el.style[prop] !== void 0) {
        return prop;
      }
    }
    return false;
  };
})();

cssPropertySetter = function(prop) {
  var actualProp;
  actualProp = getCSSProp(getPossiblePropsFor(prop));
  if (!actualProp) {
    return (function() {});
  }
  return function(el, v) {
    return el.style[actualProp] = v;
  };
};

getPossiblePropsFor = function(prop) {
  return ['webkit' + prop[0].toUpperCase() + prop.substr(1, prop.length), 'moz' + prop[0].toUpperCase() + prop.substr(1, prop.length), prop];
};

module.exports = css = {
  setTransform: cssPropertySetter('transform'),
  setTransformStyle: cssPropertySetter('transformStyle'),
  setTransformOrigin: cssPropertySetter('transformOrigin'),
  setCssFilter: cssPropertySetter('filter'),
  setTransitionDuration: cssPropertySetter('transitionDuration'),
  setTransitionTimingFunction: cssPropertySetter('transitionTimingFunction'),
  rgb: function(r, g, b) {
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
  }
};

},{}],43:[function(require,module,exports){
var CSSColor;

module.exports = CSSColor = (function() {
  function CSSColor(h, s, l) {
    this.h = h;
    this.s = s;
    this.l = l;
  }

  CSSColor.prototype.setHue = function(deg) {
    this.h = deg / 360;
    return this;
  };

  CSSColor.prototype.rotateHue = function(deg) {
    deg /= 360;
    this.h = this.h + deg;
    return this;
  };

  CSSColor.prototype.setSaturation = function(amount) {
    this.s = amount / 100;
    return this;
  };

  CSSColor.prototype.saturate = function(amount) {
    this.s += amount / 100;
    return this;
  };

  CSSColor.prototype.setLightness = function(amount) {
    this.l = amount / 100;
    return this;
  };

  CSSColor.prototype.lighten = function(amount) {
    this.l += amount / 100;
    return this;
  };

  CSSColor.prototype.toCss = function() {
    var h, l, s;
    h = Math.round(this.h * 360);
    s = Math.round(this.s * 100);
    l = Math.round(this.l * 100);
    return "hsl(" + h + ", " + s + "%, " + l + "%)";
  };

  CSSColor.prototype.fromHsl = function(h, s, l) {
    this.h = h / 360;
    this.s = s / 100;
    this.l = l / 100;
    return this;
  };

  CSSColor.prototype.toRgb = function() {
    var b, g, p, q, r;
    r = 0;
    g = 0;
    b = 0;
    if (this.s === 0) {
      r = g = b = this.l;
    } else {
      q = (this.l < 0.5 ? this.l * (1 + this.s) : this.l + this.s - this.l * this.s);
      p = 2 * this.l - q;
      r = CSSColor._hue2rgb(p, q, this.h + 1 / 3);
      g = CSSColor._hue2rgb(p, q, this.h);
      b = CSSColor._hue2rgb(p, q, this.h - 1 / 3);
    }
    return [r * 255, g * 255, b * 255];
  };

  CSSColor.prototype.fromRgb = function(r, g, b) {
    var d, h, l, max, min, s;
    r /= 255;
    g /= 255;
    b /= 255;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    h = 0;
    s = 0;
    l = (max + min) / 2;
    if (max !== min) {
      d = max - min;
      s = (l > 0.5 ? d / (2 - max - min) : d / (max + min));
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
      }
      h /= 6;
    }
    this.h = h;
    this.s = s;
    this.l = l;
    return this;
  };

  CSSColor.prototype.clone = function() {
    return new CSSColor(this.h, this.s, this.l);
  };

  CSSColor.hsl = function(h, s, l) {
    return new CSSColor(h, s, l);
  };

  CSSColor.rgb = function(r, g, b) {
    var d, h, l, max, min, s;
    r /= 255;
    g /= 255;
    b /= 255;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    h = 0;
    s = 0;
    l = (max + min) / 2;
    if (max !== min) {
      d = max - min;
      s = (l > 0.5 ? d / (2 - max - min) : d / (max + min));
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
      }
      h /= 6;
    }
    return new CSSColor(h, s, l);
  };

  CSSColor._hue2rgb = function(p, q, t) {
    if (t < 0) {
      t += 1;
    }
    if (t > 1) {
      t -= 1;
    }
    if (t < 1 / 6) {
      return p + (q - p) * 6 * t;
    }
    if (t < 1 / 2) {
      return q;
    }
    if (t < 2 / 3) {
      return p + (q - p) * (2 / 3 - t) * 6;
    }
    return p;
  };

  return CSSColor;

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29sb3IuanMiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLlxcLi4iLCJzb3VyY2VzIjpbImNvZmZlZVxcbGliXFx1dGlsaXR5XFxjc3NcXENvbG9yLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQSxJQUFBLElBQUE7O0FBQUEsQ0FBQSxFQUF1QixHQUFqQixDQUFOO0NBRWMsQ0FBQSxDQUFBLGVBQUM7Q0FFYixFQUFLLENBQUw7Q0FBQSxFQUNLLENBQUw7Q0FEQSxFQUVLLENBQUw7Q0FKRCxFQUFhOztDQUFiLEVBTVEsR0FBUixHQUFTO0NBRVIsRUFBSyxDQUFMO0NBRk8sVUFJUDtDQVZELEVBTVE7O0NBTlIsRUFZVyxNQUFYO0NBRUMsRUFBQSxDQUFBO0NBQUEsRUFFSyxDQUFMO0NBSlUsVUFNVjtDQWxCRCxFQVlXOztDQVpYLEVBb0JlLEdBQUEsR0FBQyxJQUFoQjtDQUVDLEVBQUssQ0FBTCxFQUFLO0NBRlMsVUFJZDtDQXhCRCxFQW9CZTs7Q0FwQmYsRUEwQlUsR0FBQSxFQUFWLENBQVc7Q0FFVixFQUFlLENBQWYsRUFBTTtDQUZHLFVBSVQ7Q0E5QkQsRUEwQlU7O0NBMUJWLEVBZ0NjLEdBQUEsR0FBQyxHQUFmO0NBRUMsRUFBSyxDQUFMLEVBQUs7Q0FGUSxVQUliO0NBcENELEVBZ0NjOztDQWhDZCxFQXNDUyxHQUFBLENBQVQsRUFBVTtDQUVULEVBQWUsQ0FBZixFQUFNO0NBRkUsVUFJUjtDQTFDRCxFQXNDUzs7Q0F0Q1QsRUE0Q08sRUFBUCxJQUFPO0NBRU4sTUFBQSxDQUFBO0NBQUEsRUFBSSxDQUFKLENBQUk7Q0FBSixFQUNJLENBQUosQ0FBSTtDQURKLEVBRUksQ0FBSixDQUFJO0NBRUgsRUFBSyxDQUFMLENBQUEsQ0FBQSxLQUFBO0NBbERGLEVBNENPOztDQTVDUCxDQW9EYSxDQUFKLElBQVQsRUFBVTtDQUVULEVBQUssQ0FBTDtDQUFBLEVBQ0ssQ0FBTDtDQURBLEVBRUssQ0FBTDtDQUpRLFVBTVI7Q0ExREQsRUFvRFM7O0NBcERULEVBNERPLEVBQVAsSUFBTztDQUVOLE9BQUEsS0FBQTtDQUFBLEVBQUksQ0FBSjtDQUFBLEVBQ0ksQ0FBSjtDQURBLEVBRUksQ0FBSjtDQUVBLEdBQUEsQ0FBUztDQUVSLEVBQUksQ0FBUyxFQUFiO01BRkQ7Q0FNQyxFQUFJLENBQUssRUFBVDtDQUFBLEVBRUksQ0FBSyxFQUFUO0NBRkEsQ0FJeUIsQ0FBckIsQ0FBeUIsRUFBN0IsRUFBWTtDQUpaLENBTXlCLENBQXJCLENBQXlCLEVBQTdCLEVBQVk7Q0FOWixDQVF5QixDQUFyQixDQUF5QixFQUE3QixFQUFZO01BbEJiO0NBb0JDLENBQVMsQ0FBTCxRQUFMO0NBbEZELEVBNERPOztDQTVEUCxDQW9GYSxDQUFKLElBQVQsRUFBVTtDQUVULE9BQUEsWUFBQTtDQUFBLEVBQUEsQ0FBQTtDQUFBLEVBQUEsQ0FDQTtDQURBLEVBQUEsQ0FFQTtDQUZBLENBSWtCLENBQWxCLENBQUE7Q0FKQSxDQUtrQixDQUFsQixDQUFBO0NBTEEsRUFPSSxDQUFKO0NBUEEsRUFRSSxDQUFKO0NBUkEsRUFVSSxDQUFKO0NBRUEsRUFBTyxDQUFQLENBQWM7Q0FFYixFQUFJLEdBQUo7Q0FBQSxFQUVJLEdBQUo7Q0FFQSxFQUFBLFdBQU87Q0FBUCxZQUVNO0NBRUosRUFBSSxPQUFKO0NBRkk7Q0FGTixZQU1NO0NBRUosRUFBSSxPQUFKO0NBRkk7Q0FOTixZQVVNO0NBRUosRUFBSSxPQUFKO0NBWkYsTUFKQTtDQUFBLEdBa0JLLEVBQUw7TUFoQ0Q7Q0FBQSxFQWtDSyxDQUFMO0NBbENBLEVBbUNLLENBQUw7Q0FuQ0EsRUFvQ0ssQ0FBTDtDQXRDUSxVQXdDUjtDQTVIRCxFQW9GUzs7Q0FwRlQsRUE4SE8sRUFBUCxJQUFPO0NBRU8sQ0FBSSxFQUFiLElBQUEsR0FBQTtDQWhJTCxFQThITzs7Q0E5SFAsQ0FrSUEsQ0FBQSxLQUFDLENBQU07Q0FFTyxDQUFHLEVBQVosSUFBQSxHQUFBO0NBcElMLEVBa0lNOztDQWxJTixDQXNJQSxDQUFBLEtBQUMsQ0FBTTtDQUVOLE9BQUEsWUFBQTtDQUFBLEVBQUEsQ0FBQTtDQUFBLEVBQUEsQ0FDQTtDQURBLEVBQUEsQ0FFQTtDQUZBLENBSWtCLENBQWxCLENBQUE7Q0FKQSxDQUtrQixDQUFsQixDQUFBO0NBTEEsRUFPSSxDQUFKO0NBUEEsRUFRSSxDQUFKO0NBUkEsRUFVSSxDQUFKO0NBRUEsRUFBTyxDQUFQLENBQWM7Q0FFYixFQUFJLEdBQUo7Q0FBQSxFQUVJLEdBQUo7Q0FFQSxFQUFBLFdBQU87Q0FBUCxZQUVNO0NBRUosRUFBSSxPQUFKO0NBRkk7Q0FGTixZQU1NO0NBRUosRUFBSSxPQUFKO0NBRkk7Q0FOTixZQVVNO0NBRUosRUFBSSxPQUFKO0NBWkYsTUFKQTtDQUFBLEdBa0JLLEVBQUw7TUFoQ0Q7Q0FrQ2EsQ0FBRyxFQUFaLElBQUEsR0FBQTtDQTFLTCxFQXNJTTs7Q0F0SU4sQ0E0S0EsQ0FBWSxLQUFYLENBQVk7Q0FFWixFQUFlLENBQWY7Q0FBQSxHQUFLLEVBQUw7TUFBQTtDQUVBLEVBQWUsQ0FBZjtDQUFBLEdBQUssRUFBTDtNQUZBO0NBSUEsRUFBbUMsQ0FBbkM7Q0FBQSxFQUFXLFVBQUo7TUFKUDtDQU1BLEVBQWlCLENBQWpCO0NBQUEsWUFBTztNQU5QO0NBUUEsRUFBNkMsQ0FBN0M7Q0FBQSxFQUFXLFVBQUo7TUFSUDtDQUZXLFVBWVg7Q0F4TEQsRUE0S1k7O0NBNUtaOztDQUZEIiwic291cmNlc0NvbnRlbnQiOlsiIyBUaGUgY29sb3IgdmFsdWUgaG9sZGVyLCB3aXRoIHNvbWUgdXRpbGl0eSBmdW5jdGlvbnMuXG4jXG4jIENvbnZlcnNpb24gZnVuY3Rpb25zIGFsbW9zdCBiYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vbWppamFja3Nvbi9tamlqYWNrc29uLmdpdGh1Yi5jb20vYmxvYi9tYXN0ZXIvMjAwOC8wMi9yZ2ItdG8taHNsLWFuZC1yZ2ItdG8taHN2LWNvbG9yLW1vZGVsLWNvbnZlcnNpb24tYWxnb3JpdGhtcy1pbi1qYXZhc2NyaXB0LnR4dFxuIyBUaGFua3MgdG8gQG1qaWphY2tzb25cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQ1NTQ29sb3JcblxuXHRjb25zdHJ1Y3RvcjogKGgsIHMsIGwpIC0+XG5cblx0XHRAaCA9IGhcblx0XHRAcyA9IHNcblx0XHRAbCA9IGxcblxuXHRzZXRIdWU6IChkZWcpIC0+XG5cblx0XHRAaCA9IGRlZyAvIDM2MFxuXG5cdFx0QFxuXG5cdHJvdGF0ZUh1ZTogKGRlZykgLT5cblxuXHRcdGRlZyAvPSAzNjBcblxuXHRcdEBoID0gQGggKyBkZWdcblxuXHRcdEBcblxuXHRzZXRTYXR1cmF0aW9uOiAoYW1vdW50KSAtPlxuXG5cdFx0QHMgPSBhbW91bnQgLyAxMDBcblxuXHRcdEBcblxuXHRzYXR1cmF0ZTogKGFtb3VudCkgLT5cblxuXHRcdEBzICs9IGFtb3VudCAvIDEwMFxuXG5cdFx0QFxuXG5cdHNldExpZ2h0bmVzczogKGFtb3VudCkgLT5cblxuXHRcdEBsID0gYW1vdW50IC8gMTAwXG5cblx0XHRAXG5cblx0bGlnaHRlbjogKGFtb3VudCkgLT5cblxuXHRcdEBsICs9IGFtb3VudCAvIDEwMFxuXG5cdFx0QFxuXG5cdHRvQ3NzOiAtPlxuXG5cdFx0aCA9IE1hdGgucm91bmQgQGggKiAzNjBcblx0XHRzID0gTWF0aC5yb3VuZCBAcyAqIDEwMFxuXHRcdGwgPSBNYXRoLnJvdW5kIEBsICogMTAwXG5cblx0XHRcImhzbCgje2h9LCAje3N9JSwgI3tsfSUpXCJcblxuXHRmcm9tSHNsOiAoaCwgcywgbCkgLT5cblxuXHRcdEBoID0gaCAvIDM2MFxuXHRcdEBzID0gcyAvIDEwMFxuXHRcdEBsID0gbCAvIDEwMFxuXG5cdFx0QFxuXG5cdHRvUmdiOiAtPlxuXG5cdFx0ciA9IDBcblx0XHRnID0gMFxuXHRcdGIgPSAwXG5cblx0XHRpZiBAcyBpcyAwXG5cblx0XHRcdHIgPSBnID0gYiA9IEBsICMgYWNocm9tYXRpY1xuXG5cdFx0ZWxzZVxuXG5cdFx0XHRxID0gKGlmIEBsIDwgMC41IHRoZW4gQGwgKiAoMSArIEBzKSBlbHNlIEBsICsgQHMgLSBAbCAqIEBzKVxuXG5cdFx0XHRwID0gMiAqIEBsIC0gcVxuXG5cdFx0XHRyID0gQ1NTQ29sb3IuX2h1ZTJyZ2IocCwgcSwgQGggKyAxIC8gMylcblxuXHRcdFx0ZyA9IENTU0NvbG9yLl9odWUycmdiKHAsIHEsIEBoKVxuXG5cdFx0XHRiID0gQ1NTQ29sb3IuX2h1ZTJyZ2IocCwgcSwgQGggLSAxIC8gMylcblxuXHRcdFtyICogMjU1LCBnICogMjU1LCBiICogMjU1XVxuXG5cdGZyb21SZ2I6IChyLCBnLCBiKSAtPlxuXG5cdFx0ciAvPSAyNTVcblx0XHRnIC89IDI1NVxuXHRcdGIgLz0gMjU1XG5cblx0XHRtYXggPSBNYXRoLm1heCByLCBnLCBiXG5cdFx0bWluID0gTWF0aC5taW4gciwgZywgYlxuXG5cdFx0aCA9IDBcblx0XHRzID0gMFxuXG5cdFx0bCA9IChtYXggKyBtaW4pIC8gMlxuXG5cdFx0dW5sZXNzIG1heCBpcyBtaW5cblxuXHRcdFx0ZCA9IG1heCAtIG1pblxuXG5cdFx0XHRzID0gKGlmIGwgPiAwLjUgdGhlbiBkIC8gKDIgLSBtYXggLSBtaW4pIGVsc2UgZCAvIChtYXggKyBtaW4pKVxuXG5cdFx0XHRzd2l0Y2ggbWF4XG5cblx0XHRcdFx0d2hlbiByXG5cblx0XHRcdFx0XHRoID0gKGcgLSBiKSAvIGQgKyAoKGlmIGcgPCBiIHRoZW4gNiBlbHNlIDApKVxuXG5cdFx0XHRcdHdoZW4gZ1xuXG5cdFx0XHRcdFx0aCA9IChiIC0gcikgLyBkICsgMlxuXG5cdFx0XHRcdHdoZW4gYlxuXG5cdFx0XHRcdFx0aCA9IChyIC0gZykgLyBkICsgNFxuXG5cdFx0XHRoIC89IDZcblxuXHRcdEBoID0gaFxuXHRcdEBzID0gc1xuXHRcdEBsID0gbFxuXG5cdFx0QFxuXG5cdGNsb25lOiAtPlxuXG5cdFx0bmV3IENTU0NvbG9yIEBoLCBAcywgQGxcblxuXHRAaHNsOiAoaCwgcywgbCkgLT5cblxuXHRcdG5ldyBDU1NDb2xvciBoLCBzLCBsXG5cblx0QHJnYjogKHIsIGcsIGIpIC0+XG5cblx0XHRyIC89IDI1NVxuXHRcdGcgLz0gMjU1XG5cdFx0YiAvPSAyNTVcblxuXHRcdG1heCA9IE1hdGgubWF4IHIsIGcsIGJcblx0XHRtaW4gPSBNYXRoLm1pbiByLCBnLCBiXG5cblx0XHRoID0gMFxuXHRcdHMgPSAwXG5cblx0XHRsID0gKG1heCArIG1pbikgLyAyXG5cblx0XHR1bmxlc3MgbWF4IGlzIG1pblxuXG5cdFx0XHRkID0gbWF4IC0gbWluXG5cblx0XHRcdHMgPSAoaWYgbCA+IDAuNSB0aGVuIGQgLyAoMiAtIG1heCAtIG1pbikgZWxzZSBkIC8gKG1heCArIG1pbikpXG5cblx0XHRcdHN3aXRjaCBtYXhcblxuXHRcdFx0XHR3aGVuIHJcblxuXHRcdFx0XHRcdGggPSAoZyAtIGIpIC8gZCArICgoaWYgZyA8IGIgdGhlbiA2IGVsc2UgMCkpXG5cblx0XHRcdFx0d2hlbiBnXG5cblx0XHRcdFx0XHRoID0gKGIgLSByKSAvIGQgKyAyXG5cblx0XHRcdFx0d2hlbiBiXG5cblx0XHRcdFx0XHRoID0gKHIgLSBnKSAvIGQgKyA0XG5cblx0XHRcdGggLz0gNlxuXG5cdFx0bmV3IENTU0NvbG9yIGgsIHMsIGxcblxuXHRAX2h1ZTJyZ2IgPSAocCwgcSwgdCkgLT5cblxuXHRcdHQgKz0gMSAgaWYgdCA8IDBcblxuXHRcdHQgLT0gMSAgaWYgdCA+IDFcblxuXHRcdHJldHVybiBwICsgKHEgLSBwKSAqIDYgKiB0ICBpZiB0IDwgMSAvIDZcblxuXHRcdHJldHVybiBxICBpZiB0IDwgMSAvIDJcblxuXHRcdHJldHVybiBwICsgKHEgLSBwKSAqICgyIC8gMyAtIHQpICogNiAgaWYgdCA8IDIgLyAzXG5cblx0XHRwIl19
},{}],44:[function(require,module,exports){
var lazyValues;

module.exports = lazyValues = {};

lazyValues.getLazyValue = function(val) {
  if ((val._isLazy != null) && val._isLazy) {
    return val();
  } else {
    return val;
  }
};

lazyValues.getLazyValues = function(ar) {
  var item, _i, _len, _results;
  _results = [];
  for (_i = 0, _len = ar.length; _i < _len; _i++) {
    item = ar[_i];
    _results.push(lazyValues.getLazyValue(item));
  }
  return _results;
};

lazyValues.returnLazily = function(fn) {
  return function() {
    var args, ret,
      _this = this;
    args = arguments;
    ret = function() {
      return fn.apply(_this, args);
    };
    ret._isLazy = true;
    return ret;
  };
};

lazyValues.acceptLazyArgs = function(fn) {
  return function() {
    var args;
    args = lazyValues.getLazyValues(arguments);
    return fn.apply(this, args);
  };
};

lazyValues.acceptAndReturnLazily = function(fn) {
  return lazyValues.returnLazily(lazyValues.acceptLazyArgs(fn));
};

lazyValues;

},{}],45:[function(require,module,exports){
var CSSFilter, blur, brightness, contrast, filters, grayscale, hueRotate, invert, opacity, saturate, sepia;

blur = require('./Filter/blur');

brightness = require('./Filter/brightness');

contrast = require('./Filter/contrast');

grayscale = require('./Filter/grayscale');

hueRotate = require('./Filter/hueRotate');

invert = require('./Filter/invert');

opacity = require('./Filter/opacity');

saturate = require('./Filter/saturate');

sepia = require('./Filter/sepia');

filters = {
  blur: blur,
  brightness: brightness,
  contrast: contrast,
  grayscale: grayscale,
  hueRotate: hueRotate,
  invert: invert,
  opacity: opacity,
  saturate: saturate,
  sepia: sepia
};

module.exports = CSSFilter = (function() {
  function CSSFilter() {
    this._filters = {};
  }

  CSSFilter.prototype.setBlur = function(d) {
    this._filters.blur = d;
    return this;
  };

  CSSFilter.prototype.setBrightness = function(d) {
    this._filters.brightness = d;
    return this;
  };

  CSSFilter.prototype.setContrast = function(d) {
    this._filters.contrast = d;
    return this;
  };

  CSSFilter.prototype.setGrayscale = function(d) {
    this._filters.grayscale = d;
    return this;
  };

  CSSFilter.prototype.rotateHue = function(d) {
    this._filters.hueRotate = d;
    return this;
  };

  CSSFilter.prototype.invertColors = function(d) {
    this._filters.invert = d;
    return this;
  };

  CSSFilter.prototype.setOpacity = function(d) {
    this._filters.opacity = d;
    return this;
  };

  CSSFilter.prototype.setSaturation = function(d) {
    this._filters.saturate = d;
    return this;
  };

  CSSFilter.prototype.setSepia = function(d) {
    this._filters.sepia = d;
    return this;
  };

  CSSFilter.prototype.toCss = function() {
    var key, str, value, _ref;
    str = '';
    _ref = this._filters;
    for (key in _ref) {
      value = _ref[key];
      str += filters[key].toCss(value) + ' ';
    }
    return str;
  };

  return CSSFilter;

})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsdGVyLmpzIiwic291cmNlUm9vdCI6Ii4uXFwuLlxcLi4iLCJzb3VyY2VzIjpbImNvZmZlZVxcbGliXFx2aXN1YWxzXFxGaWx0ZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsa0dBQUE7O0FBQUEsQ0FBQSxFQUFPLENBQVAsR0FBTyxRQUFBOztBQUNQLENBREEsRUFDYSxJQUFBLEdBQWIsV0FBYTs7QUFDYixDQUZBLEVBRVcsSUFBQSxDQUFYLFdBQVc7O0FBQ1gsQ0FIQSxFQUdZLElBQUEsRUFBWixXQUFZOztBQUNaLENBSkEsRUFJWSxJQUFBLEVBQVosV0FBWTs7QUFDWixDQUxBLEVBS1MsR0FBVCxDQUFTLFVBQUE7O0FBQ1QsQ0FOQSxFQU1VLElBQVYsV0FBVTs7QUFDVixDQVBBLEVBT1csSUFBQSxDQUFYLFdBQVc7O0FBQ1gsQ0FSQSxFQVFRLEVBQVIsRUFBUSxTQUFBOztBQUVSLENBVkEsRUFZQyxJQUZEO0NBRUMsQ0FBQSxFQUFBO0NBQUEsQ0FDQSxRQUFBO0NBREEsQ0FFQSxNQUFBO0NBRkEsQ0FHQSxPQUFBO0NBSEEsQ0FJQSxPQUFBO0NBSkEsQ0FLQSxJQUFBO0NBTEEsQ0FNQSxLQUFBO0NBTkEsQ0FPQSxNQUFBO0NBUEEsQ0FRQSxHQUFBO0NBcEJELENBQUE7O0FBeUJBLENBekJBLEVBeUJ1QixHQUFqQixDQUFOO0NBRWMsQ0FBQSxDQUFBLGdCQUFBO0NBRVosQ0FBQSxDQUFZLENBQVosSUFBQTtDQUZELEVBQWE7O0NBQWIsRUFJUyxJQUFULEVBQVU7Q0FFVCxFQUFpQixDQUFqQixJQUFTO0NBRkQsVUFJUjtDQVJELEVBSVM7O0NBSlQsRUFVZSxNQUFDLElBQWhCO0NBRUMsRUFBdUIsQ0FBdkIsSUFBUyxFQUFUO0NBRmMsVUFJZDtDQWRELEVBVWU7O0NBVmYsRUFnQmEsTUFBQyxFQUFkO0NBRUMsRUFBcUIsQ0FBckIsSUFBUztDQUZHLFVBSVo7Q0FwQkQsRUFnQmE7O0NBaEJiLEVBc0JjLE1BQUMsR0FBZjtDQUVDLEVBQXNCLENBQXRCLElBQVMsQ0FBVDtDQUZhLFVBSWI7Q0ExQkQsRUFzQmM7O0NBdEJkLEVBNEJXLE1BQVg7Q0FFQyxFQUFzQixDQUF0QixJQUFTLENBQVQ7Q0FGVSxVQUlWO0NBaENELEVBNEJXOztDQTVCWCxFQWtDYyxNQUFDLEdBQWY7Q0FFQyxFQUFtQixDQUFuQixFQUFBLEVBQVM7Q0FGSSxVQUliO0NBdENELEVBa0NjOztDQWxDZCxFQXdDWSxNQUFDLENBQWI7Q0FFQyxFQUFvQixDQUFwQixHQUFBLENBQVM7Q0FGRSxVQUlYO0NBNUNELEVBd0NZOztDQXhDWixFQThDZSxNQUFDLElBQWhCO0NBRUMsRUFBcUIsQ0FBckIsSUFBUztDQUZLLFVBSWQ7Q0FsREQsRUE4Q2U7O0NBOUNmLEVBb0RVLEtBQVYsQ0FBVztDQUVWLEVBQWtCLENBQWxCLENBQUEsR0FBUztDQUZBLFVBSVQ7Q0F4REQsRUFvRFU7O0NBcERWLEVBMERPLEVBQVAsSUFBTztDQUVOLE9BQUEsYUFBQTtDQUFBLENBQUEsQ0FBQSxDQUFBO0NBRUE7Q0FBQSxRQUFBLEVBQUE7eUJBQUE7Q0FFQyxFQUFBLENBQU8sQ0FBQSxDQUFQLENBQWU7Q0FGaEIsSUFGQTtDQUZNLFVBUU47Q0FsRUQsRUEwRE87O0NBMURQOztDQTNCRCIsInNvdXJjZXNDb250ZW50IjpbImJsdXIgPSByZXF1aXJlICcuL0ZpbHRlci9ibHVyJ1xuYnJpZ2h0bmVzcyA9IHJlcXVpcmUgJy4vRmlsdGVyL2JyaWdodG5lc3MnXG5jb250cmFzdCA9IHJlcXVpcmUgJy4vRmlsdGVyL2NvbnRyYXN0J1xuZ3JheXNjYWxlID0gcmVxdWlyZSAnLi9GaWx0ZXIvZ3JheXNjYWxlJ1xuaHVlUm90YXRlID0gcmVxdWlyZSAnLi9GaWx0ZXIvaHVlUm90YXRlJ1xuaW52ZXJ0ID0gcmVxdWlyZSAnLi9GaWx0ZXIvaW52ZXJ0J1xub3BhY2l0eSA9IHJlcXVpcmUgJy4vRmlsdGVyL29wYWNpdHknXG5zYXR1cmF0ZSA9IHJlcXVpcmUgJy4vRmlsdGVyL3NhdHVyYXRlJ1xuc2VwaWEgPSByZXF1aXJlICcuL0ZpbHRlci9zZXBpYSdcblxuZmlsdGVycyA9XG5cblx0Ymx1cjogYmx1clxuXHRicmlnaHRuZXNzOiBicmlnaHRuZXNzXG5cdGNvbnRyYXN0OiBjb250cmFzdFxuXHRncmF5c2NhbGU6IGdyYXlzY2FsZVxuXHRodWVSb3RhdGU6IGh1ZVJvdGF0ZVxuXHRpbnZlcnQ6IGludmVydFxuXHRvcGFjaXR5OiBvcGFjaXR5XG5cdHNhdHVyYXRlOiBzYXR1cmF0ZVxuXHRzZXBpYTogc2VwaWFcblxuIyBSZW1lbWJlciB0aGF0IGZpbHRlcnMgYXJlIG9ubHkgc3VwcG9ydGVkIG9uIHNvbWUgcG9ydHMgb2Ygd2Via2l0LFxuIyBhbmQgbXkgdGVzdGluZyBvbiBDaHJvbWUvV2luIHNob3dlZCB0aGF0IHRoZXkgc2xvdyB0aGUgcmVuZGVyaW5nXG4jIGRvd24uXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIENTU0ZpbHRlclxuXG5cdGNvbnN0cnVjdG9yOiAtPlxuXG5cdFx0QF9maWx0ZXJzID0ge31cblxuXHRzZXRCbHVyOiAoZCkgLT5cblxuXHRcdEBfZmlsdGVycy5ibHVyID0gZFxuXG5cdFx0QFxuXG5cdHNldEJyaWdodG5lc3M6IChkKSAtPlxuXG5cdFx0QF9maWx0ZXJzLmJyaWdodG5lc3MgPSBkXG5cblx0XHRAXG5cblx0c2V0Q29udHJhc3Q6IChkKSAtPlxuXG5cdFx0QF9maWx0ZXJzLmNvbnRyYXN0ID0gZFxuXG5cdFx0QFxuXG5cdHNldEdyYXlzY2FsZTogKGQpIC0+XG5cblx0XHRAX2ZpbHRlcnMuZ3JheXNjYWxlID0gZFxuXG5cdFx0QFxuXG5cdHJvdGF0ZUh1ZTogKGQpIC0+XG5cblx0XHRAX2ZpbHRlcnMuaHVlUm90YXRlID0gZFxuXG5cdFx0QFxuXG5cdGludmVydENvbG9yczogKGQpIC0+XG5cblx0XHRAX2ZpbHRlcnMuaW52ZXJ0ID0gZFxuXG5cdFx0QFxuXG5cdHNldE9wYWNpdHk6IChkKSAtPlxuXG5cdFx0QF9maWx0ZXJzLm9wYWNpdHkgPSBkXG5cblx0XHRAXG5cblx0c2V0U2F0dXJhdGlvbjogKGQpIC0+XG5cblx0XHRAX2ZpbHRlcnMuc2F0dXJhdGUgPSBkXG5cblx0XHRAXG5cblx0c2V0U2VwaWE6IChkKSAtPlxuXG5cdFx0QF9maWx0ZXJzLnNlcGlhID0gZFxuXG5cdFx0QFxuXG5cdHRvQ3NzOiAtPlxuXG5cdFx0c3RyID0gJydcblxuXHRcdGZvciBrZXksIHZhbHVlIG9mIEBfZmlsdGVyc1xuXG5cdFx0XHRzdHIgKz0gZmlsdGVyc1trZXldLnRvQ3NzKHZhbHVlKSArICcgJ1xuXG5cdFx0c3RyIl19
},{"./Filter/blur":46,"./Filter/brightness":47,"./Filter/contrast":48,"./Filter/grayscale":49,"./Filter/hueRotate":50,"./Filter/invert":51,"./Filter/opacity":52,"./Filter/saturate":53,"./Filter/sepia":54}],46:[function(require,module,exports){
var blur;

module.exports = blur = {
  toCss: function(radius) {
    return "blur(" + radius + "px)";
  }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmx1ci5qcyIsInNvdXJjZVJvb3QiOiIuLlxcLi5cXC4uXFwuLiIsInNvdXJjZXMiOlsiY29mZmVlXFxsaWJcXHZpc3VhbHNcXGZpbHRlclxcYmx1ci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQTs7QUFBQSxDQUFBLEVBQWlCLENBQUEsRUFBWCxDQUFOO0NBRUMsQ0FBQSxDQUFPLEVBQVAsQ0FBTyxHQUFDO0NBQUQsRUFFQyxHQUFOLENBQUEsSUFBQTtDQUZGLEVBQU87Q0FGUixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBibHVyID1cblxuXHR0b0NzczogKHJhZGl1cykgLT5cblxuXHRcdFwiYmx1cigje3JhZGl1c31weClcIiJdfQ==
},{}],47:[function(require,module,exports){
var brightness;

module.exports = brightness = {
  toCss: function(amount) {
    return "brightness(" + amount + ")";
  }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJpZ2h0bmVzcy5qcyIsInNvdXJjZVJvb3QiOiIuLlxcLi5cXC4uXFwuLiIsInNvdXJjZXMiOlsiY29mZmVlXFxsaWJcXHZpc3VhbHNcXGZpbHRlclxcYnJpZ2h0bmVzcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBQSxNQUFBOztBQUFBLENBQUEsRUFBaUIsR0FBWCxDQUFOLEdBQWlCO0NBRWhCLENBQUEsQ0FBTyxFQUFQLENBQU8sR0FBQztDQUFELEVBRU8sR0FBWixLQUFBLEVBQUE7Q0FGRixFQUFPO0NBRlIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gYnJpZ2h0bmVzcyA9XG5cblx0dG9Dc3M6IChhbW91bnQpIC0+XG5cblx0XHRcImJyaWdodG5lc3MoI3thbW91bnR9KVwiIl19
},{}],48:[function(require,module,exports){
var contrast;

module.exports = contrast = {
  toCss: function(amount) {
    return "contrast(" + amount + "%)";
  }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJhc3QuanMiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLlxcLi4iLCJzb3VyY2VzIjpbImNvZmZlZVxcbGliXFx2aXN1YWxzXFxmaWx0ZXJcXGNvbnRyYXN0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLElBQUE7O0FBQUEsQ0FBQSxFQUFpQixHQUFYLENBQU4sQ0FBaUI7Q0FFaEIsQ0FBQSxDQUFPLEVBQVAsQ0FBTyxHQUFDO0NBQUQsRUFFSyxHQUFWLEtBQUE7Q0FGRixFQUFPO0NBRlIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gY29udHJhc3QgPVxuXG5cdHRvQ3NzOiAoYW1vdW50KSAtPlxuXG5cdFx0XCJjb250cmFzdCgje2Ftb3VudH0lKVwiIl19
},{}],49:[function(require,module,exports){
var grayscale;

module.exports = grayscale = {
  toCss: function(amount) {
    return "grayscale(" + amount + "%)";
  }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JheXNjYWxlLmpzIiwic291cmNlUm9vdCI6Ii4uXFwuLlxcLi5cXC4uIiwic291cmNlcyI6WyJjb2ZmZWVcXGxpYlxcdmlzdWFsc1xcZmlsdGVyXFxncmF5c2NhbGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsS0FBQTs7QUFBQSxDQUFBLEVBQWlCLEdBQVgsQ0FBTixFQUFpQjtDQUVoQixDQUFBLENBQU8sRUFBUCxDQUFPLEdBQUM7Q0FBRCxFQUVNLEdBQVgsS0FBQSxDQUFBO0NBRkYsRUFBTztDQUZSLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGdyYXlzY2FsZSA9XG5cblx0dG9Dc3M6IChhbW91bnQpIC0+XG5cblx0XHRcImdyYXlzY2FsZSgje2Ftb3VudH0lKVwiIl19
},{}],50:[function(require,module,exports){
var hueRotate;

module.exports = hueRotate = {
  toCss: function(angle) {
    return "hue-rotate(" + angle + "deg)";
  }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHVlUm90YXRlLmpzIiwic291cmNlUm9vdCI6Ii4uXFwuLlxcLi5cXC4uIiwic291cmNlcyI6WyJjb2ZmZWVcXGxpYlxcdmlzdWFsc1xcZmlsdGVyXFxodWVSb3RhdGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsS0FBQTs7QUFBQSxDQUFBLEVBQWlCLEdBQVgsQ0FBTixFQUFpQjtDQUVoQixDQUFBLENBQU8sRUFBUCxJQUFRO0NBQUQsRUFFTyxFQUFaLE1BQUEsRUFBQTtDQUZGLEVBQU87Q0FGUixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBodWVSb3RhdGUgPVxuXG5cdHRvQ3NzOiAoYW5nbGUpIC0+XG5cblx0XHRcImh1ZS1yb3RhdGUoI3thbmdsZX1kZWcpXCIiXX0=
},{}],51:[function(require,module,exports){
var invert;

module.exports = invert = {
  toCss: function(amount) {
    return "invert(" + amount + "%)";
  }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52ZXJ0LmpzIiwic291cmNlUm9vdCI6Ii4uXFwuLlxcLi5cXC4uIiwic291cmNlcyI6WyJjb2ZmZWVcXGxpYlxcdmlzdWFsc1xcZmlsdGVyXFxpbnZlcnQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUEsRUFBQTs7QUFBQSxDQUFBLEVBQWlCLEdBQVgsQ0FBTjtDQUVDLENBQUEsQ0FBTyxFQUFQLENBQU8sR0FBQztDQUFELEVBRUcsR0FBUixHQUFBLEVBQUE7Q0FGRixFQUFPO0NBRlIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gaW52ZXJ0ID1cblxuXHR0b0NzczogKGFtb3VudCkgLT5cblxuXHRcdFwiaW52ZXJ0KCN7YW1vdW50fSUpXCIiXX0=
},{}],52:[function(require,module,exports){
var opacity;

module.exports = opacity = {
  toCss: function(amount) {
    return "opacity(" + amount + "%)";
  }
};

},{}],53:[function(require,module,exports){
var saturate;

module.exports = saturate = {
  toCss: function(amount) {
    return "saturate(" + amount + "%)";
  }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2F0dXJhdGUuanMiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLlxcLi4iLCJzb3VyY2VzIjpbImNvZmZlZVxcbGliXFx2aXN1YWxzXFxmaWx0ZXJcXHNhdHVyYXRlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLElBQUE7O0FBQUEsQ0FBQSxFQUFpQixHQUFYLENBQU4sQ0FBaUI7Q0FFaEIsQ0FBQSxDQUFPLEVBQVAsQ0FBTyxHQUFDO0NBQUQsRUFFSyxHQUFWLEtBQUE7Q0FGRixFQUFPO0NBRlIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gc2F0dXJhdGUgPVxuXG5cdHRvQ3NzOiAoYW1vdW50KSAtPlxuXG5cdFx0XCJzYXR1cmF0ZSgje2Ftb3VudH0lKVwiIl19
},{}],54:[function(require,module,exports){
var sepia;

module.exports = sepia = {
  toCss: function(amount) {
    return "sepia(" + amount + "%)";
  }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VwaWEuanMiLCJzb3VyY2VSb290IjoiLi5cXC4uXFwuLlxcLi4iLCJzb3VyY2VzIjpbImNvZmZlZVxcbGliXFx2aXN1YWxzXFxmaWx0ZXJcXHNlcGlhLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFBLENBQUE7O0FBQUEsQ0FBQSxFQUFpQixFQUFBLENBQVgsQ0FBTjtDQUVDLENBQUEsQ0FBTyxFQUFQLENBQU8sR0FBQztDQUFELEVBRUUsR0FBUCxFQUFBLEdBQUE7Q0FGRixFQUFPO0NBRlIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gc2VwaWEgPVxuXG5cdHRvQ3NzOiAoYW1vdW50KSAtPlxuXG5cdFx0XCJzZXBpYSgje2Ftb3VudH0lKVwiIl19
},{}],55:[function(require,module,exports){
/*
 * Source: http://stackoverflow.com/a/11697909/607997
 * http://codepen.io/onedayitwillmake/details/EHDmw
 * by Mario Gonzalez
*/

/*
 * Solver for cubic bezier curve with implicit control points at (0,0) and (1.0, 1.0)
*/

var UnitBezier;

module.exports = UnitBezier = (function() {
  function UnitBezier(p1x, p1y, p2x, p2y) {
    this.cx = 3.0 * p1x;
    this.bx = 3.0 * (p2x - p1x) - this.cx;
    this.ax = 1.0 - this.cx - this.bx;
    this.cy = 3.0 * p1y;
    this.by = 3.0 * (p2y - p1y) - this.cy;
    this.ay = 1.0 - this.cy - this.by;
  }

  UnitBezier.epsilon = 1e-6;

  UnitBezier.prototype.sampleCurveX = function(t) {
    return ((this.ax * t + this.bx) * t + this.cx) * t;
  };

  UnitBezier.prototype.sampleCurveY = function(t) {
    return ((this.ay * t + this.by) * t + this.cy) * t;
  };

  UnitBezier.prototype.sampleCurveDerivativeX = function(t) {
    return (3.0 * this.ax * t + 2.0 * this.bx) * t + this.cx;
  };

  UnitBezier.prototype.solveCurveX = function(x, epsilon) {
    var d2, i, t0, t1, t2, x2;
    t0 = void 0;
    t1 = void 0;
    t2 = void 0;
    x2 = void 0;
    d2 = void 0;
    i = void 0;
    t2 = x;
    i = 0;
    while (i < 8) {
      x2 = this.sampleCurveX(t2) - x;
      if (Math.abs(x2) < epsilon) {
        return t2;
      }
      d2 = this.sampleCurveDerivativeX(t2);
      if (Math.abs(d2) < epsilon) {
        break;
      }
      t2 = t2 - x2 / d2;
      i++;
    }
    t0 = 0.0;
    t1 = 1.0;
    t2 = x;
    if (t2 < t0) {
      return t0;
    }
    if (t2 > t1) {
      return t1;
    }
    while (t0 < t1) {
      x2 = this.sampleCurveX(t2);
      if (Math.abs(x2 - x) < epsilon) {
        return t2;
      }
      if (x > x2) {
        t0 = t2;
      } else {
        t1 = t2;
      }
      t2 = (t1 - t0) * .5 + t0;
    }
    return t2;
  };

  UnitBezier.prototype.solve = function(x, epsilon) {
    return this.sampleCurveY(this.solveCurveX(x, epsilon));
  };

  return UnitBezier;

})();

},{}],56:[function(require,module,exports){
var Bezier, easing;

Bezier = require('./Bezier');

module.exports = easing = {
  linear: function(p) {
    return p;
  },
  define: function(name, func) {
    var _func, _name;
    if (typeof name === 'object') {
      for (_name in name) {
        _func = name[_name];
        easing.define(_name, _func);
      }
      return;
    }
    return easing[name] = {
      easeIn: func,
      easeOut: function(p) {
        return 1 - func(1 - p);
      },
      easeInOut: function(p) {
        if (p <= 0.5) {
          return 0.5 * func(p * 2);
        } else {
          return 0.5 * (2 - func(2 * (1 - p)));
        }
      }
    };
  },
  get: function(func) {
    var b, f, part, parts, _i, _len;
    if (func instanceof Function) {
      return func;
    } else if ((arguments[1] != null) && (arguments[2] != null) && (arguments[3] != null)) {
      b = new Bezier(arguments[0], arguments[1], arguments[2], arguments[3]);
      return function(p) {
        return b.solve(p, Bezier.epsilon);
      };
    }
    if (typeof func !== 'string') {
      throw Error("func should either be a function or a string, like cubic.easeOut");
    }
    parts = func.split('.');
    f = easing;
    for (_i = 0, _len = parts.length; _i < _len; _i++) {
      part = parts[_i];
      f = f[part];
    }
    if (typeof f === 'undefined') {
      throw Error("Cannot find easing function `" + func + "`");
    }
    return f;
  }
};

easing.define({
  quad: function(p) {
    return Math.pow(p, 2);
  },
  cubic: function(p) {
    return Math.pow(p, 3);
  },
  quart: function(p) {
    return Math.pow(p, 4);
  },
  quint: function(p) {
    return Math.pow(p, 5);
  },
  expo: function(p) {
    return Math.pow(2, 8 * (p - 1));
  },
  circ: function(p) {
    return 1 - Math.sin(Math.cos(p));
  },
  sine: function(p) {
    return 1 - Math.cos(p * Math.PI / 2);
  }
});

},{"./Bezier":55}]},{},[25])
(25)
});
;