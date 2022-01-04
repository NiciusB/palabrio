export default function getDailyWordInfo() {
	const unixToday = Math.floor(Date.now() / 1000 / 60 / 60 / 24) - 18995

	return {
		season: 1,
		day: unixToday,
	}
}
