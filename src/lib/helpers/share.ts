import shareCustomSheet from '~/lib/helpers/shareCustomSheet'

export default function share(data: ShareData | ShareDataPolyfill) {
	if (
		typeof navigator.share !== 'undefined' &&
		typeof navigator.canShare !== 'undefined' &&
		navigator.canShare(data)
	) {
		navigator.share(data)
	} else {
		shareCustomSheet(data)
	}
}
