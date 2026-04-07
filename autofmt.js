<script>
(function () {
  const CLASS_NAME = "paren";

  function escapeHtml(html) {
    return html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function formatText(text) {
    return text.replace(/\(([^)]+)\)/g, (_, inside) => {
      return `<span class="${CLASS_NAME}">(${inside})</span>`;
    });
  }

  function getEditor() {
    return document.querySelector("[contenteditable]");
  }

  function safeSetHTML(el, html) {
    const sel = window.getSelection();
    const range = sel && sel.rangeCount ? sel.getRangeAt(0) : null;

    el.innerHTML = html;

    // восстановление курсора (простая версия)
    if (range) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  function init() {
    const editor = getEditor();
    if (!editor) return;

    let lock = false;

    editor.addEventListener("input", () => {
      if (lock) return;
      lock = true;

      const raw = editor.innerHTML;

      // временно убираем HTML → работаем как с текстом
      const temp = document.createElement("div");
      temp.innerHTML = raw;

      const text = temp.textContent || "";

      const formatted = formatText(escapeHtml(text));

      safeSetHTML(editor, formatted);

      lock = false;
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
</script>
