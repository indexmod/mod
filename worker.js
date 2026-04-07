export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 🔥 GET CHAT PAGE
    if (url.pathname === "/") {
      const html = await env.ASSETS.get("index.html");

      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    // 🎨 CSS FILE
    if (url.pathname === "/style.css") {
      const css = await env.ASSETS.get("style.css");

      return new Response(css, {
        headers: { "Content-Type": "text/css" }
      });
    }

    // 📜 GET MESSAGES
    if (url.pathname === "/messages") {
      return new Response(await env.CHAT.get("log") || "", {
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }

    // ✍️ SEND MESSAGE
    if (url.pathname === "/send") {
      const text = await request.text();
      const old = await env.CHAT.get("log") || "";

      await env.CHAT.put("log", old + text + "\n");

      return new Response("ok");
    }

    return new Response("not found", { status: 404 });
  }
};
