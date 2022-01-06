<script lang="ts">
	import 'normalize.css'
	import '~/assets/css/global.scss'
	import setGlobalCssVariables from '~/lib/helpers/setGlobalCssVariables'
	import setupKeyboardListener from '~/lib/helpers/setupKeyboardListener'
	import '~/lib/helpers/i18n'
	import { Router, Route } from 'svelte-navigator'
	import Home from '~/lib/routes/Home.svelte'
	import Play from '~/lib/routes/Play.svelte'
	import { i18nInitialLoadProimse } from '~/lib/helpers/i18n'
	import { initialDictionaryLoadPromise } from '~/lib/stores/LanguageStore'
	import PlayDaily from '~/lib/routes/PlayDaily.svelte'
	import lastInteractionForFocusVisibility from '~/lib/helpers/lastInteractionForFocusVisibility'

	lastInteractionForFocusVisibility()
	setupKeyboardListener()
	setGlobalCssVariables()
</script>

{#await Promise.all([initialDictionaryLoadPromise, i18nInitialLoadProimse])}
	<!-- loading  -->
{:then}
	<Router>
		<Route path="/">
			<Home />
		</Route>
		<Route path="play/:encodedWord" component={Play} />
		<Route path="play-daily" component={PlayDaily} />
	</Router>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
