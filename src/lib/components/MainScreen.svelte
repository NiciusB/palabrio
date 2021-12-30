<script lang="ts">
	import Board from '~/lib/components/Board.svelte'
	import Header from '~/lib/components/Header.svelte'
	import Keyboard from '~/lib/components/Keyboard.svelte'
</script>

<main>
	<Header />
	<Board />
	<Keyboard />
</main>

<style>
	main {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		user-select: none;
	}
</style>
