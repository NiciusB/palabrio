<script lang="ts">
	import GAME_STATES from '~/lib/enums/GAME_STATES'
	import WordStore from '~/lib/stores/WordStore'
	import { gameState } from '~/lib/stores/GameStore'
	import { _ } from '~/lib/helpers/i18n'

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

		<button on:click={WordStore.generateWord}
			>{$_('game_finished.play_again')}</button
		>
	</div>
{/if}

<style>
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
		background: var(--key-no-match-bg);
		color: var(--key-text-color);
		border-radius: 0.2rem;
		border: 0;
		cursor: pointer;
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
