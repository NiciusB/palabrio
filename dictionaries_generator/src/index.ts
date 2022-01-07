import fs from 'fs'
import path from 'path'
import fse from 'fs-extra'
import { Worker } from 'worker_threads'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import pLimit from 'p-limit'
import os from 'os'

const argv = yargs(hideBin(process.argv)).argv

const MAX_THREADS = Math.max(1, Math.floor(os.cpus().length * 0.8))
const limitThreads = pLimit(MAX_THREADS)

const distDir = path.join(__dirname, '..', 'dist')
const appDictionariesDir = path.join(
	__dirname,
	'..',
	'..',
	'public',
	'dictionaries'
)
const appLanguagesListFile = path.join(
	__dirname,
	'..',
	'..',
	'src',
	'assets',
	'dictionariesList.json'
)
const dictionariesSourceDir = path.join(
	__dirname,
	'..',
	'node_modules',
	'dictionaries',
	'dictionaries'
)

const shouldSkipExisting = argv.skipExisting

const allLangs = fs
	.readdirSync(dictionariesSourceDir)
	.filter((locale) => !locale.includes('-')) // Skip varieties for now, maybe we could include and merge the new words them in the future
	.filter((locale) => locale !== 'cs') // Disable CS for now, since affix is broken: https://github.com/wooorm/nspell/issues/5
	.filter((locale) => locale !== 'eu') // Disable EU for now, since it seems to be stuck in an infinite loop
	.filter((locale) => locale !== 'rw') // Disable RW for now, since it seems to be stuck in an infinite loop
	.filter((locale) => locale !== 'hu') // Disable HU for now, since it seems to consume too much memory and crash
	.filter((locale) => locale !== 'ko') // Disable KO for now, since it seems to consume too much memory and crash
	.filter((locale) => locale !== 'gl') // Disable GL for now, since it seems to consume too much memory and crash
	.filter((locale) => locale !== 'hyw') // Disable HYW since it's repeated for HY

async function main() {
	console.log(`🤠 Starting with ${MAX_THREADS} threads...`)

	const promises = []
	for (const index in allLangs) {
		promises.push(
			limitThreads(() => {
				const lang = allLangs[index]
				const worker = new Worker(path.resolve(__dirname, 'worker.js'), {
					workerData: {
						lang,
						shouldSkipExisting,
						distDir,
						dictionariesSourceDir,
					},
				})

				return new Promise((resolve, reject) => {
					worker.on('exit', () => {
						console.log(
							`⏱ ${
								allLangs.length -
								limitThreads.pendingCount -
								limitThreads.activeCount +
								1
							}/${allLangs.length}`
						)
						resolve(null)
					})
					worker.on('error', (error) => {
						console.log(
							`⏱ ${
								allLangs.length -
								limitThreads.pendingCount -
								limitThreads.activeCount +
								1
							}/${allLangs.length}`
						)
						reject(error)
						console.error(error)
					})
				})
			})
		)
	}

	await Promise.allSettled(promises)

	console.log(`🤠 All languages processed!`)

	await fse.remove(appDictionariesDir)
	await fse.copy(distDir, appDictionariesDir)

	const listOfLangs = (await fse.readdir(path.join(distDir, '5'))).map(
		(langFile) => langFile.replace('.json', '')
	)

	await fse.writeFile(appLanguagesListFile, JSON.stringify(listOfLangs))

	console.log(`🤠 Copied all dictionaries to app dictionaries folder`)
}

main()
