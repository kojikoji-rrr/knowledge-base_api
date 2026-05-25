import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  APP_ENV: string
  LOCAL_API_BASE_URL: string
}

const app = new Hono<{ Bindings: Bindings }>().basePath('/v1')

app.use('/*', async (c, next) => {
  const corsMiddleware = cors({
    origin: c.env.APP_ENV === 'production' ? 'https://knowledge-base.kojikox.com' : '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  })
  return corsMiddleware(c, next)
})

app.get('/', (c) => c.text('Knowledge Base API is running.'))

app.all('/kb/*', async (c) => {
  const baseUrl = c.env.LOCAL_API_BASE_URL.replace(/\/$/, '')
  const sourceUrl = new URL(c.req.url)
  const targetUrl = new URL(`${baseUrl}/v1${sourceUrl.pathname.replace(/^\/v1/, '')}`)
  targetUrl.search = sourceUrl.search

  const response = await fetch(targetUrl, {
    method: c.req.method,
    headers: {
      'Content-Type': c.req.header('Content-Type') ?? 'application/json',
    },
    body: ['GET', 'HEAD'].includes(c.req.method) ? undefined : await c.req.raw.clone().arrayBuffer(),
  })

  return new Response(response.body, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') ?? 'application/json',
    },
  })
})

export default app
