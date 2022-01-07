<script lang="ts">
	import { Link } from 'svelte-navigator'
	import { get } from 'svelte/store'
	import Game from '~/lib/components/Game.svelte'
	import GAME_STATES from '~/lib/enums/GAME_STATES'
	import generateDailyRandomWord from '~/lib/helpers/generateDailyRandomWord'
	import getDailyWordInfo from '~/lib/helpers/getDailyWordInfo'
	import { _ } from '~/lib/helpers/i18n'
	import shareGameResult from '~/lib/helpers/shareGameResult'
	import { gameState } from '~/lib/stores/GameStore'
	import WordStore from '~/lib/stores/WordStore'

	let loadingPromise: Promise<any> = new Promise(() => {})
	$: {
		loadingPromise = generateDailyRandomWord()
	}

	function shareClicked() {
		const didWin = $gameState === GAME_STATES.WON
		const triesCount = get(WordStore.pastGuesses).length

		let guessResultText = didWin
			? $_('share_game_results.i_guessed_the_daily_word_in_n_tries', {
					values: { n: triesCount },
			  })
			: $_('share_game_results.i_couldnt_guess_the_daily_word')

		const dailyWordInfo = getDailyWordInfo()
		const seasonDayShort = $_('season_day_short', {
			values: { season: dailyWordInfo.season, day: dailyWordInfo.day },
		})

		guessResultText = guessResultText + ' — ' + seasonDayShort

		shareGameResult(guessResultText, window.location.href)
	}
</script>

{#await loadingPromise}
	<!-- loading  -->
{:then}
	<Game>
		<svelte:fragment slot="gameFinishedModal-buttons">
			<button class="btn btn-outline" on:click={shareClicked}
				>{$_('game_finished.share')}</button
			>

			<Link class="btn btn-fill" to={`/play-random`}
				>{$_('game_finished.play_random_word')}</Link
			>
		</svelte:fragment>
	</Game>
{/await}
