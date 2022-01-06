export default function lastInteractionForFocusVisibility() {
	function setLastInteractionForFocusVisibility(event: Event) {
		if (event instanceof KeyboardEvent) {
			document.body.dataset.lastInteractionForFocusVisibility = 'keyboard'
		} else {
			document.body.dataset.lastInteractionForFocusVisibility = 'mouse/touch'
		}
	}
	window.addEventListener('keydown', setLastInteractionForFocusVisibility)
	window.addEventListener('mousedown', setLastInteractionForFocusVisibility)
}
