define ['css'], (css) ->

	window.requestAnimationFrame = do ->

		if typeof window.requestAnimationFrame isnt 'undefined' then return requestAnimationFrame

		if typeof window.webkitRequestAnimationFrame isnt 'undefined' then return webkitRequestAnimationFrame

		if typeof window.mozRequestAnimationFrame isnt 'undefined' then return mozRequestAnimationFrame

		(cb) -> setTimeout cb, 16.66

	# window.requestAnimationFrame = requestAnimationFrame || webkitRequestAnimationFrame || mozRequestAnimationFrame || (cb) ->

	# 	setTimeout cb, 16

	# console.log setTimeout

	sky = document.querySelector '.sky'

	clouds = document.querySelector '.clouds'

	cloudBack = document.querySelector '.cloud-back'

	cloud = document.querySelector '.cloud'

	logo = document.querySelector '.logo'

	logo.style.opacity = 0

	logo.style.webkitTransform = "translateX(90px) rotateY(50deg)"

	i = 1

	j = 1

	setTimeout =>

		logo.style.webkitTransition = "all 3s"

		logo.style.webkitTransform = "translateX(1px) rotateY(1deg)"

		logo.style.opacity = 1

	, 10000

	labelI = document.getElementById "text-i"

	labelJ = document.getElementById "text-j"


	do moveClouds = ->

		# if i < 900

			# cloud.style.left = parseInt(getComputedStyle(cloud).left) - 2 + 'px'

			# cloudBack.style.left = parseInt(getComputedStyle(cloudBack).left) - 1 + 'px'

		css.setTransform cloud, "scaleX(-1) translateX(#{i}px)"
		# cloud.style.webkitTransform = "scaleX(-1) translateX(#{i * 2}px)"

		css.setTransform cloudBack, "translateX(#{-j / 2}px)"
		# css.setTransform cloudBack, "translateX(#{-j}px)"

		# cloudBack.style.webkitTransform = "translateX(#{-j}px)"

		if i > 6300

			cloud.style.webkitTransform = "scaleX(-1) translateX(0)"

			i = 1

		if j > 11100

			cloudBack.style.webkitTransform = "translateX(0)"

			j = 1


			# cloud.style.webkitTransition = "all 4s"

			# cloudBack.style.webkitTransition = "all 4s"

			# cloud.style.opacity = 0

			# cloudBack.style.opacity = 0

		# labelI.value = i

		# labelJ.value = j

		i++

		j++

		# cloud.style.webkitTransition = "16"

		requestAnimationFrame moveClouds

	# myLogo = new Foxie logo

	# document.addEventListener "click", (e) ->

	# 	clouds.style.webkitTransition = "all 2s"

	# 	clouds.style.webkitTransform = "rotateX(-80deg) translateY(-100px)"

		# myLogo
		# .trans(4)
		# .scaleX(.95)
		# .scaleY(.95)

