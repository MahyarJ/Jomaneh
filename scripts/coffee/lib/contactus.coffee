contactusOpen = 1

$('.contactus').click ->

	if contactusOpen is 1

		$('.contactus-box').css

			'left': (window.innerWidth / 7 + 100) + 'px'
			'top': (window.innerHeight / 2 - 200) + 'px'

		$('.main-menu').animate

			'top'  : Math.floor(window.innerHeight / 2 - 100) + 'px'
			'opacity': 0


		setTimeout ->

			$('.logo').animate

				'right': (6 * window.innerWidth / 7 - 300) + 'px'

		, 800

		setTimeout ->

			$('.contactus-box').animate

				'width': '800px'
				'height': '450px'
				'opacity': '.8'

		, 1000

		setTimeout ->

			$('.contactus-box p').animate

				'opacity': '1'

		, 1800

		contactusOpen = 0


$('.contactus-box > .close').click ->

	$('.contactus-box p').animate

		'opacity': '0'


	setTimeout ->

		$('.contactus-box').animate

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

	contactusOpen = 1

