const mix = require('laravel-mix');
const fs = require('fs').promises

const packageJson = require('./package.json')
const tailwindConfig = require('./tailwind.config')

const tailwindVersion = packageJson.devDependencies.tailwindcss
let cssFileName = `tailwind-${tailwindVersion}`

if (tailwindConfig.mode) {
	cssFileName += '-' + tailwindConfig.mode
}

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
	.setPublicPath('dist')
	.postCss('src/tailwind.css', `dist/${cssFileName}.min.css`, [
		require('postcss-import'),
		require('tailwindcss'),
		require('postcss-nested'),
		require('postcss-preset-env')({stage: 0}),
		require('postcss-sorting'),
	])

// prettify is overwritten when used directly in postCss plugins array
mix.after(() => {
	var prettify = require('postcss-prettify')

	fs.readFile(`dist/${cssFileName}.min.css`, 'utf8')
		.then(data => prettify.process(data))
		.then(res => fs.writeFile(`dist/${cssFileName}.css`, res.css))
		.catch(err => console.err(err.stack))
})
