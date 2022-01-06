<script lang="ts">
	import Game from '~/lib/components/Game.svelte'
	import generateDailyRandomWord from '~/lib/helpers/generateDailyRandomWord'

	let loadingPromise: Promise<any>
	$: {
		loadingPromise = generateDailyRandomWord()
	}
</script>

{#await loadingPromise}
	<!-- loading  -->
{:then}
	<Game />
{/await}
