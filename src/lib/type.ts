import { BrowserWindow } from 'electron'

export type WinRef = {
  current: BrowserWindow | null
}

export type UserInput = {
  fromToken: string
  toToken: string
  fromQuantity: number
  toQuantity: number
  exchangeRate: number
}
