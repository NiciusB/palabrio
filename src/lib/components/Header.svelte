<script lang="ts">
	import LanguageManager from '~/lib/LanguageManager'

	$: lang = LanguageManager.dictionaryLanguage
</script>

<header>
	Palabrio

	<select
		value={$lang}
		on:change={(e) =>
			LanguageManager.setDictionaryLanguage(e.currentTarget.value)}
	>
		{#each LanguageManager.dictionaryLanguagesList as code}
			<option value={code}>
				{LanguageManager.getLanguageName(code)}
			</option>
		{/each}
	</select>
</header>

<style>
	header {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}
</style>
