<script lang="ts">
	import GAME_STATES from '~/lib/enums/GAME_STATES'
	import WordStore from '~/lib/stores/WordStore'
	import LanguageStore from '~/lib/stores/LanguageStore'
	import { gameState } from '~/lib/stores/GameStore'
	import { _ } from '~/lib/helpers/i18n'
	import Modal from '~/lib/components/modals/Modal.svelte'
	import shareGameResult from '~/lib/helpers/shareGameResult'
	import { Link, useLocation } from 'svelte-navigator'
	import { base64Encode } from '~/lib/helpers/base64ForUrls'

	$: word = WordStore.word

	const location = useLocation()

	$: isInDailyWord = $location.pathname === '/play-daily'
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

		<button class="btn btn-outline" on:click={() => shareGameResult()}
			>{$_('game_finished.share')}</button
		>

		<Link
			class="btn btn-fill"
			to={`/play/${base64Encode(LanguageStore.generateRandomWord())}`}
			>{isInDailyWord
				? $_('game_finished.play_random_word')
				: $_('game_finished.play_again')}</Link
		>

		<Link class="btn btn-fill" to="/">{$_('game_finished.back_to_menu')}</Link>
	</Modal>
{/if}
