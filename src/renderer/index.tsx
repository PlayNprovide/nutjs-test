import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import 'shared/global.css'
import App from './App'
import './index.css'

// type IPC = {
//   send: (channel: string, ...args: any[]) => void
//   on: (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void
// }

declare global {
  interface Window {
    ipc: Electron.IpcRenderer
    sendSub: (channel: string, ...args: any[]) => void
  }
}

// if (process.env.NODE_ENV === 'development') window.ipc = { send: console.log, on: console.log }
// if (process.env.NODE_ENV === 'production') console.log = () => {}

const root = document.querySelector('#root')

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  root
)
