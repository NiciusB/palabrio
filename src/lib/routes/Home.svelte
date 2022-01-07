<script lang="ts">
	import { Link, navigate } from 'svelte-navigator'
	import { get } from 'svelte/store'
	import DictionaryLanguageSelector from '~/lib/components/DictionaryLanguageSelector.svelte'
	import SelfManagedHelpModal from '~/lib/components/modals/SelfManagedHelpModal.svelte'
	import { base64Encode } from '~/lib/helpers/base64ForUrls'
	import { DAILY_WORD_LETTERS } from '~/lib/helpers/generateDailyRandomWord'
	import generateLinkRandomWord from '~/lib/helpers/generateLinkRandomWord'
	import getDailyWordInfo from '~/lib/helpers/getDailyWordInfo'
	import { _ } from '~/lib/helpers/i18n'
	import LanguageStore from '~/lib/stores/LanguageStore'
	import PalabrioLogo from '../components/PalabrioLogo.svelte'

	let lang = get(LanguageStore.dictionaryLanguage)

	const dailyWordInfo = getDailyWordInfo()

	let loadingDaily = false
	let loadingRandom = false

	async function playDailyClicked() {
		loadingDaily = true
		try {
			await LanguageStore.loadDictionary(DAILY_WORD_LETTERS, lang)
		} finally {
			loadingDaily = false
		}

		navigate('/play-daily')
	}

	async function playRandomClicked() {
		loadingRandom = true
		try {
			await LanguageStore.loadDictionary(5, lang)
		} finally {
			loadingRandom = false
		}

		navigate(generateLinkRandomWord(LanguageStore.generateRandomWord(), lang))
	}

	async function playInfiniteClicked() {
		navigate(`/play-infinite`)
	}
</script>

<main>
	<nav>
		<h1><PalabrioLogo /></h1>

		<DictionaryLanguageSelector
			{lang}
			on:change={(event) => (lang = event.detail)}
		/>

		<br />

		<button
			class="menu-link btn btn-fill btn-padding-l"
			on:click={playDailyClicked}
			disabled={loadingDaily}
			>{$_('home.play_daily_word')}
			<span class="badge-season-day"
				>{$_('season_day_short', {
					values: { season: dailyWordInfo.season, day: dailyWordInfo.day },
				})}</span
			>
		</button>

		<button
			disabled={loadingRandom}
			class="menu-link btn btn-fill btn-padding-l"
			on:click={playRandomClicked}>{$_('home.play_random_word')}</button
		>

		<button
			class="menu-link btn btn-fill btn-padding-l"
			on:click={playInfiniteClicked}>{$_('home.play_infinite_mode')}</button
		>

		<SelfManagedHelpModal />
	</nav>

	<footer>
		<a target="_blank" href="https://twitter.com/Balbonator"
			>{$_('home.contact')}</a
		>
		<a target="_blank" href="https://github.com/NiciusB/palabrio"
			>{$_('home.code')}</a
		>
		<Link to="/licenses">{$_('home.licenses')}</Link>
	</footer>
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

	footer {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 1rem;
	}
</style>
