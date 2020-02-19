const pluginTester = require('babel-plugin-tester')
let plugin = require('babel-plugin-macros')
let path = require('path')
let glob = require('glob-all')
let fs = require('fs')
let prettier = require('prettier')

pluginTester({
  plugin,
  pluginName: 'tailwind.macro',
  babelOptions: {
    filename: __filename,
    babelrc: true
  },
  snapshot: true,
  formatResult(code) {
    return prettier
      .format(code, {
        parser: 'babel',
        semi: false,
        singleQuote: true
      })
      .trim()
  },
  tests: glob.sync('__fixtures__/*.js').map(file => ({
    title: path.basename(file),
    code: fs.readFileSync(file, 'utf-8')
  }))
})
