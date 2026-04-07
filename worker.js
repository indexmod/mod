export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const KEY = "home";

    // ----------------------
    // HTML (без KV!)
    // ----------------------
    if (url.pathname === "/") {
      return new Response(`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>mod</title>
<link rel="stylesheet" href="/style.css">
</head>
<body>
<div id="app" contenteditable="true"></div>

<script>
let app = document.getElementById("app");

async function load() {
  const res = await fetch("/doc/home");
  app.innerText = await res.text();
}

load();

// простой realtime autosave
let timeout;

app.addEventListener("input", () => {
  clearTimeout(timeout);
  timeout = setTimeout(async () => {
    await fetch("/doc/home", {
      method: "POST",
      body: app.innerText
    });
  }, 200);
});
</script>

</body>
</html>`, {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    // ----------------------
    // CSS (тоже без KV)
    // ----------------------
    if (url.pathname === "/style.css") {
      return new Response(`
        body {
          margin: 0;
          background: #0b0b10;
          color: #b08cff;
          font-family: monospace;
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
    // GET DOC
    // ----------------------
    if (url.pathname === "/doc/home" && request.method === "GET") {
      const data = await env.DOC.get(KEY);
      return new Response(data || "");
    }

    // ----------------------
    // SAVE DOC
    // ----------------------
    if (url.pathname === "/doc/home" && request.method === "POST") {
      const text = await request.text();
      await env.DOC.put(KEY, text);
      return new Response("ok");
    }

    return new Response("not found", { status: 404 });
  }
};
