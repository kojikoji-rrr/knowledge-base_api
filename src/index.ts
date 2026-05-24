import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  APP_ENV: string
}

const app = new Hono<{ Bindings: Bindings }>().basePath('/v1')

app.use(
  '/*',
  async (c, next) => {
    const corsMiddleware = cors({
      origin: c.env.APP_ENV === 'production' ? 'https://knowledge-base.kojikox.com' : '*',
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    })
    return corsMiddleware(c, next)
  }
)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/hello', (c) => {
  return c.json({
    message: '通信できてます！'
  })
})

export default app