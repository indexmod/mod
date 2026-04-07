export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const headers = {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    };

    // ROOT
    if (url.pathname === "/") {
      return new Response("MOD CHAT ONLINE", { headers });
    }

    // GET MESSAGES
    if (url.pathname === "/messages") {
      const data = await env.CHAT.get("log") || "empty";
      return new Response(data, { headers });
    }

    // SEND MESSAGE
    if (url.pathname === "/send") {
      const text = await request.text();
      const old = await env.CHAT.get("log") || "";

      const updated = old + text + "\n";
      await env.CHAT.put("log", updated);

      return new Response("ok", { headers });
    }

    return new Response("not found", { status: 404, headers });
  }
};
