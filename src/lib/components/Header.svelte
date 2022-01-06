<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import PalabrioLogo from '~/lib/components/PalabrioLogo.svelte'
	import { _ } from '~/lib/helpers/i18n'
	import { Link } from 'svelte-navigator'
	import LanguageStore from '~/lib/stores/LanguageStore'
	const dispatch = createEventDispatcher()

	$: dictionaryLanguage = LanguageStore.dictionaryLanguage
</script>

<header>
	<Link to="/"><h1><PalabrioLogo /></h1></Link>

	<div class="right-side">
		<!-- svelte-ignore a11y-invalid-attribute -->
		<a href="javascript: void 0;" on:click={() => dispatch('openHelpModal')}
			>{$_('header.help')}</a
		>
		<span>{LanguageStore.getLanguageName($dictionaryLanguage)}</span>
	</div>
</header>

<style lang="scss">
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

	.right-side {
		flex-shrink: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		flex-wrap: wrap-reverse;
		align-items: center;
	}
</style>
