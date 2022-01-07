<script lang="ts">
	import GAME_STATES from '~/lib/enums/GAME_STATES'
	import WordStore from '~/lib/stores/WordStore'
	import { gameState } from '~/lib/stores/GameStore'
	import { _ } from '~/lib/helpers/i18n'
	import Modal from '~/lib/components/modals/Modal.svelte'
	import { Link } from 'svelte-navigator'

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

		<slot name="buttons" />

		<Link class="btn btn-fill" to="/">{$_('game_finished.back_to_menu')}</Link>
	</Modal>
{/if}
