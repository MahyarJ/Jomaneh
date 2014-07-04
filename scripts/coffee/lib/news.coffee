newsOpen = 1

$('.news-box').css

	'top': '150px'
	'right': Math.floor(window.innerWidth / 2 - 500) + 'px'
	'max-height': Math.floor(window.innerHeight - 200) + 'px'


$('.news').click ->

	if newsOpen is 1

		$('.main-menu').animate

			'opacity': 0
			'top'  : Math.floor(window.innerHeight / 2 - 100) + 'px'


		setTimeout ->

			$('.logo').animate

				'top': '30px',
				'slow'

		, 600

		setTimeout ->

			$('.news-box').animate

				'height': '800px'
				'opacity': '.8'

		, 1200

		setTimeout ->

			$('.news-box-content').animate

				'opacity': '1'
				# 'top': '300px'

		, 1800

		newsOpen = 0


$('.news-box > .close').click ->

	$('.news-content-box').animate

		'opacity': '0'


	setTimeout ->

		$('.news-box').animate

			'opacity': '0'
			'height': '0'

	, 600

	setTimeout ->

		$('.logo').animate

			'top': (window.innerHeight / 2 - 300) + 'px'

	, 1400


	setTimeout ->

		$('.main-menu').animate

			'opacity': '1'
			'top'  : Math.floor(window.innerHeight / 2) + 'px'

	, 1800

	newsOpen = 1

