export default function trapFocus(modal: HTMLElement) {
	// add all the elements inside modal which you want to make focusable
	const focusableElements =
		'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

	const focusableContent =
		modal.querySelectorAll<HTMLElement>(focusableElements)

	const firstFocusableElement = focusableContent[0]
	const lastFocusableElement = focusableContent[focusableContent.length - 1]

	function keytabPressed(e: KeyboardEvent) {
		let isTabPressed = e.key === 'Tab'

		if (!isTabPressed) {
			return
		}

		if (e.shiftKey) {
			// if tab key is pressed with shift
			if (document.activeElement === firstFocusableElement) {
				lastFocusableElement.focus()
				e.preventDefault()
			}
		} else {
			// if tab key is pressed without shift
			if (document.activeElement === lastFocusableElement) {
				firstFocusableElement.focus()
				e.preventDefault()
			}
		}
	}

	document.addEventListener('keydown', keytabPressed)

	firstFocusableElement?.focus()

	return () => {
		document.removeEventListener('keydown', keytabPressed)
	}
}
