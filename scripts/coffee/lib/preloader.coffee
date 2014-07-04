imagePreloader = (parent, imageSource, width, height) ->

	img = new Image

	img.style.width  = width + "px"

	img.style.height = height + "px"

	img.src = imageSource

	parent.style.opacity = 0

	img.onload = ->

		parent.style.opacity = 1

	img


thumbnails = document.querySelectorAll '.thumbnail'

pageNum = location.pathname[location.pathname.length - 8] + location.pathname[location.pathname.length - 7] + location.pathname[location.pathname.length - 6] + location.pathname[location.pathname.length - 5]

for i in [1..thumbnails.length]

	index = '' + i

	if i < 10

		index = '0' + i

	imageSourceURL = '../files/archive/' + pageNum + '/' + index + '.jpg'

	console.log imageSourceURL

	thumbnails[i - 1].appendChild imagePreloader(thumbnails[i - 1], imageSourceURL, 200, 300)