<script lang="ts">
	import { useParams } from 'svelte-navigator'
	import Game from '~/lib/components/Game.svelte'
	import { base64Decode } from '~/lib/helpers/base64ForUrls'
	import { newGame } from '~/lib/stores/GameStore'
	import WordStore from '~/lib/stores/WordStore'

	const params = useParams()
	let loadingPromise: Promise<any>
	$: {
		loadingPromise = newGame(5).then(() => {
			WordStore.setWord(base64Decode($params.encodedWord))
		})
	}
</script>

{#await loadingPromise}
	<!-- loading  -->
{:then}
	<Game />
{/await}
