import seedrandom from 'seedrandom'
import getDailyWordInfo from '~/lib/helpers/getDailyWordInfo'
import LanguageStore from '~/lib/stores/LanguageStore'
import WordStore from '~/lib/stores/WordStore'

export const DAILY_WORD_LETTERS = 5

export default function generateDailyRandomWord() {
	const dailyWordInfo = getDailyWordInfo()
	return LanguageStore.loadDictionary(DAILY_WORD_LETTERS).then(() => {
		WordStore.setWord(
			LanguageStore.generateRandomWord(
				seedrandom(`S${dailyWordInfo.season} D${dailyWordInfo.day}`)
			)
		)
	})
}
