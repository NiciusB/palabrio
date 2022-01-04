<script lang="ts">
	import Game from '~/lib/components/Game.svelte'
	import LanguageStore from '~/lib/stores/LanguageStore'
	import WordStore from '~/lib/stores/WordStore'
	import seedrandom from 'seedrandom'
	import getDailyWordInfo from '~/lib/helpers/getDailyWordInfo'

	$: {
		const dailyWordInfo = getDailyWordInfo()
		WordStore.setWord(
			LanguageStore.generateRandomWord(
				seedrandom(`S${dailyWordInfo.season} D${dailyWordInfo.day}`)
			)
		)
	}
</script>

<main>
	<Game />
</main>
