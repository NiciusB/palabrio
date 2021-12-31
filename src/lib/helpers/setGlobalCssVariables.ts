export default function setGlobalCssVariables() {
	function updateVh() {
		// https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
		let vh = window.innerHeight * 0.01
		document.documentElement.style.setProperty('--vh', `${vh}px`)
	}

	window.addEventListener('resize', updateVh)
	updateVh()
}
