<script lang="ts">
	import Board from '~/lib/components/Board.svelte'
	import Header from '~/lib/components/Header.svelte'
	import Keyboard from '~/lib/components/Keyboard.svelte'
	import { i18nInitialLoadProimse } from '~/lib/helpers/i18n'
</script>

<main>
	{#await i18nInitialLoadProimse}
		<!-- loading  -->
	{:then}
		<Header />
		<Board />
		<Keyboard />
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
