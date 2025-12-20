const fs = require('fs')
const path = require('path')
const file = path.resolve(__dirname, '..', 'config', 'config.toml')
const bak = file + '.' + new Date().toISOString().replace(/[:.]/g,'-') + '.bak'
console.log('Read:', file)
const src = fs.readFileSync(file, 'utf8')
fs.writeFileSync(bak, src, 'utf8')
console.log('Backup written to', bak)

function titleizeKey(key) {
  const last = key.split('.').pop() || key
  const withSpaces = last.replace(/_/g, ' ')
  return withSpaces.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

let out = src
// Replace label = "xxx.yyy" and title = "xxx.yyy"
out = out.replace(/(label|title)\s*=\s*"([^"\n]*\.[^"\n]*)"/g, (m, kind, key) => {
  const t = titleizeKey(key)
  return `${kind} = "${t}"`
})

// Also handle inline objects: e.g. submit = { label = "buttons.save" }
out = out.replace(/(label)\s*:\s*"([^"\n]*\.[^"\n]*)"/g, (m, kind, key) => {
  const t = titleizeKey(key)
  return `${kind}: "${t}"`
})

fs.writeFileSync(file, out, 'utf8')
console.log('Wrote updated config to', file)
console.log('Done')
