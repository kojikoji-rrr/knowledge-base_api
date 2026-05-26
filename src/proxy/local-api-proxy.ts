import { Context } from 'hono'
import { AppEnv } from '../bindings'
import { localApiBaseUrl } from '../config/runtime-config'

export async function proxyToLocalApi(c: Context<AppEnv>): Promise<Response> {
  const targetUrl = resolveTargetUrl(c)
  const response = await fetch(targetUrl, {
    method: c.req.method,
    headers: requestHeaders(c),
    body: ['GET', 'HEAD'].includes(c.req.method) ? undefined : await c.req.raw.clone().arrayBuffer(),
  })

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders(response),
  })
}

function resolveTargetUrl(c: Context<AppEnv>): URL {
  const sourceUrl = new URL(c.req.url)
  const targetUrl = new URL(`${localApiBaseUrl(c)}/v1${sourceUrl.pathname.replace(/^\/v1/, '')}`)
  targetUrl.search = sourceUrl.search
  return targetUrl
}

function requestHeaders(c: Context<AppEnv>): Headers {
  const headers = new Headers()
  const contentType = c.req.header('Content-Type')
  if (contentType) {
    headers.set('Content-Type', contentType)
  }
  return headers
}

function responseHeaders(response: Response): Headers {
  const headers = new Headers()
  const contentType = response.headers.get('Content-Type')
  const contentDisposition = response.headers.get('Content-Disposition')
  if (contentType) {
    headers.set('Content-Type', contentType)
  }
  if (contentDisposition) {
    headers.set('Content-Disposition', contentDisposition)
  }
  return headers
}

