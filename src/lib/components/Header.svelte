<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import PalabrioLogo from '~/lib/components/PalabrioLogo.svelte'
	import { _ } from '~/lib/helpers/i18n'
	import LanguageStore from '~/lib/stores/LanguageStore'
	const dispatch = createEventDispatcher()

	$: lang = LanguageStore.dictionaryLanguage
</script>

<header>
	<h1><PalabrioLogo /></h1>

	<div class="right-side">
		<!-- svelte-ignore a11y-invalid-attribute -->
		<a href="javascript: void 0;" on:click={() => dispatch('openHelpModal')}
			>{$_('header.help')}</a
		>

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
	</div>
</header>

<style>
	header {
		text-align: center;
		padding: 1em;
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
	}

	select {
		float: right;
		width: 6rem;
	}

	.right-side {
		flex-shrink: 1;
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
		flex-wrap: wrap-reverse;
		align-items: center;
	}
</style>
