import assert from 'assert'
import { app } from 'electron'
import Store from 'electron-store'
import { IpcUpdateConfig } from 'lib/ipc-event'
import { logger } from './logger'
import { sendEventTo } from './main-ipc'
import { userWindow } from './user-window'

// const schema = {}

export type Config = {
  workDir: string
}

export const config = new Store<Config>({
  name: 'config',
  cwd: app.getAppPath(),
  defaults: {
    workDir: app.getPath('documents')
  }
})

config.onDidAnyChange((newValue) => {
  assert.ok(userWindow.current)
  sendEventTo<IpcUpdateConfig>(userWindow.current.webContents, 'UPDATE_CONFIG', config.store)
  logger.info('config updated', { source: 'main', newValue })
})
