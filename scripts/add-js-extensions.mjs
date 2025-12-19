#!/usr/bin/env node
/**
 * Post-Build Script: Fügt .js Extensions zu ES-Module Imports hinzu
 * Notwendig für Node.js ESM Runtime mit moduleResolution=node
 *
 * Nutzen:
 * node scripts/add-js-extensions.mjs dist/server
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.join(__dirname, '..')

function processDirectory(dir) {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      processDirectory(filePath)
    } else if (file.endsWith('.js')) {
      processFile(filePath)
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8')
  const originalContent = content

  // Pattern 1: from './path' oder from "./path" (relatives imports ohne Extension)
  content = content.replace(
    /from\s+['"](\.[^'"]*?)(['"])\s*(?=;|$)/g,
    (match, importPath, quote) => {
      // Skip wenn bereits .js/.mjs/.cjs Extension hat
      if (/\.(js|mjs|cjs)$/.test(importPath)) {
        return match
      }
      // Skip wenn es eine Datei mit bekannter Extension ist
      if (/\.(json|node)$/.test(importPath)) {
        return match
      }
      // Füge .js hinzu
      return `from '${importPath}.js'${quote === '"' ? '' : ''}`
    }
  )

  // Nur schreiben wenn sich etwas geändert hat
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8')
    console.log(`✓ Fixed: ${filePath}`)
  }
}

// Main
const buildDir = process.argv[2] || path.join(PROJECT_ROOT, 'dist/server')

if (!fs.existsSync(buildDir)) {
  console.error(`❌ Directory not found: ${buildDir}`)
  process.exit(1)
}

console.log(`Processing directory: ${buildDir}`)
processDirectory(buildDir)
console.log(`✅ Done`)
