<script lang="ts">
	import GAME_STATES from '~/lib/enums/GAME_STATES'
	import WordStore from '~/lib/stores/WordStore'
	import { COLUMNS, gameState, ROWS } from '~/lib/stores/GameStore'
	import { _ } from '~/lib/helpers/i18n'
	import { get } from 'svelte/store'
	import { getLetterGuessStateFromGuess } from '~/lib/helpers/getLetterGuessState'
	import LETTER_GUESS_STATES from '~/lib/enums/LETTER_GUESS_STATES'

	function animateOut(_: any, { delay = 0, duration = 360 }) {
		return {
			delay,
			duration,
			css: (t: number) =>
				`opacity: ${t}; transform: translate(-50%, -50%) scale(${
					t * 0.2 + 0.8
				});`,
		}
	}

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
	<div
		class="container"
		role="alert"
		aria-live="assertive"
		aria-atomic="true"
		out:animateOut
	>
		<h2>
			{$_(
				$gameState === GAME_STATES.WON
					? 'game_finished.won'
					: 'game_finished.lost'
			)}
		</h2>

		<p>{$_('game_finished.the_word_was_x', { values: { x: $word } })}</p>

		<button class="outline" on:click={sharePressed}
			>{$_('game_finished.share')}</button
		>

		<button class="fill" on:click={WordStore.generateWord}
			>{$_('game_finished.play_again')}</button
		>
	</div>
{/if}

<style lang="scss">
	.container {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		animation: animate-in 360ms forwards;
		background-color: var(--alert-bg);
		color: var(--alert-text-color);
		padding: 1rem;
		min-width: 70%;
		border-radius: 0.2rem;
		text-align: center;
		font-size: 1.2rem;
		backdrop-filter: blur(1px);
	}

	button {
		padding: 0.5rem 1rem;
		border-radius: 0.2rem;
		cursor: pointer;

		&:not(:last-child) {
			margin-block-end: 1rem;
		}

		&.outline {
			background: transparent;
			color: var(--key-no-match-bg);
			border: 1px solid var(--key-no-match-bg);
		}

		&.fill {
			color: var(--key-text-color);
			background: var(--key-no-match-bg);
			border: 0;
		}
	}

	@keyframes animate-in {
		0% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0.8);
		}
		100% {
			opacity: 1;
		}
	}
</style>
