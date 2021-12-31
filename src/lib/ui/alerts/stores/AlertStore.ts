import { writable } from 'svelte/store'
import { convertWritableToReadable } from '~/lib/helpers/utils'

const alerts = writable([] as Alert[])

function removeAlert(id: string) {
	alerts.update((alerts) => {
		return alerts.filter((alert) => alert.id !== id)
	})
}

function addAlert(message: string) {
	const newAlert = {
		id: Math.random().toString().slice(2),
		message,
		timeout: 2000,
	}
	alerts.update((alerts) => {
		return [...alerts, newAlert]
	})

	setTimeout(() => {
		removeAlert(newAlert.id)
	}, newAlert.timeout)
}

export default {
	alerts: convertWritableToReadable(alerts),
	addAlert,
	removeAlert,
}
