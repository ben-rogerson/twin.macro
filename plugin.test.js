const pluginTester = require('babel-plugin-tester').default
const plugin = require('babel-plugin-macros')
const path = require('path')
const glob = require('glob-all')
const fs = require('fs')

const configFile = file => `${path.dirname(file)}/config.json`

pluginTester({
  plugin,
  pluginName: 'twin.macro',
  babelOptions: {
    filename: __filename,
    babelrc: true,
  },
  snapshot: true,
  tests: glob
    .sync(['__fixtures__/**/*.js', '!__fixtures__/**/*.config.js'])
    .map(file => ({
      title: path.basename(file),
      code: fs.readFileSync(file, 'utf8'),
      pluginOptions: {
        twin: {
          ...(fs.existsSync(
            path.join(path.dirname(file), 'tailwind.config.js')
          ) && {
            config: path.join(path.dirname(file), 'tailwind.config.js'),
          }),
          ...(fs.existsSync(configFile(file)) &&
            JSON.parse(fs.readFileSync(configFile(file), 'utf8'))),
        },
      },
    })),
})
