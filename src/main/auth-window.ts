import { BrowserWindow } from 'electron'
import { IpcHideAuth, IpcLogin, IpcShowAuth } from 'lib/ipc-event'
import { WinRef } from 'lib/type'
import path from 'path'
import { ipcTable } from './ipc-table'
import { onEvent } from './main-ipc'

export const authWindow: WinRef = { current: null }

export function createAuthWindow() {
  authWindow.current = new BrowserWindow({
    show: process.env.NODE_ENV === 'development',
    width: 800,
    height: 600,
    frame: false,
    titleBarStyle: 'hidden',
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: process.env.NODE_ENV === 'development',
      preload: `${__dirname}/preload/auth.js`
    }
  })
  authWindow.current.setMenuBarVisibility(false)
  authWindow.current.loadURL('https://swapscanner.io/ko')

  ipcTable.set('AUTH', authWindow.current.webContents.id)

  onEvent<IpcLogin>('LOGIN', loadLoginPage)
  onEvent<IpcHideAuth>('HIDE_AUTH', () => authWindow.current?.hide())
  onEvent<IpcShowAuth>('SHOW_AUTH', () => authWindow.current?.show())
}

function loadLoginPage() {
  authWindow.current
    ?.loadURL('https://nid.naver.com/nidlogin.login?mode=form&url=https%3A%2F%2Fwww.naver.com')
    .then(() => authWindow.current?.show())
}
