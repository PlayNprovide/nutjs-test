import { Config } from 'main/config'
import { IpcTable, PTarget } from 'main/ipc-table'

interface Event<TName extends string, TTarget extends PTarget, TPayload = undefined> {
  name: TName
  target: TTarget
  payload: TPayload
}

export type IpcSetWorkDir = Event<'SET_WORKDIR', 'MAIN'>

export type IpcGetConfig = Event<'GET_CONFIG', 'MAIN'>

export type IpcFocusUser = Event<'FOCUS_USER', 'MAIN'>

export type IpcGetTable = Event<'GET_TABLE', 'MAIN'>

export type IpcUpdateTable = Event<'UPDATE_TABLE', 'USER', IpcTable>

export type IpcUpdateConfig = Event<'UPDATE_CONFIG', 'USER', Config>

export type IpcLoadUrl = Event<'LOAD_URL', 'MAIN', string>

export type IpcMessage = Event<'MESSAGE', 'MAIN', string>

export type IpcTest = Event<'TEST', 'MAIN', string>

export type IpcEvent =
  | IpcSetWorkDir
  | IpcGetConfig
  | IpcFocusUser
  | IpcUpdateTable
  | IpcUpdateConfig
  | IpcGetTable
  | IpcLoadUrl
  | IpcMessage
  | IpcTest
