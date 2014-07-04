fetchPage = (panel) ->

	`$.ajax({

		type: 'GET',
		url:  '../pages/window-contents/' + panel + '.php',

	}).done(function(data){

		siteWindowContent.innerHTML = data

	}).fail(function(){

		console.log("Checkout Ajax Failed!");

	})`


# Preparing window objects to use:

siteWindow = document.querySelector ".window"

siteWindowContent =	document.querySelector ".window-content-box-ajax-load"

siteWindowClose = document.querySelector ".window-close"


# Preparing local hyperlinks

localLinkers = []

localLinks = []

allElements = document.getElementsByTagName "*"

for i in [0...allElements.length]

	if allElements[i].getAttribute 'data-page'

		localLinkers.push allElements[i]

		localLinks.push allElements[i].getAttribute 'data-page'


for i in [0...localLinkers.length]

	__i = i

	do (__i) =>

		localLinkers[__i].addEventListener "click", (e) ->

			siteWindow.style.visibility = "visible"

			fetchPage localLinks[__i]

			siteWindow.style.opacity = 1


# Window Close

siteWindowClose.addEventListener "click", (e) ->

	siteWindow.style.opacity = 0

	siteWindowContent.innerHTML = ""

	siteWindow.style.visibility = "hidden"
