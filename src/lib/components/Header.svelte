<script lang="ts">
	import LanguageStore from '~/lib/stores/LanguageStore'

	$: lang = LanguageStore.dictionaryLanguage
</script>

<header>
	<h1>Palabrio</h1>

	<select
		value={$lang}
		on:change={(e) =>
			LanguageStore.setDictionaryLanguage(e.currentTarget.value)}
	>
		{#each LanguageStore.dictionaryLanguagesList as code}
			<option value={code}>
				{LanguageStore.getLanguageName(code)}
			</option>
		{/each}
	</select>
</header>

<style>
	header {
		text-align: center;
		padding: 1em;
		padding-inline-start: 2rem;
		width: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	h1 {
		font-size: 48px;
		font-weight: 800;
		color: white;
		background: linear-gradient(45deg, #12c2e9, #c471ed, #f64f59);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		margin: 0;
	}

	select {
		float: right;
		width: 6rem;
	}
</style>
