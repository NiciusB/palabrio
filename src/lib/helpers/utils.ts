import type { Writable, Readable } from 'svelte/store'

export function randomFromArray<T extends unknown>(array: Array<T>): T {
	return array[Math.floor(Math.random() * array.length)]
}

export function convertWritableToReadable<T>(
	writable: Writable<T>
): Readable<T> {
	return { subscribe: writable.subscribe }
}
