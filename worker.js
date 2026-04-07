export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const headers = {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    };

    // GET CHAT LOG
    if (url.pathname === "/messages") {
      return new Response(await env.CHAT.get("log") || "", { headers });
    }

    // SEND MESSAGE
    if (url.pathname === "/send") {
      const text = await request.text();
      const old = await env.CHAT.get("log") || "";

      const updated = old + text + "\n";
      await env.CHAT.put("log", updated);

      return new Response("ok", { headers });
    }

    return new Response("not found", { status: 404 });
  }
};
