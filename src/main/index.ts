import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron'
import { webId } from 'lib/ipc-event'
import { WinRef } from 'lib/type'
import * as path from 'path'
import { config } from './config'
import { logger } from './logger'

const userWindow: WinRef = { current: null }

function createUserWindow() {
  userWindow.current = new BrowserWindow({
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

  webId.set('USER', userWindow.current.webContents.id)
  userWindow.current.loadFile(`${__dirname}/index.html`)

  userWindow.current.on('ready-to-show', userWindow.current.show)
  userWindow.current.webContents.setWindowOpenHandler(({ url, disposition }) => {
    logger.info('window is openning', { disposition, source: 'userWindow' })
    shell.openExternal(url)
    return { action: 'deny' }
  })

  userWindow.current.on('closed', () => {})
}

async function registerListeners() {
  // 콜백이 등록되는 순간에는 윈도우가 초기화되지않은 경우가 있을 수 있다
  // 이 경우 직접 함수의 레퍼런스를 넘기는 방식으로 콜백을 등록하면 destroyed 에러가 난다
  // 따라서 윈도우의 초기화가 보장되지 않는다면 익명함수 내에서 처리할 것
  ipcMain.on('message', (e, ...args) => {
    console.log(`got a message from ${e.sender.id}, ${e.processId}, ${e.frameId}, ${e.ports} : ${args}`)
  })

  ipcMain.on('close', app.quit)

  ipcMain.on('test', (_, code: string) => {
    // eslint-disable-next-line no-eval
    eval(code)
  })

  ipcMain.on('select-folder', (e) => {
    if (userWindow.current)
      dialog
        .showOpenDialog(userWindow.current, { properties: ['openDirectory'] })
        .then(({ canceled, filePaths }) => !canceled && e.reply('path', ...filePaths))
  })

  ipcMain.on('get-path', (e, name) => e.reply('path', app.getPath(name)))

  ipcMain.on('focus', () => userWindow.current?.show())

  ipcMain.on('load-url', (e, _url: string) => BrowserWindow.fromWebContents(e.sender)?.loadURL(_url))
}

app.on('ready', () => {
  createUserWindow()
  registerListeners()
  config.set('hello', 'world')
  logger.log('info', 'app is ready')
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createUserWindow()
  }
})
