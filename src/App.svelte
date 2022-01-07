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
	import PlayDaily from '~/lib/routes/PlayDaily.svelte'
	import lastInteractionForFocusVisibility from '~/lib/helpers/lastInteractionForFocusVisibility'
	import PlayRandom from '~/lib/routes/PlayRandom.svelte'
	import PlayInfinite from '~/lib/routes/PlayInfinite.svelte'
	import PlayRandomWithoutData from '~/lib/routes/PlayRandomWithoutData.svelte'
	import Licenses from '~/lib/routes/Licenses.svelte'

	lastInteractionForFocusVisibility()
	setupKeyboardListener()
	setGlobalCssVariables()
</script>

{#await Promise.all([i18nInitialLoadProimse])}
	<!-- loading  -->
{:then}
	<Router>
		<Route path="/">
			<Home />
		</Route>
		<Route path="play/:encodedWord" component={Play} />
		<Route path="play-random/:encodedData" component={PlayRandom} />
		<Route path="play-random" component={PlayRandomWithoutData} />
		<Route path="play-daily" component={PlayDaily} />
		<Route path="play-infinite" component={PlayInfinite} />
		<Route path="licenses" component={Licenses} />
	</Router>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
