<script lang="ts">
	import { _ } from 'svelte-i18n'
	import { navigate } from 'svelte-navigator'
	import { get } from 'svelte/store'
	import generateLinkRandomWord from '~/lib/helpers/generateLinkRandomWord'
	import LanguageStore from '~/lib/stores/LanguageStore'

	LanguageStore.loadDictionary(5).then(() => {
		navigate(
			generateLinkRandomWord(
				LanguageStore.generateRandomWord(),
				get(LanguageStore.dictionaryLanguage)
			),
			{ replace: true }
		)
	})
</script>
