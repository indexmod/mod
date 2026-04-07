export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // -------------------------
    // INDEX
    // -------------------------
    if (path === "/" || path === "/home") {
      const html = await env.ASSETS.get("index.html");

      return new Response(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8"
        }
      });
    }

    // -------------------------
    // CSS
    // -------------------------
    if (path === "/style.css") {
      const css = await env.ASSETS.get("style.css");

      return new Response(css, {
        headers: {
          "Content-Type": "text/css"
        }
      });
    }

    // -------------------------
    // GET TEXT
    // -------------------------
    if (path.startsWith("/api/page/") && request.method === "GET") {
      const key = path.replace("/api/page/", "");
      const data = await env.DOC.get(key);

      return new Response(data || "");
    }

    // -------------------------
    // SAVE TEXT (RAW TEXT ONLY)
    // -------------------------
    if (path.startsWith("/api/page/") && request.method === "POST") {
      const key = path.replace("/api/page/", "");
      const body = await request.text();

      await env.DOC.put(key, body);

      return new Response("ok");
    }

    return new Response("not found", { status: 404 });
  }
};
