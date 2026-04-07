export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    // получить сообщения
    if (url.pathname === "/messages") {
      const data = await env.CHAT.get("log") || "";
      return new Response(data, { headers });
    }

    // отправить сообщение
    if (url.pathname === "/send" && request.method === "POST") {
      const text = await request.text();

      const old = await env.CHAT.get("log") || "";
      const updated = old + text + "\n";

      await env.CHAT.put("log", updated);

      return new Response("ok", { headers });
    }

    return new Response("not found", { status: 404 });
  }
};
