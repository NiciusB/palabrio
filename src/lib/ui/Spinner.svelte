<div class="spinner" />

<style lang="scss">
	.spinner {
		border: 4px solid rgba(0, 0, 0, 0.1);
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		border-left-color: #09f;
		margin: 0.5rem auto;
		animation: spin 1s ease infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
</style>
