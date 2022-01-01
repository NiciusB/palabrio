const START_EVENTS: ['pointerdown'] = ['pointerdown']
const END_EVENTS: ['pointerup', 'pointercancel', 'pointerout'] = [
	'pointerup',
	'pointercancel',
	'pointerout',
]

export default function longpress(
	node: HTMLElement,
	{
		timeoutMs = 700,
		repeatMs = 0,
		fireAfterTimeout = true,
		fireInmediatly = false,
	}: {
		timeoutMs?: number
		repeatMs?: number
		fireAfterTimeout?: boolean
		fireInmediatly?: boolean
	} = {}
) {
	const handleStart = (evt: PointerEvent) => {
		if (evt.button === 2) {
			return
		}

		function dispatch() {
			node.dispatchEvent(new CustomEvent('longpress'))
		}

		if (fireInmediatly) {
			dispatch()
		}

		let timeout: NodeJS.Timeout
		let interval: NodeJS.Timeout

		timeout = setTimeout(() => {
			if (fireAfterTimeout && timeoutMs !== 0) {
				dispatch()
			}

			if (repeatMs !== 0) {
				interval = setInterval(() => {
					dispatch()
				}, repeatMs)
			}
		}, timeoutMs ?? 0)

		const cancel = () => {
			clearTimeout(timeout)
			clearInterval(interval)

			END_EVENTS.forEach((eventStr) =>
				node.removeEventListener(eventStr, cancel)
			)
		}

		END_EVENTS.forEach((eventStr) => node.addEventListener(eventStr, cancel))
	}

	START_EVENTS.forEach((eventStr) =>
		node.addEventListener(eventStr, handleStart)
	)

	return {
		destroy() {
			START_EVENTS.forEach((eventStr) =>
				node.removeEventListener(eventStr, handleStart)
			)
		},
	}
}
