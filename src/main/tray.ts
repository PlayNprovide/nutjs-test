import { app, dialog, Menu, nativeImage, shell, Tray } from 'electron'
import path from 'path'
import { config } from './config'

let tray: Tray

export function createTray() {
  tray = new Tray(nativeImage.createFromPath(path.join(__dirname, 'icon.ico')))

  tray.setToolTip('Made by PlayNProvide')
  rebuildTrayMenu()
}

export function rebuildTrayMenu() {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Settings/League',
      click: () => {
        dialog.showMessageBox({
          title: 'Settings',
          message: `Open Path of Exile and press "${config.get(
            'overlayKey'
          )}". Click on the button with cog icon there.`
        })
      }
    },
    {
      label: `알림 설정`,
      accelerator: 'Alt+Q',
      click: () => {
        shell.openExternal('https://github.com/SnosMe/awakened-poe-trade/releases')
      }
    },
    {
      label: `작업 시작`,
      accelerator: 'Alt+Q',
      click: () => {
        shell.openExternal('https://github.com/SnosMe/awakened-poe-trade/releases')
      }
    },
    {
      label: '작업 종료',
      accelerator: 'Alt+W',
      click: () => {
        shell.openPath(path.join(app.getPath('userData'), 'apt-data'))
      }
    },
    { type: 'separator' },
    {
      label: '종료',
      click: () => {
        app.quit()
      }
    }
  ])

  tray.setContextMenu(contextMenu)
}
