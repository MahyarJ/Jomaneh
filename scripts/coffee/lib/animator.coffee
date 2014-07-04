define ['tween'], (Tween) ->

	class Animator

		constructor: ->

			@from = 

				# Translate Parameters
				tX: 0
				tY: 0
				tZ: 0

				# Rotation Parameters
				rX: 0
				rY: 0
				rZ: 0

				# Scale Parameters				
				sX: 1
				sY: 1
				sZ: 1

				# Opacity
				oP: 1

			@to =
				# Translate Parameters
				tX: 0
				tY: 0
				tZ: 0

				# Rotation Parameters
				rX: 0
				rY: 0
				rZ: 0

				# Scale Parameters				
				sX: 1
				sY: 1
				sZ: 1

				# Opacity
				oP: 1

		fromState: (param) ->

			@from = 
			
				# Translate Parameters
				tX: param.tX || 0
				tY: param.tY || 0
				tZ: param.tZ || 0

				# Rotation Parameters
				rX: param.rX || 0
				rY: param.rY || 0
				rZ: param.rZ || 0

				# Scale Parameters				
				sX: param.sX+.001 || 1
				sY: param.sY+.001 || 1
				sZ: param.sZ+.001 || 1

				# Opacity
				oP: param.oP+.001 || 1
			
		toState: (param) ->
			
			@to =
				# Translate Parameters
				tX: param.tX || 0
				tY: param.tY || 0
				tZ: param.tZ || 0

				# Rotation Parameters
				rX: param.rX || 0
				rY: param.rY || 0
				rZ: param.rZ || 0

				# Scale Parameters				
				sX: param.sX+.001 || 1
				sY: param.sY+.001 || 1
				sZ: param.sZ+.001 || 1

				# Opacity
				oP: param.oP+.001 || 1

		start: (el, dur, del) ->

			@duration = dur || 1000
			@delay = del || 0

			startCordination = [

				@from.tX,
				@from.tY,
				@from.tZ

			]

			finishCordination = [

				@to.tX,
				@to.tY,
				@to.tZ

			]

			@mover = new Tween el, startCordination, finishCordination, @duration, @delay
			
			do @mover.setStart
			
			do @animate

		animate: ->

				# progress = this.mover.calculateProgress('quint')
				progress = @mover.calculateProgress 'quint' 

				currentX  = @from.tX + (@to.tX - @from.tX) * progress
				currentY  = @from.tY + (@to.tY - @from.tY) * progress
				currentZ  = @from.tZ + (@to.tZ - @from.tZ) * progress
				currentRX = @from.rX + (@to.rX - @from.rX) * progress
				currentRY = @from.rY + (@to.rY - @from.rY) * progress
				currentRZ = @from.rZ + (@to.rZ - @from.rZ) * progress
				currentSX = @from.sX + (@to.sX - @from.sX) * progress
				currentSY = @from.sY + (@to.sY - @from.sY) * progress
				currentSZ = @from.sZ + (@to.sZ - @from.sZ) * progress
				currentOP = @from.oP + (@to.oP - @from.oP) * progress

				@mover.el.style.webkitTransform = "translate3d(#{currentX.toFixed(5)}px, #{currentY.toFixed(5)}px, #{currentZ.toFixed(5)}px) " +
												  "perspective(10000) " +
												  "scale3d(#{currentSX.toFixed(5)}, #{currentSY.toFixed(5)}, #{currentSZ.toFixed(5)}) " +
												  "rotate3d(1, 0, 0, #{currentRX.toFixed(5)}deg) " +
												  "rotate3d(0, 1, 0, #{currentRY.toFixed(5)}deg) " +
												  "rotate3d(0, 0, 1, #{currentRZ.toFixed(5)}deg) "
												  
												  
				@mover.el.style.opacity = currentOP;

				if progress < 1

					webkitRequestAnimationFrame =>
						
						do @animate