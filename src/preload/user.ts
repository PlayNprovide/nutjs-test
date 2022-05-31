import { IpcStartWork } from 'lib/ipc-event'
import { tokenList } from 'main/tokenList'
import { RendererEventHandler } from './renderer-ipc'

declare global {
  interface Window {}
}

window.evHandler = new RendererEventHandler()

window.evHandler.onEvent<IpcStartWork>(
  'START_WORK',
  (_, { fromToken, toToken, fromQuantity, toQuantity, exchangeRate }) => {
    const tokenSearchForm = document.querySelector('support-token-search__form') as HTMLDivElement
  }
)

function getTokenList() {
  const selectButton = document.querySelector('span.notranslate + button') as HTMLButtonElement
  selectButton.click()

  const loadTime = 3000
  window.setTimeout(() => {
    const tokenListElements = document.querySelectorAll('ul.text-sm > li')
    tokenListElements.forEach((li) => {
      const tokenName = li.querySelector('div.truncate')?.textContent?.trim()
      const tokenCode = li.querySelector('span.ml-3')?.textContent?.trim()
      tokenList.set(tokenName!, tokenCode)
    })
  }, loadTime)
}
