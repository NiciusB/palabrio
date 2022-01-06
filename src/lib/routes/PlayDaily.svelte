<script lang="ts">
	import Game from '~/lib/components/Game.svelte'
	import LanguageStore from '~/lib/stores/LanguageStore'
	import WordStore from '~/lib/stores/WordStore'
	import seedrandom from 'seedrandom'
	import getDailyWordInfo from '~/lib/helpers/getDailyWordInfo'
	import { newGame } from '~/lib/stores/GameStore'

	let loadingPromise: Promise<any>
	$: {
		const dailyWordInfo = getDailyWordInfo()
		loadingPromise = newGame(5).then(() => {
			WordStore.setWord(
				LanguageStore.generateRandomWord(
					seedrandom(`S${dailyWordInfo.season} D${dailyWordInfo.day}`)
				)
			)
		})
	}
</script>

{#await loadingPromise}
	<!-- loading  -->
{:then}
	<Game />
{/await}
