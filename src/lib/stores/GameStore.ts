import { readable, writable } from 'svelte/store'
import GAME_STATES from '~/lib/enums/GAME_STATES'
import { convertWritableToReadable } from '~/lib/helpers/utils'
import LanguageStore from '~/lib/stores/LanguageStore'

export const ROWS = readable(6)
const _columns = writable(5)
export const COLUMNS = convertWritableToReadable(_columns)

export const gameState = writable(GAME_STATES.IN_PROGRESS)

export function newGame(letterCount: number) {
	_columns.set(letterCount)
	return LanguageStore.loadDictionary(letterCount)
}
