<script lang="ts">
	import HelpModal from '~/lib/components/modals/HelpModal.svelte'
	import { _ } from '~/lib/helpers/i18n'
	import { storageGet, storageSet } from '~/lib/helpers/storage'

	const helpModalLastClosed = storageGet('help_modal_last_closed', null)
	let isHelpModalOpen = !helpModalLastClosed

	export function open() {
		isHelpModalOpen = true
	}

	$: {
		if (!isHelpModalOpen) {
			storageSet('help_modal_last_closed', Math.floor(Date.now() / 1000))
		}
	}
</script>

{#if isHelpModalOpen}
	<HelpModal on:close={() => (isHelpModalOpen = false)} />
{/if}
