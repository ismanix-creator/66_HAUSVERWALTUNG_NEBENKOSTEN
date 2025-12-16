import { spawn } from 'node:child_process'
import { watch } from 'node:fs'
import path from 'node:path'

const serverCommand = 'tsx'
const serverArgs = ['src/server/index.ts']
const watchRoot = path.join(process.cwd(), 'src', 'server')
let serverProcess
let restartTimer
let restarting = false

function startServer() {
  if (serverProcess) {
    serverProcess.kill()
  }

  serverProcess = spawn(serverCommand, serverArgs, {
    stdio: 'inherit',
    env: { ...process.env },
  })

  serverProcess.on('exit', (code, signal) => {
    if (restarting) return
    if (code !== null && code !== 0) {
      console.error(`Server process exited with code ${code}`)
    }
    if (signal) {
      console.log(`Server process terminated (${signal})`)
    }
  })
}

function scheduleRestart(filePath) {
  if (restartTimer) {
    clearTimeout(restartTimer)
  }

  restartTimer = setTimeout(() => {
    restarting = true
    console.log(`\nDateiänderung erkannt (${filePath}). Server wird neu gestartet…`)
    startServer()
    restarting = false
  }, 150)
}

watch(watchRoot, { recursive: true }, (eventType, filename) => {
  if (!filename) return
  const filePath = path.join(watchRoot, filename)
  scheduleRestart(filePath)
})

process.on('SIGINT', () => {
  serverProcess?.kill()
  process.exit(0)
})

startServer()
