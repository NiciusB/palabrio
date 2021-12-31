import { get } from 'svelte/store'
import LanguageStore from '~/lib/stores/LanguageStore'
import WordStore from '~/lib/stores/WordStore'

export default function setupKeyboardListener() {
	document.addEventListener('keydown', (evt) => {
		if (evt.ctrlKey || evt.altKey || evt.metaKey) {
			return
		}

		const key = evt.key
		if (
			key.length === 1 &&
			get(LanguageStore.keyboardLetters).includes(key.toLowerCase())
		) {
			WordStore.addLetterToGuess(key.toLowerCase())
		} else if (key === 'Enter') {
			const didSucceed = WordStore.submitGuess()
			if (didSucceed) {
				evt.preventDefault()
			}
		} else if (key === 'Backspace') {
			const didSucceed = WordStore.removeLastLetterGuess()
			if (didSucceed) {
				evt.preventDefault()
			}
		}
	})
}
