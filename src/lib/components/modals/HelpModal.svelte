<script lang="ts">
	import { ROWS } from '~/lib/stores/GameStore'
	import { _ } from '~/lib/helpers/i18n'
	import { createEventDispatcher } from 'svelte'
	import BoardTileUi from '~/lib/components/BoardTileUi.svelte'
	import LETTER_GUESS_STATES from '~/lib/enums/LETTER_GUESS_STATES'
	import Modal from '~/lib/ui/Modal.svelte'
	import PalabrioLogo from '~/lib/components/PalabrioLogo.svelte'

	const dispatch = createEventDispatcher()

	function closeModal() {
		dispatch('close')
	}
</script>

<Modal on:backgroundClicked={closeModal}>
	<h1><PalabrioLogo /></h1>

	<p>
		{$_('help_modal.guess_the_word', { values: { n: $ROWS } })}
	</p>
	<p>
		{$_('help_modal.after_each_guess_the_color_will_change')}
	</p>

	<p>
		{$_('help_modal.the_letter_x_is_in_the_correct_spot', {
			values: { x: 'Y' },
		})}
	</p>
	<div class="board-tile-container">
		<BoardTileUi
			letter="Y"
			state={LETTER_GUESS_STATES.REVEALED_CORRECT}
			shouldAnimateNoLetter={false}
		/>
		<BoardTileUi
			letter="A"
			state={LETTER_GUESS_STATES.REVEALED_NO_MATCH}
			shouldAnimateNoLetter={false}
		/>
		<BoardTileUi
			letter="S"
			state={LETTER_GUESS_STATES.REVEALED_NO_MATCH}
			shouldAnimateNoLetter={false}
		/>
	</div>

	<p>
		{$_('help_modal.the_letter_x_is_in_the_word_but_incorrect_spot', {
			values: { x: 'Y' },
		})}
	</p>
	<div class="board-tile-container">
		<BoardTileUi
			letter="Y"
			state={LETTER_GUESS_STATES.REVEALED_INCORRECT_PLACE}
			shouldAnimateNoLetter={false}
		/>
		<BoardTileUi
			letter="A"
			state={LETTER_GUESS_STATES.REVEALED_NO_MATCH}
			shouldAnimateNoLetter={false}
		/>
		<BoardTileUi
			letter="S"
			state={LETTER_GUESS_STATES.REVEALED_NO_MATCH}
			shouldAnimateNoLetter={false}
		/>
	</div>

	<p>
		{$_('help_modal.the_letter_x_is_not_in_the_word', {
			values: { x: 'Y' },
		})}
	</p>
	<div class="board-tile-container">
		<BoardTileUi
			letter="Y"
			state={LETTER_GUESS_STATES.REVEALED_NO_MATCH}
			shouldAnimateNoLetter={false}
		/>
		<BoardTileUi
			letter="A"
			state={LETTER_GUESS_STATES.REVEALED_NO_MATCH}
			shouldAnimateNoLetter={false}
		/>
		<BoardTileUi
			letter="S"
			state={LETTER_GUESS_STATES.REVEALED_NO_MATCH}
			shouldAnimateNoLetter={false}
		/>
	</div>

	<p>
		{@html $_('help_modal.palabrio_is_a_clone', {
			values: {
				clonedName:
					'<a href="https://www.powerlanguage.co.uk/wordle/" target="_blank">Wordle</a>',
			},
		})}
	</p>

	<button class="btn btn-fill" on:click={closeModal}
		>{$_('help_modal.ok')}</button
	>
</Modal>

<style lang="scss">
	.board-tile-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 0.5rem;
		margin-block-end: 1rem;
	}

	h1 {
		font-size: 4rem;
	}
</style>
