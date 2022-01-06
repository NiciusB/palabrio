<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import LanguageStore from '~/lib/stores/LanguageStore'

	const dispatch = createEventDispatcher()

	export let lang: string
</script>

<select
	class={$$props.class}
	value={lang}
	on:change={(e) => dispatch('change', e.currentTarget.value)}
>
	{#each Array.from(LanguageStore.dictionaryLanguagesList) as code}
		<option value={code}>
			{LanguageStore.getLanguageName(code)}
		</option>
	{/each}
</select>
