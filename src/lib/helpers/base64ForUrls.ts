export function base64Encode(value: any, json = true): string {
	if (json) {
		value = JSON.stringify(value)
	}

	return btoa(unescape(encodeURIComponent(value)))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '')
}

export function base64Decode(value: string, json = true): unknown {
	const res = decodeURIComponent(
		escape(atob(value).replace(/-/g, '+').replace(/_/g, '/'))
	)
	return json ? JSON.parse(res) : res
}
