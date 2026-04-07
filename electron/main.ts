import { app, BrowserWindow, nativeTheme } from 'electron'
import { join } from 'node:path'
import { registerAllIpc } from './ipc'
import { sysInfoService } from './services/sysinfo.service'

let mainWindow: BrowserWindow | null = null
let ipcRegistered = false

function createWindow(): BrowserWindow {
  const window = new BrowserWindow({
    width: 1380,
    height: 880,
    minWidth: 1180,
    minHeight: 720,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#0f1217' : '#f3f7fb',
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  if (!ipcRegistered) {
    registerAllIpc()
    ipcRegistered = true
  }

  sysInfoService.startMonitor(window)

  if (process.env.ELECTRON_RENDERER_URL) {
    window.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    window.loadFile(join(__dirname, '../renderer/index.html'))
  }

  window.once('ready-to-show', () => window.show())
  window.on('closed', () => {
    sysInfoService.stopMonitor()
    mainWindow = null
  })

  return window
}

app.whenReady().then(() => {
  mainWindow = createWindow()

  nativeTheme.on('updated', () => {
    mainWindow?.webContents.send('theme:changed', nativeTheme.shouldUseDarkColors ? 'dark' : 'light')
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
