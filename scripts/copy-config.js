import fs from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(process.cwd())
const SRC_CONFIG = path.join(ROOT, 'config')
const DIST_CONFIG = path.join(ROOT, 'dist', 'config')

async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true })
  const entries = await fs.readdir(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath)
      continue
    }

    await fs.copyFile(srcPath, destPath)
  }
}

async function run() {
  try {
    await fs.rm(DIST_CONFIG, { recursive: true, force: true })
    await copyDirectory(SRC_CONFIG, DIST_CONFIG)
  } catch (error) {
    console.error('Fehler beim Kopieren der Config:', error)
    process.exit(1)
  }
}

run()
