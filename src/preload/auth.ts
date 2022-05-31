import { IpcAuthState, IpcFocusUser, IpcHideAuth, IpcLogout, IpcShowAuth } from 'lib/ipc-event'
import { RendererEventHandler } from './renderer-ipc'

window.evHandler = new RendererEventHandler()

function focusUserWindow() {
  window.removeEventListener('beforeunload', focusUserWindow)
  window.evHandler.sendEvent<IpcHideAuth>('HIDE_AUTH', 'MAIN')
  window.evHandler.sendEvent<IpcFocusUser>('FOCUS_USER', 'MAIN')
}

window.addEventListener('load', () => {
  const { href } = window.location

  switch (href) {
    case 'https://nid.naver.com/nidlogin.login?mode=form&url=https%3A%2F%2Fwww.naver.com':
      window.evHandler.sendEvent<IpcShowAuth>('SHOW_AUTH', 'MAIN')
      window.addEventListener('beforeunload', focusUserWindow)
      break
    case 'https://swapscanner.io/ko':
      window.evHandler.sendEvent<IpcAuthState>(
        'AUTH_STATE',
        'USER',
        !document.contains(document.querySelector('a.link_login'))
      )
      window.evHandler.sendEvent<IpcHideAuth>('HIDE_AUTH', 'MAIN')
      break
    default:
      window.evHandler.sendEvent<IpcHideAuth>('HIDE_AUTH', 'MAIN')
      break
  }
})

window.evHandler.onEvent<IpcLogout>('LOGOUT', clickLogout)

function clickLogout() {
  if (!window.location.href.startsWith('https://www.naver.com')) return
  const button = (document.getElementById('minime') as HTMLIFrameElement)?.contentDocument?.querySelector(
    'a.btn_logout'
  ) as HTMLElement
  if (!button) return
  button.click()
  window.evHandler.sendEvent<IpcAuthState>('AUTH_STATE', 'USER', false)
}
