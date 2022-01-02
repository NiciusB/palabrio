<script lang="ts">
	import Board from '~/lib/components/Board.svelte'
	import Header from '~/lib/components/Header.svelte'
	import Keyboard from '~/lib/components/Keyboard.svelte'
	import HelpModal from '~/lib/components/modals/HelpModal.svelte'
	import { i18nInitialLoadProimse } from '~/lib/helpers/i18n'
	import { storageGet, storageSet } from '~/lib/helpers/storage'

	const helpModalLastClosed = storageGet('help_modal_last_closed', null)
	let isHelpModalOpen = !helpModalLastClosed

	$: {
		if (!isHelpModalOpen) {
			storageSet('help_modal_last_closed', Math.floor(Date.now() / 1000))
		}
	}
</script>

<main>
	{#await i18nInitialLoadProimse}
		<!-- loading  -->
	{:then}
		<Header on:openHelpModal={() => (isHelpModalOpen = true)} />
		<Board />
		<Keyboard />
		{#if isHelpModalOpen}
			<HelpModal on:close={() => (isHelpModalOpen = false)} />
		{/if}
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</main>

<style>
	main {
		min-height: calc(var(--vh, 1vh) * 100);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		user-select: none;
		max-width: 768px;
		margin: 0 auto;
	}
</style>
