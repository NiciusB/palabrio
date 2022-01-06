<script lang="ts">
	import { navigate, useParams } from 'svelte-navigator'
	import Game from '~/lib/components/Game.svelte'
	import { base64Decode } from '~/lib/helpers/base64ForUrls'
	import LanguageStore from '~/lib/stores/LanguageStore'
	import WordStore from '~/lib/stores/WordStore'

	const params = useParams()
	let loadingPromise: Promise<any> = new Promise(() => {})
	$: {
		try {
			const playRandomWordData = base64Decode(
				$params.encodedData
			) as PlayRandomWordData

			loadingPromise = LanguageStore.loadDictionary(
				playRandomWordData.word.length,
				playRandomWordData.lang
			).then(() => {
				WordStore.setWord(playRandomWordData.word)
			})
		} catch (error) {
			console.error('Invalid encoded data: ' + error)
			navigate('/')
		}
	}
</script>

{#await loadingPromise}
	<!-- loading  -->
{:then}
	<Game />
{/await}
