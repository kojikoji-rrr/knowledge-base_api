import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { AppEnv } from '../bindings'
import { allowedOrigin } from '../config/runtime-config'

export function applyCors(app: Hono<AppEnv>): void {
  app.use('/*', async (c, next) => {
    const corsMiddleware = cors({
      origin: allowedOrigin(c),
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type'],
    })
    return corsMiddleware(c, next)
  })
}

