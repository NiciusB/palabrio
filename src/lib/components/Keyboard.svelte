<script lang="ts">
	import LanguageStore from '~/lib/stores/LanguageStore'
	import { get } from 'svelte/store'
	import KeyboardKey from '~/lib/components/KeyboardKey.svelte'
	import SPECIAL_LETTERS from '~/lib/enums/SPECIAL_LETTERS'
	import { isLanguageRTL } from '~/lib/helpers/utils'

	let keyboardRows: Array<SPECIAL_LETTERS | string>[] = []

	LanguageStore.keyboardLetters.subscribe((value) => {
		const DEFAULT_ORDER = [
			'qwertyuiopđasdfghjklñæzxcvbnm',
			'קראטוןםפשדגכעיחלךףזסבהנמצתץ',
			'ضصثقفغعهخحجدشسيبلاتنمكطئءؤرﻻىةوزظ',
		].join('')
		const sortedLetters: Array<SPECIAL_LETTERS | string> = value.sort(
			(a, b) => {
				const indexA = DEFAULT_ORDER.indexOf(a)
				const indexB = DEFAULT_ORDER.indexOf(b)

				if (indexA === -1 && indexB !== -1) {
					return Infinity
				}
				if (indexB === -1 && indexA !== -1) {
					return -Infinity
				}

				return indexA - indexB
			}
		)

		keyboardRows = []

		let rowIndex = 0
		for (
			let letterIndex = 0;
			letterIndex < sortedLetters.length;
			letterIndex++
		) {
			const lettersPerRow = calculateLettersPerRow(rowIndex)
			if (keyboardRows[rowIndex]?.length > lettersPerRow) {
				rowIndex++
			}

			keyboardRows[rowIndex] = keyboardRows[rowIndex] ?? []
			keyboardRows[rowIndex].push(sortedLetters[letterIndex])
		}

		if (keyboardRows.length) {
			keyboardRows[0].push(SPECIAL_LETTERS.BACKSPACE)
			keyboardRows[keyboardRows.length - 1].push(SPECIAL_LETTERS.ENTER)
		}
	})

	function calculateLettersPerRow(rowIndex: number) {
		switch (get(LanguageStore.dictionaryLanguage)) {
			case 'es':
				return 9
			default:
				return rowIndex % 2 === 0 ? 9 : 8
		}
	}

	$: lang = LanguageStore.dictionaryLanguage
</script>

<aside>
	{#each keyboardRows as row}
		<div class="row">
			{#each row as letter}
				<KeyboardKey {letter} />
			{/each}
		</div>
	{/each}
</aside>

<style lang="scss">
	aside {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		margin: 0.5rem 0;
		width: calc(100vw - 0.4rem);
		max-width: 100%;
		touch-action: manipulation;
		user-select: none;
	}

	.row {
		display: flex;
		flex-direction: row;
		gap: 0.3rem;
		flex-grow: 1;
		flex-wrap: wrap;
	}
</style>
