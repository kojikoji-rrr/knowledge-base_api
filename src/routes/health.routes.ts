import { Hono } from 'hono'
import { AppEnv } from '../bindings'

export function registerHealthRoutes(app: Hono<AppEnv>): void {
  app.get('/', (c) => c.text('Knowledge Base API is running.'))
}

