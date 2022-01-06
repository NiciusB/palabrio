const DAYS_PER_SEASON = 90

export default function getDailyWordInfo() {
	const unixToday = Math.floor(Date.now() / 1000 / 60 / 60 / 24) - 18995
	const season = Math.ceil(unixToday / DAYS_PER_SEASON)
	const day = unixToday - (season - 1) * DAYS_PER_SEASON

	return {
		season,
		day,
	}
}
