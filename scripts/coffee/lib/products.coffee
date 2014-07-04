# setTimeout ->

# 	$('.product-item').css "opacity", 1
# 	$('.product-adder').css "opacity", .6

# ,1500

productsOpen = 1

# $('.products-box').css

# 	'top': '150px'
# 	'right': Math.floor(window.innerWidth / 2 - 500) + 'px'
# 	'max-height': Math.floor(window.innerHeight - 200) + 'px'


$('.products').click ->

	if productsOpen is 1

		$('.main-menu').animate

			'opacity': 0
			'top'  : Math.floor(window.innerHeight / 2 - 100) + 'px'


		setTimeout ->

			$('.logo').animate

				'top': '30px',
				'slow'

		, 600

		setTimeout ->

			$('.logo').animate

				'right': '30px',
				'slow'

		, 1600

		setTimeout ->

			$('.products-panel').animate

				'height': '800px'
				'opacity': '.9'

		, 2000


		setTimeout ->

			$('.products-box').animate

				'height': '800px'
				'opacity': '1'

		, 2400

		setTimeout ->

			$('.products-box-content').animate

				'opacity': '1'
				# 'top': '300px'

		, 2500

		# $('.product-item').css "opacity", 1

		productsOpen = 0


$('.products-box > .close').click ->

	$('.products-content-box').animate

		'opacity': '0'


	setTimeout ->

		$('.products-box').animate

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

	productsOpen = 1

