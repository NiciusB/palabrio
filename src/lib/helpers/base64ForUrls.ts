export function base64Encode(string: string): string {
	return btoa(string).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}
export function base64Decode(string: string): string {
	return atob(string).replace(/-/g, '+').replace(/_/g, '/')
}
