const BASE_PATH = "build/client";
const PROXY_TARGET = process.env.API_URL || "https://galacash-server-2-66220284668.asia-southeast2.run.app";

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    // API Proxy
    if (path.startsWith("/api")) {
      const targetUrl = new URL(path + url.search, PROXY_TARGET);

      // Clone headers to modify them
      const headers = new Headers(req.headers);
      headers.set("Host", targetUrl.host);
      headers.set("Origin", targetUrl.origin);

      try {
        const response = await fetch(targetUrl.toString(), {
          method: req.method,
          headers: headers,
          body: req.body,
        });
        return response;
      } catch (err) {
        console.error("Proxy error:", err);
        return new Response("Proxy Error", { status: 502 });
      }
    }

    // Static File Serving
    let filePath = path;
    if (filePath === "/") filePath = "/index.html";

    const file = Bun.file(`${BASE_PATH}${filePath}`);
    if (await file.exists()) {
      return new Response(file);
    }

    // SPA Fallback
    const indexFile = Bun.file(`${BASE_PATH}/index.html`);
    if (await indexFile.exists()) {
        return new Response(indexFile);
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Listening on http://localhost:${server.port}`);
