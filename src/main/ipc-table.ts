import { app } from 'electron'
import Store from 'electron-store'
import { IpcUpdateTable } from 'lib/ipc-event'
import { logger } from 'main/logger'
import { sendEventTo } from 'main/main-ipc'
import { userWindow } from 'main/user-window'

export type IpcTable = Record<PTarget, number>
export type PTarget = 'MAIN' | 'USER'
export const ipcTable = new Store<IpcTable>({
  name: 'ipcTable',
  cwd: app.getAppPath()
})

ipcTable.onDidAnyChange((newValue) => {
  sendEventTo<IpcUpdateTable>(userWindow.current?.webContents, 'UPDATE_TABLE', ipcTable.store)
  logger.info('ipcTable updated', { source: 'main', newValue })
})
