import { BrowserWindow } from 'electron'

export type WinRef = {
  current: BrowserWindow | null
}
