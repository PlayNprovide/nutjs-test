import { imageResource, screen } from '@nut-tree/nut-js'
import '@nut-tree/template-matcher'
import { logger } from './logger'

export async function findImage(img: string) {
  try {
    const region = await screen.find(imageResource(`${__dirname}/${img}`), { confidence: 0.9 })
    logger.info(region.toString(), { source: 'main' })
  } catch (e: any) {
    logger.error(e, { source: 'main' })
  }
}

export async function waitForImage(img: string) {
  try {
    const region = await screen.waitFor(imageResource(`${__dirname}/${img}}`), 5000, 500, { confidence: 0.9 })
    logger.info(region.toString(), { source: 'main' })
  } catch (e: any) {
    logger.error(e, { source: 'main' })
  }
}
