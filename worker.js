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
<link rel="icon" type="image/svg+xml"
href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='14' fill='%23a855f7'/%3E%3C/svg%3E">
<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://mod.indexmod.press">
<meta property="og:title" content="Mod">
<meta property="og:description" content="Страница меняется в реальном времени. Коллективное редактирование.">
<meta property="og:image" content="https://mod.indexmod.press/telegram-preview.png">
<!-- Дополнительно -->
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="Mod">
<meta property="og:locale" content="ru_RU">

<!-- Twitter / Telegram -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Mod">
<meta name="twitter:description" content="Страница меняется в реальном времени. Коллективное редактирование.">
<meta name="twitter:image" content="https://mod.indexmod.press/telegram-preview.png">
<meta name="twitter:url" content="https://mod.indexmod.press">

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
