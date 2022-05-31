import { Config } from 'main/config'
import { IpcTable, PTarget } from 'main/ipc-table'
import { UserInput } from './type'

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

export type IpcStartWork = Event<'START_WORK', 'USER', UserInput>

export type IpcLogin = Event<'LOGIN', 'MAIN'>

export type IpcHideAuth = Event<'HIDE_AUTH', 'MAIN'>

export type IpcShowAuth = Event<'SHOW_AUTH', 'MAIN'>

export type IpcAuthState = Event<'AUTH_STATE', 'USER', boolean>

export type IpcLogout = Event<'LOGOUT', 'AUTH'>

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
  | IpcStartWork
  | IpcLogin
  | IpcHideAuth
  | IpcShowAuth
  | IpcLogout
  | IpcAuthState
