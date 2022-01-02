<script lang="ts">
	function animateOutContainer(_: any, { delay = 0, duration = 360 }) {
		return {
			delay,
			duration,
			css: (t: number) => `opacity: ${t};`,
		}
	}
	function animateOutContent(_: any, { delay = 0, duration = 360 }) {
		return {
			delay,
			duration,
			css: (t: number) => `opacity: ${t}; transform: scale(${t * 0.2 + 0.8});`,
		}
	}
</script>

<div
	class="modal-container"
	role="alert"
	aria-live="assertive"
	aria-atomic="true"
	out:animateOutContainer
>
	<div class="modal-content" out:animateOutContent>
		<slot />
	</div>
</div>

<style lang="scss">
	.modal-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.2);
		backdrop-filter: blur(2px);
		display: flex;
		align-items: center;
		justify-content: center;
		animation: animate-in-container 360ms forwards;
	}

	.modal-content {
		max-height: 80vh;
		max-width: 90vw;
		overflow: auto;
		overscroll-behavior: contain;
		background-color: var(--alert-bg);
		color: var(--alert-text-color);
		padding: 1rem;
		border-radius: 0.2rem;
		text-align: center;
		font-size: 1.2rem;
		animation: animate-in-content 360ms forwards;
	}

	@keyframes animate-in-container {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	@keyframes animate-in-content {
		0% {
			opacity: 0;
			transform: scale(0.8);
		}
		100% {
			opacity: 1;
		}
	}
</style>
