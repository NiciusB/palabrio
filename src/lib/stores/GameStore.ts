import { writable } from 'svelte/store'
import GAME_STATES from '~/lib/enums/GAME_STATES'

export const ROWS = writable(6)
export const COLUMNS = writable(5)

export const gameState = writable(GAME_STATES.IN_PROGRESS)
