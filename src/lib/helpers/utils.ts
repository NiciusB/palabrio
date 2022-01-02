import type { Writable, Readable } from 'svelte/store'

export function randomFromArray<T extends unknown>(array: Array<T>): T {
	return array[Math.floor(Math.random() * array.length)]
}

export function convertWritableToReadable<T>(
	writable: Writable<T>
): Readable<T> {
	return { subscribe: writable.subscribe }
}

export function normalizeWord(string: string): string {
	return (
		string
			.toLowerCase()
			.normalize('NFD')
			// Remove all diactritic, except the tilde from ñ
			.replace(/(?![\u0303])[\u0300-\u036f]/g, '')
			.normalize('NFC')
	)
}

export function isLanguageRTL(lang: string) {
	return [
		'ar',
		'arc',
		'dv',
		'fa',
		'ha',
		'he',
		'khw',
		'ks',
		'ku',
		'ps',
		'ur',
		'yi',
	].includes(lang)
}
