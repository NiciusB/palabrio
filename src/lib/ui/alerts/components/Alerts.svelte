<script lang="ts">
	import AlertStore from '../stores/AlertStore'
	import Alert from './Alert.svelte'

	$: alerts = AlertStore.alerts
</script>

<div class="alerts">
	{#each $alerts as alert (alert.id)}
		<Alert {alert} />
	{/each}
</div>

<style>
	.alerts {
		position: absolute;
		touch-action: none;
		width: 100%;
		text-align: center;
		top: -2rem;
	}
</style>
