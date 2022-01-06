<script lang="ts">
	import Board from '~/lib/components/Board.svelte'
	import Header from '~/lib/components/Header.svelte'
	import Keyboard from '~/lib/components/Keyboard.svelte'
	import SelfManagedHelpModal from '~/lib/components/modals/SelfManagedHelpModal.svelte'

	let openHelpModal: () => void
</script>

<main>
	<Header on:openHelpModal={openHelpModal} />
	<Board />
	<Keyboard />
	<SelfManagedHelpModal bind:open={openHelpModal} />
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
