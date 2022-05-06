import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron'
import { WinRef } from 'lib/type'
import * as path from 'path'

const mainWindow: WinRef = { current: null }

function createMainWindow() {
  mainWindow.current = new BrowserWindow({
    show: false,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#fafafa'
    },
    icon: path.join(__dirname, 'with-rounded-background.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      devTools: process.env.NODE_ENV !== 'production',
      preload: `${__dirname}/preload/main.js`
    }
  })

  mainWindow.current.loadFile(`${__dirname}/index.html`)

  mainWindow.current.on('ready-to-show', mainWindow.current.show)
  mainWindow.current.webContents.setWindowOpenHandler(({ url, disposition }) => {
    console.log('window is openning', disposition)
    shell.openExternal(url)
    return { action: 'deny' }
  })

  mainWindow.current.on('closed', () => {})
}

async function registerListeners() {
  // 콜백이 등록되는 순간에는 윈도우가 초기화되지않은 경우가 있을 수 있다
  // 이 경우 직접 함수의 레퍼런스를 넘기는 방식으로 콜백을 등록하면 destroyed 에러가 난다
  // 따라서 윈도우의 초기화가 보장되지 않는다면 익명함수 내에서 처리할 것
  if (mainWindow.current === null) return new Error('windows not initialized')
  ipcMain.on('message', (e, ...args) => {
    console.log(`got a message from ${e.sender.id}, ${e.processId}, ${e.frameId}, ${e.ports} : ${args}`)
  })

  ipcMain.on('close', app.quit)

  ipcMain.on('test', (_, code: string) => {
    // eslint-disable-next-line no-eval
    eval(code)
  })

  ipcMain.on('select-folder', (e) => {
    if (mainWindow.current)
      dialog
        .showOpenDialog(mainWindow.current, { properties: ['openDirectory'] })
        .then(({ canceled, filePaths }) => !canceled && e.reply('path', ...filePaths))
  })

  ipcMain.on('get-path', (e, name) => e.reply('path', app.getPath(name)))

  ipcMain.on('focus', () => mainWindow.current?.show())

  ipcMain.on('load-url', (e, _url: string) => BrowserWindow.fromWebContents(e.sender)?.loadURL(_url))
}

app
  .on('ready', createMainWindow)
  .whenReady()
  .then(registerListeners)
  .catch((e) => console.error(e))

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})
