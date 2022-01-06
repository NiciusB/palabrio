<script lang="ts">
	import LanguageStore from '~/lib/stores/LanguageStore'

	$: lang = LanguageStore.dictionaryLanguage
</script>

<select
	class={$$props.class}
	value={$lang}
	on:change={(e) => LanguageStore.setDictionaryLanguage(e.currentTarget.value)}
>
	{#each Array.from(LanguageStore.dictionaryLanguagesList) as code}
		<option value={code}>
			{LanguageStore.getLanguageName(code)}
		</option>
	{/each}
</select>
