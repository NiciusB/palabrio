<script lang="ts">
	import { navigate, useParams } from 'svelte-navigator'
	import { get } from 'svelte/store'
	import { base64Decode, base64Encode } from '~/lib/helpers/base64ForUrls'
	import LanguageStore from '~/lib/stores/LanguageStore'

	// Deprecated endpoint, just redirect to the new one

	const params = useParams()

	const word = base64Decode($params.encodedWord, false) as string

	const randomData: PlayRandomWordData = {
		word,
		lang: get(LanguageStore.dictionaryLanguage),
	}

	navigate(`/play-random/${base64Encode(randomData)}`, { replace: true })
</script>
