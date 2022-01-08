<script lang="ts">
	import { _ } from 'svelte-i18n'
	import LanguageStore from '~/lib/stores/LanguageStore'
	import Spinner from '~/lib/ui/Spinner.svelte'

	export let word: string
	export let lang: string

	let loadedWord: string
	let loadingPromise: Promise<unknown>
	let iframeHtml: string

	$: {
		if (loadedWord !== word) {
			loadedWord = word
			loadingPromise = fetch(
				`https://${encodeURIComponent(
					lang
				)}.wiktionary.org/w/api.php?action=query&origin=*&prop=extracts&format=json&titles=${encodeURIComponent(
					word
				)}`
			)
				.then((res) => res.json())
				.then((res) => {
					const pages: { [key: string]: { extract: string } } = res.query.pages
					const extractHtml = processWiktionaryExtractHtml(
						Object.values(pages)[0].extract
					)

					iframeHtml = `
      <html>
        <head>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
          <style>
            body { color: #f1f1f1; background: #222; padding: 0.5rem; }
            h1 { margin: .6em 0; }
            h2 { margin: .5em 0; }
            h3 { margin: .4em 0; }
            p, li { margin: .3em 0; }
          </style>
        </head>
        <body>
        ${extractHtml}
        </body>
      </html>`
				})
		}
	}

	function processWiktionaryExtractHtml(extractHtml: string): string {
		const root = document.createElement('div')
		root.innerHTML = extractHtml

		// Remove headings that only contain specific things
		root.querySelectorAll('h1, h2, h3').forEach((heading) => {
			const headingContent = heading.textContent?.trim() ?? ''

			if (
				// Keywords
				['Español', 'Traducciones', 'Referencias y notas'].includes(
					headingContent
				)
			) {
				heading.remove()
			}

			if (headingContent === 'Véase también') {
				heading.nextElementSibling?.remove()
				heading.remove()
			}
		})

		return root.innerHTML
	}
</script>

<article>
	<h3>{$_('word_definition.definition')} <sup title="Beta">β</sup></h3>

	{#await loadingPromise}
		<Spinner />
	{:then}
		{#if iframeHtml}
			<iframe
				sandbox=""
				title={$_('word_definition.definition')}
				src={`data:text/html;charset=utf-8,${encodeURIComponent(
					iframeHtml
				)}#${encodeURIComponent(LanguageStore.getLanguageName(lang))}`}
			/>
		{:else}
			<p>{$_('word_definition.unable_to_find_definition')}</p>
		{/if}
	{/await}
</article>

<style lang="scss">
	article {
		box-shadow: 6.7px 6.7px 5.3px rgba(0, 0, 0, 0.028),
			22.3px 22.3px 17.9px rgba(0, 0, 0, 0.042),
			100px 100px 80px rgba(0, 0, 0, 0.07);
		border-radius: 0.5rem;
		background: #282828;
		display: flex;
		flex-direction: column;
		height: calc(var(--vh, 1vh) * 30);
	}

	h3 {
		font-size: 1.2rem;
		padding: 1rem;
	}

	iframe {
		flex-grow: 1;
		border: 0;
		width: 100%;
		height: 100px; /* Arbitrary number to prevent default height */
	}
</style>
