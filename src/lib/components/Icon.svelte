<script lang="ts">
	export let icon: string
	export let width: number | null

	let Icon: any
	import(`../../assets/icons/${icon}.svg`).then((data) => {
		Icon = data.default
	})
</script>

{#if Icon}
	<Icon {width} />
{/if}
