arrowBeater = ->

	$('.arrow').css

		'opacity': '.2'

	setTimeout ->

		$('.arrow').css

			'opacity': '.8'

	, 600

	setTimeout ->

		do arrowBeater

	, 1000

do arrowBeater