function logEvent(event: string, data?: object) {
	// @ts-ignore
	window.gtag('event', event, data)
}

const telemetry = {
	logEvent,
}

export default telemetry
