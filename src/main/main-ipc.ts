import assert from 'assert'
import { ipcMain, IpcMainEvent } from 'electron'
import { IpcEvent } from 'lib/ipc-event'

export function onEvent<TEvent extends IpcEvent>(
  name: TEvent extends { name: infer TName } ? TName : never,
  cb: (e: IpcMainEvent, payload: TEvent extends { payload: infer TPayload } ? TPayload : never) => void
) {
  ipcMain.on(name, cb)
}

export function sendEventTo<TEvent extends IpcEvent>(
  webContents: Electron.WebContents | undefined,
  name: TEvent extends { name: infer TName } ? TName : never,
  payload?: TEvent extends { payload: infer TPayload } ? TPayload : never
) {
  assert.ok(webContents)
  webContents.send(name, payload)
}
