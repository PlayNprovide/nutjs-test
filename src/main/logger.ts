import { app } from 'electron'
import path from 'path'
import winston from 'winston'

export const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
})

if (process.env.NODE_ENV === 'production')
  logger.add(new winston.transports.File({ filename: path.join(app.getPath('userData'), 'log.txt') }))
