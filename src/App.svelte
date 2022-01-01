<script lang="ts">
	import 'normalize.css'
	import '~/assets/css/global.css'
	import MainScreen from '~/lib/components/MainScreen.svelte'
	import setGlobalCssVariables from '~/lib/helpers/setGlobalCssVariables'
	import setupKeyboardListener from '~/lib/helpers/setupKeyboardListener'
	import '~/lib/helpers/i18n'

	setupKeyboardListener()
	setGlobalCssVariables()
</script>

<MainScreen />
