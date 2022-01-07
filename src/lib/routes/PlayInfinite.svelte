<script lang="ts">
	import { _ } from 'svelte-i18n'
	import { get } from 'svelte/store'
	import Game from '~/lib/components/Game.svelte'
	import GAME_STATES from '~/lib/enums/GAME_STATES'
	import { base64Encode } from '~/lib/helpers/base64ForUrls'
	import generateInfiniteWord from '~/lib/helpers/generateInfiniteWord'
	import generateLinkRandomWord from '~/lib/helpers/generateLinkRandomWord'
	import shareGameResult from '~/lib/helpers/shareGameResult'
	import { gameState } from '~/lib/stores/GameStore'
	import LanguageStore from '~/lib/stores/LanguageStore'
	import WordStore from '~/lib/stores/WordStore'

	let round = 1

	let loadingPromise: Promise<any> = new Promise(() => {})
	$: {
		loadingPromise = generateInfiniteWord(round)
	}

	function nextWordClicked() {
		round++
		generateInfiniteWord(round)
	}
	function playAgainClicked() {
		round = 1
		generateInfiniteWord(round)
	}

	function shareClicked() {
		const didWin = $gameState === GAME_STATES.WON
		const triesCount = get(WordStore.pastGuesses).length

		const guessResultText = didWin
			? $_('share_game_results.i_guessed_the_word_in_n_tries', {
					values: { n: triesCount },
			  })
			: $_('share_game_results.i_couldnt_guess_the_word')

		shareGameResult(
			guessResultText,
			window.location.origin +
				generateLinkRandomWord(
					get(WordStore.word),
					get(LanguageStore.dictionaryLanguage)
				)
		)
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

			{#if $gameState === GAME_STATES.WON}
				<button on:click={nextWordClicked} class="btn btn-fill"
					>{$_('game_finished.infinite.next')}</button
				>
			{:else}
				<button on:click={playAgainClicked} class="btn btn-fill"
					>{$_('game_finished.play_again')}</button
				>
			{/if}
		</svelte:fragment>

		<span slot="gameHeader-rightSideAfter">
			{$_('game.infinite.round_n', { values: { n: round } })}
		</span>
	</Game>
{/await}
