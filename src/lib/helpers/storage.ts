export function storageSet(key: string, value: any): void {
	localStorage.setItem(key, JSON.stringify(value))
}

export function storageGet(key: string, defaultValue: any = null): any {
	try {
		const savedValue = localStorage.getItem(key)
		return (savedValue ? JSON.parse(savedValue) : null) ?? defaultValue
	} catch (error) {
		console.error(error)
		return defaultValue
	}
}
