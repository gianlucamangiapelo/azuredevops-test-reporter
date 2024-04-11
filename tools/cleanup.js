import { existsSync, readdirSync, lstatSync, unlinkSync, rmdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const folder = process.argv.slice(2)[0]

const deleteFolderRecursive = (path) => {
  if (existsSync(path)) {
    readdirSync(path).forEach((file) => {
      const curPath = join(path, file)
      if (lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath)
      } else {
        unlinkSync(curPath)
      }
    })
    rmdirSync(path)
  }
}

if (folder) {
  deleteFolderRecursive(join(__dirname, '../dist', folder))
} else {
  deleteFolderRecursive(join(__dirname, '../dist/cjs'))
  deleteFolderRecursive(join(__dirname, '../dist/esm'))
  deleteFolderRecursive(join(__dirname, '../dist/umd'))
  deleteFolderRecursive(join(__dirname, '../dist/types'))
}
