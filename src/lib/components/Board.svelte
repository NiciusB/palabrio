<script lang="ts">
	import BoardTile from '~/lib/components/BoardTile.svelte'
	import Alerts from '~/lib/ui/alerts/components/Alerts.svelte'
	import GameFinishedModal from '~/lib/components/modals/GameFinishedModal.svelte'
	import { ROWS, COLUMNS } from '~/lib/stores/GameStore'
	import { isLanguageRTL } from '~/lib/helpers/utils'
	import LanguageStore from '~/lib/stores/LanguageStore'

	$: lang = LanguageStore.dictionaryLanguage
	$: rowsArr = new Array($ROWS).fill(null)
	$: columnsArr = new Array($COLUMNS).fill(null)
</script>

<div class="container">
	<article
		dir={isLanguageRTL($lang) ? 'rtl' : 'ltr'}
		style="--num-columns: {$COLUMNS};"
	>
		{#each rowsArr as _, row}
			{#each columnsArr as _, column}
				<BoardTile {row} {column} />
			{/each}
		{/each}
	</article>
	<Alerts />
	<GameFinishedModal />
</div>

<style>
	.container {
		position: relative;
	}

	article {
		display: grid;
		grid-template-columns: repeat(var(--num-columns), 1fr);
		gap: 0.5rem;
		user-select: none;
	}
</style>
