<script lang="ts">
	export let alert: Alert

	function animateOut(_: any, { delay = 0, duration = 360 }) {
		return {
			delay,
			duration,
			css: (t: number) => `opacity: ${t}; transform: scale(${t * 0.2 + 0.8});`,
		}
	}
</script>

<div
	class="toast"
	role="alert"
	aria-live="assertive"
	aria-atomic="true"
	out:animateOut|local
>
	{alert.message}
</div>

<style>
	.toast {
		display: inline-block;
		margin: auto;
		margin-bottom: 1rem;
		animation: animate-in 360ms forwards;
		background-color: var(--alert-bg);
		color: var(--alert-text-color);
		padding: 1rem;
		font-weight: bold;
		border-radius: 0.2rem;
		backdrop-filter: blur(1px);
	}

	@keyframes animate-in {
		0% {
			opacity: 0;
			transform: scale(0.8);
		}
		100% {
			opacity: 1;
		}
	}
</style>
