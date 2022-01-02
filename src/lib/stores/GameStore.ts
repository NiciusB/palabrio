import { readable, writable } from 'svelte/store'
import GAME_STATES from '~/lib/enums/GAME_STATES'

export const ROWS = readable(6)
export const COLUMNS = readable(5)

export const gameState = writable(GAME_STATES.IN_PROGRESS)
