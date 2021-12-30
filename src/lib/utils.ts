export function randomFromArray<T extends unknown>(array: Array<T>): T {
	return array[Math.floor(Math.random() * array.length)]
}
