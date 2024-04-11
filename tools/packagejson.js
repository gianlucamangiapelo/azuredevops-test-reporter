import { fileURLToPath } from 'url'
import path from 'path'
import { writeFile } from 'fs/promises'
import file from '../package.json' assert { type: 'json' }

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const args = process.argv.slice(2)

const updateJSON = async (filePath, args) => {
  const fileContent = { ...file }
  for (let i = 0, l = args.length; i < l; i += 2) {
    if (args[i + 1] !== undefined) {
      fileContent[args[i]] = args[i + 1]
    }
  }
  try {
    await writeFile(
      path.join(__dirname, filePath),
      JSON.stringify(fileContent, null, 2)
    )
    console.log('Writing to ' + filePath)
  } catch (err) {
    console.error(err)
  }
}

updateJSON('../package.json', args)
