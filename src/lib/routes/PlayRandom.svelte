<script lang="ts">
	import { _ } from 'svelte-i18n'
	import { navigate, useParams } from 'svelte-navigator'
	import { get } from 'svelte/store'
	import Game from '~/lib/components/Game.svelte'
	import GAME_STATES from '~/lib/enums/GAME_STATES'
	import { base64Decode } from '~/lib/helpers/base64ForUrls'
	import generateLinkRandomWord from '~/lib/helpers/generateLinkRandomWord'
	import shareGameResult from '~/lib/helpers/shareGameResult'
	import { gameState } from '~/lib/stores/GameStore'
	import LanguageStore from '~/lib/stores/LanguageStore'
	import WordStore from '~/lib/stores/WordStore'

	const params = useParams()
	let loadingPromise: Promise<any> = new Promise(() => {})
	$: {
		try {
			const playRandomWordData = base64Decode(
				$params.encodedData
			) as PlayRandomWordData

			loadingPromise = LanguageStore.loadDictionary(
				playRandomWordData.word.length,
				playRandomWordData.lang
			).then(() => {
				WordStore.setWord(playRandomWordData.word)
			})
		} catch (error) {
			console.error('Invalid encoded data: ' + error)
			navigate('/')
		}
	}

	function playAgainClicked() {
		navigate(
			generateLinkRandomWord(
				LanguageStore.generateRandomWord(),
				get(LanguageStore.dictionaryLanguage)
			)
		)
	}

	function shareClicked() {
		const didWin = $gameState === GAME_STATES.WON
		const triesCount = get(WordStore.pastGuesses).length

		const guessResultText = didWin
			? $_('share_game_results.i_guessed_the_word_in_n_tries', {
					values: { n: triesCount },
			  })
			: $_('share_game_results.i_couldnt_guess_the_word')

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

			<button on:click={playAgainClicked} class="btn btn-fill"
				>{$_('game_finished.play_again')}</button
			>
		</svelte:fragment>
	</Game>
{/await}
