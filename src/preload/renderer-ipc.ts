/* eslint-disable class-methods-use-this */
import { ipcRenderer, IpcRendererEvent } from 'electron'
import { IpcEvent, IpcGetConfig, IpcGetTable, IpcUpdateConfig, IpcUpdateTable } from 'lib/ipc-event'
import { Config } from 'main/config'
import { IpcTable } from 'main/ipc-table'

declare global {
  interface Window {
    evHandler: RendererEventHandler
  }
}

export class RendererEventHandler {
  ipcTable: IpcTable

  config: Config

  constructor() {
    this.ipcTable = {
      USER: -1,
      MAIN: -1
    }
    this.config = {
      workDir: ''
    }

    this.onEvent<IpcUpdateTable>('UPDATE_TABLE', (_, ipcTable) => {
      this.ipcTable = ipcTable
    })
    this.onEvent<IpcUpdateConfig>('UPDATE_CONFIG', (_, config) => {
      this.config = config
    })
  }

  onEvent<TEvent extends IpcEvent>(
    name: TEvent extends { name: infer TName } ? TName : never,
    cb: (e: IpcRendererEvent, payload: TEvent extends { payload: infer TPayload } ? TPayload : never) => void
  ) {
    ipcRenderer.on(name, cb)
  }

  sendEvent<TEvent extends IpcEvent>(
    name: TEvent extends { name: infer TName } ? TName : never,
    target: TEvent extends { target: infer TTarget } ? TTarget : never,
    payload?: TEvent extends { payload: infer TPayload } ? TPayload : never
  ) {
    if (target === 'MAIN') ipcRenderer.send(name, payload)
    else ipcRenderer.sendTo(this.ipcTable[target], name, payload)
  }

  getTable() {
    const name: IpcGetTable['name'] = 'GET_TABLE'
    this.ipcTable = ipcRenderer.sendSync(name) as IpcTable
  }

  getConfig() {
    const name: IpcGetConfig['name'] = 'GET_CONFIG'
    this.config = ipcRenderer.sendSync(name) as Config
  }
}
