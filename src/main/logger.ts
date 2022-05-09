import { app } from 'electron'
import path from 'path'
import winston from 'winston'

export const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: path.join(app.getPath('userData'), 'logs.txt'),
      format: winston.format.printf(
        ({ level, source, message, ...meta }) => `${level} [${source}]: ${message} ${JSON.stringify(meta)}`
      )
    })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format((info) => ({ ...info }))(),
        winston.format.colorize({ level: true }),
        winston.format.printf((info) => {
          const { source, level, message, ...meta } = info
          return `${level} [${source}]: ${message} ${JSON.stringify(meta)}`
        })
      )
    })
  )
}
