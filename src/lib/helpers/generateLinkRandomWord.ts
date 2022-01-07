import { base64Encode } from '~/lib/helpers/base64ForUrls'

export default function generateLinkRandomWord(word: string, lang: string) {
	const randomData: PlayRandomWordData = { word, lang }

	return `/play-random/${base64Encode(randomData)}`
}
