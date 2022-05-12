import Store from 'electron-store'

export type PTarget = 'MAIN'

export type WebContentsId = Omit<Record<PTarget, number>, 'MAIN'>

export const webId = new Store<WebContentsId>({
  name: 'webId'
})

interface Event<TName extends string, T extends PTarget, TPayload = undefined> {
  name: TName
  payload: TPayload
  target: T
}

export type IpcSetWorkDir = Event<'SET_WORKDIR', 'MAIN'>

export type IpcEvent = IpcSetWorkDir
