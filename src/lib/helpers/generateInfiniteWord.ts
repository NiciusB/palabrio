import { randomFromArray } from '~/lib/helpers/utils'
import LanguageStore from '~/lib/stores/LanguageStore'
import WordStore from '~/lib/stores/WordStore'

export default function generateInfiniteWord(round: number) {
	let maxTries: number
	let lettersCount: number
	if (round <= 1) {
		// 1st round
		lettersCount = 4
		maxTries = 8
	} else if (round <= 2) {
		// 2nd round
		lettersCount = 4
		maxTries = 7
	} else if (round <= 4) {
		// 3rd and 4th round
		lettersCount = 5
	} else if (round <= 10) {
		lettersCount = randomFromArray([5, 6])
	} else {
		lettersCount = randomFromArray([5, 6, 7])
	}

	return LanguageStore.loadDictionary(lettersCount).then(() => {
		WordStore.setWord(LanguageStore.generateRandomWord(), maxTries)
	})
}
