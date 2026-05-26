import { Hono } from 'hono'
import { AppEnv } from '../bindings'
import { proxyToLocalApi } from '../proxy/local-api-proxy'

export function registerKnowledgeBaseRoutes(app: Hono<AppEnv>): void {
  app.all('/kb/*', proxyToLocalApi)
}

