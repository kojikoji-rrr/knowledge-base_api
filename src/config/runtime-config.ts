import { Context } from 'hono'
import { AppEnv } from '../bindings'

export function isProduction(c: Context<AppEnv>): boolean {
  return c.env.APP_ENV === 'production'
}

export function allowedOrigin(c: Context<AppEnv>): string {
  return isProduction(c) ? c.env.APP_ALLOWED_ORIGIN || '*' : '*'
}

export function localApiBaseUrl(c: Context<AppEnv>): string {
  return c.env.LOCAL_API_BASE_URL.replace(/\/$/, '')
}

