import assert from 'assert'
import { BrowserWindow, dialog, IpcMainEvent } from 'electron'
import { IpcFocusUser, IpcSetWorkDir, IpcStartWork } from 'lib/ipc-event'
import { WinRef } from 'lib/type'
import { onEvent, sendEventTo } from 'main/main-ipc'
import path from 'path'
import { config } from './config'
import { ipcTable } from './ipc-table'

export const userWindow: WinRef = { current: null }

export function createUserWindow(url: string) {
  userWindow.current = new BrowserWindow({
    show: false,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    titleBarStyle: 'hidden',
    // titleBarOverlay: {
    //   color: '#fafafa'
    // },
    icon: path.join(__dirname, 'icon.ico'),
    // backgroundColor: '#191622',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      devTools: process.env.NODE_ENV !== 'production',
      // webviewTag: true,
      preload: `${__dirname}/preload/user.js`
    }
  })

  ipcTable.set('USER', userWindow.current.webContents.id)

  onEvent<IpcSetWorkDir>('SET_WORKDIR', openDirectory)
  onEvent<IpcFocusUser>('FOCUS_USER', userWindow.current.focus)

  // userWindow.current.loadFile(`${__dirname}/index.html`)
  userWindow.current.loadURL('https://swapscanner.io/ko/swap')

  userWindow.current.on('ready-to-show', userWindow.current.show)
  // userWindow.current.webContents.setWindowOpenHandler(({ url, disposition }) => {
  //   logger.log('info', 'window is openning', disposition)
  //   shell.openExternal(url)
  //   return { action: 'deny' }
  // })

  // shell.openPath(app.getAppPath())

  userWindow.current.on('closed', () => {})
}

async function openDirectory(e: IpcMainEvent) {
  assert.ok(userWindow.current)
  const { canceled, filePaths } = await dialog.showOpenDialog(userWindow.current, {
    properties: ['openDirectory', 'createDirectory']
  })
  !canceled && config.set('workDir', filePaths)
  // !canceled && e.reply()
}

function start() {
  sendEventTo<IpcStartWork>(userWindow.current?.webContents, 'START_WORK', {
    fromToken: 'ksp',
    toToken: '클레이튼',
    fromQuantity: 1,
    toQuantity: 10,
    exchangeRate: 4.008
  })
}
