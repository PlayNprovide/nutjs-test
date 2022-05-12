/* eslint-disable class-methods-use-this */
import { ipcRenderer, IpcRendererEvent } from 'electron'
import { IpcEvent, PTarget, WebContentsId, webId } from 'lib/ipc-event'

export class RendererEventHandler {
  ipcTable: WebContentsId

  constructor() {
    this.ipcTable = {
      WORKER: webId.get('WORKER', -1),
      AUTH: webId.get('AUTH', -1),
      USER: webId.get('USER', -1)
    }
    webId.onDidAnyChange((newValue, _oldValue) => {
      Object.assign(this.ipcTable, newValue)
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
    target: PTarget,
    payload: TEvent extends { payload: infer TPayload } ? TPayload : never
  ) {
    if (target === 'MAIN') ipcRenderer.send(name, payload)
    else ipcRenderer.sendTo(this.ipcTable[target], name, payload)
  }
}
