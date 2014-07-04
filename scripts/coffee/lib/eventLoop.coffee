define ->

	raf = requestAnimationFrame ? mozRequestAnimationFrame

	class EventLoop

		constructor: ->

			@_callbacks = []

			@_boundFireFrame = @_fireFrame.bind @

		animate: ->

			raf @_boundFireFrame

			@

		onNextFrame: (cb) ->

			@_callbacks.push cb

			@

		_fireFrame: ->

			cbs = @_callbacks

			@_callbacks = []

			for cb in cbs

				do cb

			do @animate