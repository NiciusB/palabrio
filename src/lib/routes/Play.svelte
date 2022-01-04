<script lang="ts">
	import { useParams } from 'svelte-navigator'
	import Game from '~/lib/components/Game.svelte'
	import { base64Decode } from '~/lib/helpers/base64ForUrls'
	import WordStore from '~/lib/stores/WordStore'

	const params = useParams()
	$: {
		WordStore.setWord(base64Decode($params.encodedWord))
	}
</script>

<main>
	<Game />
</main>
