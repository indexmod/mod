export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const KEY = "home";

    // ----------------------
    // FRONTEND (без KV)
    // ----------------------
    if (url.pathname === "/") {
      return new Response(`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Mod</title>
<link rel="stylesheet" href="/styles.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">

<style>
  body {
    font-family: "IBM Plex Mono", monospace;
  }
</style>
</head>
<body>

<div id="app" contenteditable="true"></div>

<script>
const app = document.getElementById("app");

async function load() {
  const res = await fetch("/doc/home");
  app.innerText = await res.text();
}
load();

let t;
app.addEventListener("input", () => {
  clearTimeout(t);
  t = setTimeout(async () => {
    await fetch("/doc/home", {
      method: "POST",
      body: app.innerText
    });
  }, 200);
});
</script>
<script src="/autofmt.js" defer></script>
</body>
</html>`, {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    // ----------------------
    // CSS (из файла репо или fallback)
    // ----------------------
    if (url.pathname === "/styles.css") {
      return new Response(`
        body {
          margin: 0;
          background: #0b0b10;
          color: #b08cff;
          font-family: "IBM Plex Mono", monospace;
          font-size: 22px;
        }

        #app {
          padding: 40px;
          outline: none;
          white-space: pre-wrap;
          caret-color: #b08cff;
        }
      `, {
        headers: { "Content-Type": "text/css" }
      });
    }

    // ----------------------
    // GET
    // ----------------------
    if (url.pathname === "/doc/home" && request.method === "GET") {
      return new Response(await env.DOC.get(KEY) || "");
    }

    // ----------------------
    // POST
    // ----------------------
    if (url.pathname === "/doc/home" && request.method === "POST") {
      const text = await request.text();
      await env.DOC.put(KEY, text);
      return new Response("ok");
    }

    return new Response("not found", { status: 404 });
  }
};
