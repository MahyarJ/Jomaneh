define ->

	class Keyboard

		constructor: ->

			@downListeners = {}

			@upListeners = {}

			@activeKeys = {}

			document.addEventListener 'keydown', (e) =>

				keyCode = e.keyCode

				return if not @downListeners[keyCode]

				return if @activeKeys[keyCode]

				@activeKeys[keyCode] = on

				@downListeners[keyCode] e

			document.addEventListener 'keyup', (e) =>

				keyCode = e.keyCode

				return if not @upListeners[keyCode]
				
				if @activeKeys[keyCode]

					@activeKeys[keyCode] = off


				@upListeners[keyCode] e




		onDown: (keyCode, func) ->

			@downListeners[keyCode] = func
			
		onUp: (keyCode, func) ->

			@upListeners[keyCode] = func

