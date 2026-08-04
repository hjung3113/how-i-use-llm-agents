(function () {
  "use strict";

  const docs = Array.isArray(window.DOCS) ? window.DOCS : [];
  const byPath = new Map(docs.map((doc) => [doc.path, doc]));
  const home = document.querySelector("#home");
  const reader = document.querySelector("#reader");
  const article = document.querySelector("#document");
  const ledger = document.querySelector("#source-ledger");
  const outline = document.querySelector("#local-outline");
  const menu = document.querySelector(".menu-button");
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function slug(value) {
    return value.toLowerCase().trim()
      .replace(/<[^>]+>/g, "")
      .replace(/[\s/]+/g, "-")
      .replace(/[^\p{L}\p{N}._-]/gu, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "section";
  }

  function resolvePath(from, target) {
    if (/^(?:[a-z]+:|#|\/)/i.test(target)) return target;
    const clean = target.split("#")[0].split("?")[0];
    if (!clean.endsWith(".md")) return target;
    const parts = from.split("/");
    parts.pop();
    for (const part of clean.split("/")) {
      if (part === "..") parts.pop();
      else if (part !== ".") parts.push(part);
    }
    return parts.join("/");
  }

  function inline(value, sourcePath) {
    const code = [];
    let text = escapeHtml(value).replace(/`([^`]+)`/g, (_, body) => {
      code.push(`<code>${body}</code>`);
      return `\u0000CODE${code.length - 1}\u0000`;
    });
    text = text.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;[^&]*&quot;)?\)/g, (_, alt, target) => {
      const resolved = resolvePath(sourcePath, target);
      return `<img src="${resolved}" alt="${alt}">`;
    });
    text = text.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+&quot;[^&]*&quot;)?\)/g, (_, label, target) => {
      const [path, anchor] = target.split("#");
      if (!path && anchor) return `<a href="#/${sourcePath}/${slug(decodeURIComponent(anchor))}">${label}</a>`;
      const resolved = resolvePath(sourcePath, path || target);
      if (byPath.has(resolved)) {
        const suffix = anchor ? `/${slug(decodeURIComponent(anchor))}` : "";
        return `<a href="#/${resolved}${suffix}">${label}</a>`;
      }
      return `<a href="${target}">${label}</a>`;
    });
    text = text
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/__([^_]+)__/g, "<strong>$1</strong>")
      .replace(/~~([^~]+)~~/g, "<del>$1</del>")
      .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
      .replace(/ {2}$/g, "<br>");
    return text.replace(/\u0000CODE(\d+)\u0000/g, (_, index) => code[Number(index)]);
  }

  function renderList(lines, sourcePath) {
    const parsed = lines.map((line) => {
      const match = line.match(/^(\s*)([-+*]|\d+\.)\s+(.*)$/);
      return { indent: match[1].replace(/\t/g, "    ").length, ordered: /\d/.test(match[2]), text: match[3] };
    });

    function level(start, indent, ordered) {
      const items = [];
      let index = start;
      while (index < parsed.length) {
        const current = parsed[index];
        if (current.indent < indent || current.ordered !== ordered && current.indent === indent) break;
        if (current.indent > indent) {
          const child = level(index, current.indent, current.ordered);
          if (items.length) items[items.length - 1].children.push(child.html);
          index = child.index;
          continue;
        }
        const item = { text: current.text, children: [] };
        items.push(item);
        index += 1;
        if (index < parsed.length && parsed[index].indent > indent) {
          const child = level(index, parsed[index].indent, parsed[index].ordered);
          item.children.push(child.html);
          index = child.index;
        }
      }
      const tag = ordered ? "ol" : "ul";
      return {
        html: `<${tag}>${items.map((item) => `<li>${inline(item.text, sourcePath)}${item.children.join("")}</li>`).join("")}</${tag}>`,
        index
      };
    }

    return level(0, parsed[0].indent, parsed[0].ordered).html;
  }

  function isBoundary(lines, index) {
    const line = lines[index] || "";
    return !line.trim() || /^#{1,6}\s/.test(line) || /^```/.test(line) || /^>\s?/.test(line) || /^(\s*)([-+*]|\d+\.)\s+/.test(line) || /^\s*([-*_])(?:\s*\1){2,}\s*$/.test(line);
  }

  function markdown(raw, sourcePath) {
    const lines = raw.replace(/\r\n?/g, "\n").split("\n");
    const html = [];
    const headings = [];
    const used = new Map();
    let index = 0;

    while (index < lines.length) {
      const line = lines[index];
      if (!line.trim()) { index += 1; continue; }

      const fence = line.match(/^```\s*([^\s]*)/);
      if (fence) {
        const body = [];
        index += 1;
        while (index < lines.length && !/^```/.test(lines[index])) body.push(lines[index++]);
        if (index < lines.length) index += 1;
        html.push(`<pre${fence[1] ? ` data-language="${escapeHtml(fence[1])}"` : ""}><code>${escapeHtml(body.join("\n"))}</code></pre>`);
        continue;
      }

      const heading = line.match(/^(#{1,6})\s+(.+?)\s*#*$/);
      if (heading) {
        const level = heading[1].length;
        const label = heading[2];
        const base = slug(label);
        const count = used.get(base) || 0;
        used.set(base, count + 1);
        const id = count ? `${base}-${count + 1}` : base;
        headings.push({ level, label: label.replace(/[*_`]/g, ""), id });
        html.push(`<h${level} id="${id}">${inline(label, sourcePath)}</h${level}>`);
        index += 1;
        continue;
      }

      if (/^\s*([-*_])(?:\s*\1){2,}\s*$/.test(line)) {
        html.push("<hr>"); index += 1; continue;
      }

      if (/^>\s?/.test(line)) {
        const quote = [];
        while (index < lines.length && /^>\s?/.test(lines[index])) quote.push(lines[index++].replace(/^>\s?/, ""));
        html.push(`<blockquote>${markdown(quote.join("\n"), sourcePath).html}</blockquote>`);
        continue;
      }

      if (/^(\s*)([-+*]|\d+\.)\s+/.test(line)) {
        const list = [];
        while (index < lines.length && (/^(\s*)([-+*]|\d+\.)\s+/.test(lines[index]) || /^\s{2,}\S/.test(lines[index]))) list.push(lines[index++]);
        html.push(renderList(list, sourcePath));
        continue;
      }

      if (line.includes("|") && index + 1 < lines.length && /^\s*\|?\s*:?-{3,}/.test(lines[index + 1])) {
        const rows = [line];
        index += 2;
        while (index < lines.length && lines[index].includes("|") && lines[index].trim()) rows.push(lines[index++]);
        const cells = rows.map((row) => row.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim()));
        const head = `<thead><tr>${cells[0].map((cell) => `<th>${inline(cell, sourcePath)}</th>`).join("")}</tr></thead>`;
        const body = `<tbody>${cells.slice(1).map((row) => `<tr>${row.map((cell) => `<td>${inline(cell, sourcePath)}</td>`).join("")}</tr>`).join("")}</tbody>`;
        html.push(`<div class="table-wrap"><table>${head}${body}</table></div>`);
        continue;
      }

      const paragraph = [line.trim()];
      index += 1;
      while (index < lines.length && !isBoundary(lines, index) && !(lines[index].includes("|") && /^\s*\|?\s*:?-{3,}/.test(lines[index + 1] || ""))) {
        paragraph.push(lines[index].trim());
        index += 1;
      }
      html.push(`<p>${inline(paragraph.join(" "), sourcePath)}</p>`);
    }

    return { html: html.join("\n"), headings };
  }

  function buildLedger() {
    const groups = new Map();
    for (const doc of docs) {
      if (!groups.has(doc.group)) groups.set(doc.group, []);
      groups.get(doc.group).push(doc);
    }
    ledger.innerHTML = `<h2>전체 문서 <span>${docs.length}</span></h2>` + [...groups].map(([group, items]) => `
      <details class="source-group" open>
        <summary>${escapeHtml(group)}</summary>
        <ul>${items.map((doc) => `<li><a href="#/${doc.path}" data-path="${doc.path}">${escapeHtml(doc.title)}</a></li>`).join("")}</ul>
      </details>`).join("");
  }

  function showHome() {
    home.hidden = false;
    reader.hidden = true;
    reader.classList.remove("ledger-only");
    document.title = "How I Use LLM Agents";
    menu.setAttribute("aria-expanded", "false");
    ledger.dataset.open = "false";
    requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, 0)));
  }

  function showDocument(path, headingId) {
    const doc = byPath.get(path);
    if (!doc) { showHome(); return; }
    const rendered = markdown(doc.raw, doc.path);
    const first = rendered.headings[0];
    const title = first ? first.label : doc.title;
    const body = first ? rendered.html.replace(new RegExp(`^<h${first.level}[^>]*>.*?</h${first.level}>\\s*`, "s"), "") : rendered.html;
    article.innerHTML = `
      <header class="document-header">
        <p class="source-path">${escapeHtml(doc.path)}</p>
        <h1>${escapeHtml(title)}</h1>
        <div class="source-actions"><a href="${doc.path}">원본 Markdown</a><a href="https://github.com/hjung3113/how-i-use-llm-agents/blob/main/${doc.path}">GitHub에서 보기</a><a href="#/home">읽기 지도로 돌아가기</a></div>
      </header>
      <div class="document-body" data-source-path="${doc.path}">${body}</div>`;
    const local = rendered.headings.filter((item) => item.level >= 2 && item.level <= 3);
    outline.innerHTML = `<h2>이 문서의 목차</h2><ol>${local.map((item) => `<li class="level-${item.level}"><a href="#/${doc.path}/${item.id}">${escapeHtml(item.label)}</a></li>`).join("")}</ol>`;
    document.querySelectorAll(".source-ledger [aria-current]").forEach((item) => item.removeAttribute("aria-current"));
    const active = ledger.querySelector(`[data-path="${CSS.escape(doc.path)}"]`);
    if (active) active.setAttribute("aria-current", "page");
    home.hidden = true;
    reader.hidden = false;
    reader.classList.remove("ledger-only");
    document.title = `${title} · How I Use LLM Agents`;
    menu.setAttribute("aria-expanded", "false");
    ledger.dataset.open = "false";
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const target = headingId && document.getElementById(headingId);
      if (target) target.scrollIntoView();
      else { article.focus({ preventScroll: true }); window.scrollTo(0, 0); }
    }));
  }

  function route() {
    const match = location.hash.match(/^#\/(.+?\.md)(?:\/(.*))?$/);
    if (!match) { showHome(); return; }
    showDocument(decodeURIComponent(match[1]), match[2] ? decodeURIComponent(match[2]) : "");
  }

  menu.addEventListener("click", () => {
    const open = ledger.dataset.open !== "true";
    if (!home.hidden) {
      reader.hidden = !open;
      reader.classList.toggle("ledger-only", open);
    }
    ledger.dataset.open = String(open);
    menu.setAttribute("aria-expanded", String(open));
  });
  ledger.addEventListener("click", (event) => {
    if (event.target.closest("a")) ledger.dataset.open = "false";
  });

  buildLedger();
  addEventListener("hashchange", route);
  route();
})();
