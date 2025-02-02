import { execSync } from 'node:child_process'
import { copyFileSync, cpSync, mkdirSync, readFileSync, renameSync, rmSync } from 'node:fs'
import { join, resolve } from 'node:path'
import Arborist from '@npmcli/arborist'
import packlist from 'npm-packlist'

// This script enhances source files inside /app with a fresh React Native template.
const appName = 'LanguageApp'
const isBun = typeof Bun !== 'undefined'

console.log('⌛ Initializing a fresh RN project...')

execSync(`${isBun ? 'bunx' : 'npx'} @react-native-community/cli init ${appName} --skip-git-init true --install-pods true`, {
  // Write output to cnosole.
  stdio: 'inherit',
})

copyFileSync('app/App.tsx', `${appName}/App.tsx`)
copyFileSync('app/metro.config.js', `${appName}/metro.config.js`)
rmSync('app', { recursive: true })
renameSync(appName, 'app')

// Run build to ensure distributed files for plugin exist.
execSync(`${isBun ? 'bun' : 'npm'} run build`, {
  stdio: 'inherit',
})

const pkg = JSON.parse(readFileSync('./package.json'))
const packageDirectory = resolve(`app/node_modules/${pkg.name}`)

// Package files and copy them to app node_modules.
// Couldn't get symlinks to work with metro.
const arborist = new Arborist({ path: process.cwd() })
const tree = await arborist.loadActual()
const files = await packlist(tree)

mkdirSync(packageDirectory, { recursive: true })

for (const file of files) {
  cpSync(join(process.cwd(), file), join(packageDirectory, file), { recursive: true })
}

execSync(`${isBun ? 'bun' : 'npm'} install ${Object.keys(pkg.dependencies).join(' ')}`, {
  stdio: 'inherit',
  cwd: join(process.cwd(), 'app'),
})

console.log('')
console.log('🍞 React Native App created inside /app.')
console.log('🛠️  To run the example with the plugin included:')
console.log('🐚 cd app')
console.log('🐚 npm run ios / npm run android | bun ios / bun android')
console.log('🌪️  To copy over the changes from the plugin source run:')
console.log('🐚 npm run watch | bun watch')
console.log('🛠️  This will copy changes over to the app.')
