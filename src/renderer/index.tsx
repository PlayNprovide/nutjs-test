import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import 'shared/global.css'
import App from './App'
import './index.css'

// if (process.env.NODE_ENV === 'development') window.ipc = { send: console.log, on: console.log }
// if (process.env.NODE_ENV === 'production') console.log = () => {}

const root = document.querySelector('#root')

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  root
)
