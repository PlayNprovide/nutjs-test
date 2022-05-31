import { app, BrowserWindow } from 'electron'
import { IpcGetConfig, IpcGetTable, IpcLoadUrl, IpcMessage, IpcTest } from 'lib/ipc-event'
import { waitForImage } from './automation'
import { config } from './config'
import { ipcTable } from './ipc-table'
import { logger } from './logger'
import { onEvent } from './main-ipc'
import { createTray } from './tray'

function registerListeners() {
  onEvent<IpcMessage>('MESSAGE', (e, ...args) =>
    logger.info(`got a message from ${e.sender.id}, ${e.processId}, ${e.frameId}, ${e.ports} : ${args}`)
  )
  // eslint-disable-next-line no-eval
  onEvent<IpcTest>('TEST', (_, code) => eval(code))

  onEvent<IpcLoadUrl>('LOAD_URL', (e, url) => BrowserWindow.fromWebContents(e.sender)?.loadURL(url))

  // no guarantee that app is ready if you put this on making config
  onEvent<IpcGetConfig>('GET_CONFIG', (e) => {
    e.returnValue = config.store
  })
  onEvent<IpcGetTable>('GET_TABLE', (e) => {
    e.returnValue = ipcTable.store
  })
}

app.on('ready', () => {
  logger.log('info', 'app is ready', { source: 'main' })
  registerListeners()
  waitForImage('swap-button.png')
  createTray()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
