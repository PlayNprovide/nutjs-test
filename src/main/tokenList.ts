import { app } from 'electron'
import Store from 'electron-store'

// const schema = {}

export type TokenList = Record<string, string>

export const tokenList = new Store<TokenList>({
  name: 'token-list',
  cwd: app.getAppPath()
})
