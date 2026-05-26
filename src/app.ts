import { Hono } from 'hono'
import { AppEnv } from './bindings'
import { applyCors } from './middleware/cors.middleware'
import { registerHealthRoutes } from './routes/health.routes'
import { registerKnowledgeBaseRoutes } from './routes/knowledge-base.routes'

export function createApp() {
  const app = new Hono<AppEnv>().basePath('/v1')
  applyCors(app)
  registerHealthRoutes(app)
  registerKnowledgeBaseRoutes(app)
  return app
}

