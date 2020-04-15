const pluginTester = require('babel-plugin-tester').default
const plugin = require('babel-plugin-macros')
const path = require('path')
const glob = require('glob-all')
const fs = require('fs')

pluginTester({
  plugin,
  pluginName: 'twin.macro',
  babelOptions: {
    filename: __filename,
    babelrc: true,
  },
  snapshot: true,
  tests: glob.sync('__fixtures__/*.js').map(file => ({
    title: path.basename(file),
    code: fs.readFileSync(file, 'utf-8'),
  })),
})
