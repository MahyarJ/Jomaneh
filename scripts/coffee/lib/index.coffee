$('.main-menu').css

	'right': Math.floor(window.innerWidth / 2 - 150) + 'px'
	'top'  : Math.floor(window.innerHeight / 2) + 'px'


$('.logo').css

	'right': Math.floor(window.innerWidth / 2 - 200) + 'px'
	'top': (window.innerHeight / 2 - 300) + 'px'
	'opacity': '1'


$('.white-box').css

	'top': window.innerHeight + 'px'
	'height': window.innerHeight + 'px'



aboutusOpen = 1

$('.logo').click ->

	if aboutusOpen is 1

		$('.main-menu').animate

			'top'  : Math.floor(window.innerHeight / 2 - 100) + 'px'
			'opacity': 0


		$('.aboutus-box').css

			'right': (window.innerWidth / 7 + 100) + 'px'
			'top': (window.innerHeight / 2 - 200) + 'px'



		setTimeout ->

			$('.logo').animate

				'right': (window.innerWidth / 7 - 100) + 'px'

		, 800

		setTimeout ->

			$('.aboutus-box').animate

				'width': '800px'
				'height': '450px'
				'opacity': '.8'

		, 1000

		setTimeout ->

			$('.aboutus-box p').animate

				'opacity': '1'

		, 1800

		aboutusOpen = 0


$('.aboutus-box > .close').click ->

	$('.aboutus-box-content').animate

		'opacity': '0'


	setTimeout ->

		$('.aboutus-box').animate

			'width': '0'
			'height': '0'
			'opacity': '0'

	, 600

	setTimeout ->

		$('.logo').animate

			'right': Math.floor(window.innerWidth / 2 - 200) + 'px'

	, 1400


	setTimeout ->

		$('.main-menu').animate

			'top'  : Math.floor(window.innerHeight / 2) + 'px'
			'opacity': '1'

	, 2000

	aboutusOpen = 1



moveCloud = ->

	length = window.innerWidth

	$('.cloud').css("left", "-3577px")

	swap = 0

	if (parseInt($('.cloud').css("left")) < length + 100) or swap is 0

		$('.cloud').animate

			left: window.innerWidth + 100 + 'px',
			30000, ->

				swap = 1

				do moveCloud

do moveCloud

moveCloudBack = ->

	length = window.innerWidth

	$('.cloud-back').css("left", "-4077px")

	swap = 0

	if (parseInt($('.cloud-back').css("left")) < length + 100) or swap is 0

		$('.cloud-back').animate

			left: window.innerWidth + 50 + 'px',
			50000, ->

				swap = 1

				do moveCloudBack

do moveCloudBack


