export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 📄 GET PAGE
    if (request.method === "GET" && url.pathname === "/") {
      const html = await env.ASSETS.get("index.html");

      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    // 🎨 CSS
    if (url.pathname === "/style.css") {
      const css = await env.ASSETS.get("style.css");

      return new Response(css, {
        headers: { "Content-Type": "text/css" }
      });
    }

    // 🧠 GET STATE (ОДИН ОБЩИЙ ДОКУМЕНТ)
    if (request.method === "GET" && url.pathname === "/state") {
      const data = await env.DOC.get("doc") || "";
      return new Response(data);
    }

    // ✍️ SAVE STATE (ПЕРЕЗАПИСЬ ВСЕГО ДОКУМЕНТА)
    if (request.method === "POST" && url.pathname === "/state") {
      const text = await request.text();
      await env.DOC.put("doc", text);

      return new Response("ok");
    }

    return new Response("not found", { status: 404 });
  }
};
