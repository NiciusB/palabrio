<script lang="ts">
	import { Link } from 'svelte-navigator'
	import DictionaryLanguageSelector from '~/lib/components/DictionaryLanguageSelector.svelte'
	import HelpModal from '~/lib/components/modals/HelpModal.svelte'
	import { base64Encode } from '~/lib/helpers/base64ForUrls'
	import getDailyWordInfo from '~/lib/helpers/getDailyWordInfo'
	import { _ } from '~/lib/helpers/i18n'
	import { storageGet, storageSet } from '~/lib/helpers/storage'
	import LanguageStore from '~/lib/stores/LanguageStore'
	import PalabrioLogo from '../components/PalabrioLogo.svelte'

	const helpModalLastClosed = storageGet('help_modal_last_closed', null)
	let isHelpModalOpen = !helpModalLastClosed
	let encodedWord = ''

	$: {
		if (!isHelpModalOpen) {
			storageSet('help_modal_last_closed', Math.floor(Date.now() / 1000))
		}
	}

	$: dictionaryLanguage = LanguageStore.dictionaryLanguage
	$: {
		$dictionaryLanguage
		encodedWord = base64Encode(LanguageStore.generateRandomWord())
	}

	const dailyWordInfo = getDailyWordInfo()
</script>

<main>
	<nav>
		<h1><PalabrioLogo /></h1>

		<DictionaryLanguageSelector />

		<Link class="menu-link btn btn-fill btn-padding-l" to={`/play-daily`}
			>{$_('home.play_daily_word')}
			<span class="badge-season-day"
				>S{dailyWordInfo.season} D{dailyWordInfo.day}</span
			>
		</Link>

		<Link
			class="menu-link btn btn-fill btn-padding-l"
			to={`/play/${encodedWord}`}>{$_('home.play_random_word')}</Link
		>

		{#if isHelpModalOpen}
			<HelpModal on:close={() => (isHelpModalOpen = false)} />
		{/if}
	</nav>

	<a target="_blank" href="https://twitter.com/Balbonator"
		>{$_('home.contact')}</a
	>
</main>

<style lang="scss">
	main {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		gap: 2rem;
		padding: 2rem 1rem;
		min-height: calc(var(--vh, 1vh) * 100);
	}

	nav {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;

		h1 {
			font-size: 4rem;
		}

		> :global(.menu-link) {
			position: relative;
			font-size: 1.1rem;
		}
	}

	.badge-season-day {
		position: absolute;
		top: 0;
		right: 0;
		transform: translate(70%, -50%);
		border-radius: 4px;
		background: #6465db;
		padding: 0.3rem 0.5rem;
		box-shadow: 0.5px 0.5px 2px rgba(0, 0, 0, 0.036),
			1.6px 1.6px 6.7px rgba(0, 0, 0, 0.054), 7px 7px 30px rgba(0, 0, 0, 0.09);
	}
</style>
