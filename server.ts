import { file } from 'bun'
import { join } from 'path'

const PORT = parseInt(process.env.PORT || '3000')
const BASE_DIR = join(import.meta.dir, 'build/client')
const PROXY_TARGET =
  process.env.API_URL || 'https://galacash-server-2-66220284668.asia-southeast2.run.app'

console.log(`🚀 Starting Bun server on port ${PORT}...`)
console.log(`📂 Serving static files from: ${BASE_DIR}`)
console.log(`🔗 Proxying /api to: ${PROXY_TARGET}`)

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url)
    const path = url.pathname

    // API Proxy
    if (path.startsWith('/api')) {
      const targetUrl = new URL(path + url.search, PROXY_TARGET)

      // Clone headers to modify them
      const headers = new Headers(req.headers)
      headers.set('Host', targetUrl.host)
      headers.set('Origin', targetUrl.origin)

      try {
        const response = await fetch(targetUrl.toString(), {
          method: req.method,
          headers: headers,
          body: req.body,
        })
        return response
      } catch (err) {
        console.error('Proxy error:', err)
        return new Response('Proxy Error', { status: 502 })
      }
    }

    // Static File Serving
    let filePath = path
    if (filePath === '/' || filePath === '') filePath = '/index.html'

    const f = file(join(BASE_DIR, filePath))
    if (await f.exists()) {
      return new Response(f)
    }

    // SPA Fallback: serve index.html for unknown routes
    const indexHtml = file(join(BASE_DIR, 'index.html'))
    if (await indexHtml.exists()) {
      return new Response(indexHtml)
    }

    return new Response('Not Found', { status: 404 })
  },
})

console.log(`✅ Server listening on ${server.url}`)
