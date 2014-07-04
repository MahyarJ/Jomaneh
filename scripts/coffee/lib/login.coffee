sky = document.querySelector '.sky'

clouds = document.querySelector '.clouds'

cloudBack = document.querySelector '.cloud-back'

cloud = document.querySelector '.cloud'

# loginBox = document.querySelector '.login-box'

# loginBox.style.opacity = 0


cloud.style.left = "2000px"

$('.cloud').animate

	left: '-1000px',
	16000


cloudBack.style.left = "3000px"

$('.cloud-back').animate

	left: '-2000px',
	15000

setTimeout ->

	$('.login-box').animate

		opacity: .8,
		3000

, 5000