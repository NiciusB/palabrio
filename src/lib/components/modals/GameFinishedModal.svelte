<script lang="ts">
	import GAME_STATES from '~/lib/enums/GAME_STATES'
	import WordStore from '~/lib/stores/WordStore'
	import { COLUMNS, gameState, ROWS } from '~/lib/stores/GameStore'
	import { _ } from '~/lib/helpers/i18n'
	import { get } from 'svelte/store'
	import { getLetterGuessStateFromGuess } from '~/lib/helpers/getLetterGuessState'
	import LETTER_GUESS_STATES from '~/lib/enums/LETTER_GUESS_STATES'
	import Modal from '~/lib/components/modals/Modal.svelte'

	function sharePressed() {
		const word = get(WordStore.word)
		const pastGuesses = get(WordStore.pastGuesses)
		function guessToEmojis(guess: string): string {
			let result = ''
			for (let column = 0; column < get(COLUMNS); column++) {
				result =
					result +
					{
						[LETTER_GUESS_STATES.NOT_REVEALED]: '',
						[LETTER_GUESS_STATES.REVEALED_NO_MATCH]: '⬛',
						[LETTER_GUESS_STATES.REVEALED_INCORRECT_PLACE]: '🟨',
						[LETTER_GUESS_STATES.REVEALED_CORRECT]: '🟩',
					}[getLetterGuessStateFromGuess(word, guess, column)]
			}

			return result
		}

		const tries =
			get(gameState) === GAME_STATES.WON
				? `${pastGuesses.length}/${get(ROWS)}`
				: `X/${get(ROWS)}`

		const board = pastGuesses.map((guess) => guessToEmojis(guess)).join('\n')

		navigator.share({
			title: 'Palabrio',
			text: encodeURIComponent(
				`Palabrio ${tries}\n${board}\n${window.location.href}`
			),
			url: '',
		})
	}

	$: word = WordStore.word
</script>

{#if $gameState !== GAME_STATES.IN_PROGRESS}
	<Modal>
		<h2>
			{$_(
				$gameState === GAME_STATES.WON
					? 'game_finished.won'
					: 'game_finished.lost'
			)}
		</h2>

		<p>{$_('game_finished.the_word_was_x', { values: { x: $word } })}</p>

		<button class="btn btn-outline" on:click={sharePressed}
			>{$_('game_finished.share')}</button
		>

		<button class="btn btn-fill" on:click={WordStore.generateWord}
			>{$_('game_finished.play_again')}</button
		>
	</Modal>
{/if}
