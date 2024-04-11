// source: https://jestjs.io/docs/code-transformation#examples

import path from 'path'

export default {
  process(src, filename, config, options) {
    return 'module.exports = ' + JSON.stringify(path.basename(filename)) + ';'
  },
}
