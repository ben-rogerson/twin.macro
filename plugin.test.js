const pluginTester = require('babel-plugin-tester').default
let plugin = require('babel-plugin-macros')
let path = require('path')
let glob = require('glob-all')
let fs = require('fs')
let prettier = require('prettier')

pluginTester({
  plugin,
  pluginName: 'twin.macro',
  babelOptions: {
    filename: __filename,
    babelrc: true
  },
  snapshot: true,
  tests: glob.sync('__fixtures__/custom.js').map(file => ({
    // tests: glob.sync('__fixtures__/*.js').map(file => ({
    title: path.basename(file),
    code: fs.readFileSync(file, 'utf-8')
  }))
})
