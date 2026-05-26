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
  const headers = new Headers()
  const contentType = c.req.header('Content-Type')
  if (contentType) {
    headers.set('Content-Type', contentType)
  }

  const response = await fetch(targetUrl, {
    method: c.req.method,
    headers,
    body: ['GET', 'HEAD'].includes(c.req.method) ? undefined : await c.req.raw.clone().arrayBuffer(),
  })
  const responseHeaders = new Headers()
  const responseContentType = response.headers.get('Content-Type')
  const contentDisposition = response.headers.get('Content-Disposition')
  if (responseContentType) {
    responseHeaders.set('Content-Type', responseContentType)
  }
  if (contentDisposition) {
    responseHeaders.set('Content-Disposition', contentDisposition)
  }

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  })
})

export default app
