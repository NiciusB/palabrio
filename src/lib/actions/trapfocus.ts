import trapFocus from '~/lib/helpers/trapFocus'

export default function trapfocus(node: HTMLElement) {
	const destroyCallback = trapFocus(node)

	return {
		destroy() {
			destroyCallback()
		},
	}
}
