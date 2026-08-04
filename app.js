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
  const mobileLedger = matchMedia("(max-width: 680px)");
  let diagramCount = 0;
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

  function renderMermaid(lines) {
    const labels = new Map();
    for (const line of lines) {
      for (const match of line.matchAll(/(\w+)\[([^\]]+)\]/g)) labels.set(match[1], match[2]);
    }
    const edges = lines.slice(1).map((line) => line.trim().match(/^(\w+)(?:\[[^\]]+\])?\s*-->\s*(?:\|([^|]+)\|\s*)?(\w+)(?:\[[^\]]+\])?$/)).filter(Boolean);
    if (!edges.length) return "";
    const ids = [...new Set(edges.flatMap((edge) => [edge[1], edge[3]]))];
    const outgoing = new Map(ids.map((id) => [id, edges.filter((edge) => edge[1] === id)]));
    const incoming = new Map(ids.map((id) => [id, edges.filter((edge) => edge[3] === id)]));
    const nodeText = (id) => (labels.get(id) || id).replace(/<br\s*\/?\s*>/gi, " · ");
    const nodeLabel = (id) => escapeHtml(nodeText(id));
    const root = ids.find((id) => incoming.get(id).length === 0) || ids[0];
    const linear = edges.length === ids.length - 1 && ids.every((id) => outgoing.get(id).length <= 1 && incoming.get(id).length <= 1);
    const figureNumber = ++diagramCount;
    const titleId = `flow-title-${figureNumber}`;

    if (linear) {
      const ordered = [];
      let current = root;
      while (current && !ordered.includes(current)) {
        ordered.push(current);
        current = outgoing.get(current)[0]?.[3];
      }
      const summary = `${nodeLabel(ordered[0])}에서 ${nodeLabel(ordered.at(-1))}까지 ${ordered.length}단계로 진행합니다.`;
      const steps = ordered.map((id, index) => {
        const handoff = outgoing.get(id)[0]?.[2];
        return `<li><span class="process-number">${String(index + 1).padStart(2, "0")}</span><strong>${nodeLabel(id)}</strong>${handoff ? `<small>${escapeHtml(handoff)}</small>` : ""}</li>`;
      }).join("");
      return `<figure class="flow-diagram flow-diagram-linear" aria-label="문서 흐름도">
        <header class="flow-plate-head"><span>PROCESS PLATE · ${String(figureNumber).padStart(2, "0")}</span><strong>${ordered.length}단계 실행 흐름</strong></header>
        <ol class="process-strip" style="--step-count:${ordered.length}" aria-labelledby="${titleId}">${steps}</ol>
        <figcaption id="${titleId}">${summary}</figcaption>
      </figure>`;
    }

    const adjacency = new Map(ids.map((id) => [id, outgoing.get(id).map((edge) => edge[3])]));
    const visiting = new Set();
    const visited = new Set();
    const backEdges = new Set();
    function markBackEdges(id) {
      if (visited.has(id)) return;
      visiting.add(id);
      for (const target of adjacency.get(id)) {
        if (visiting.has(target)) backEdges.add(`${id}:${target}`);
        else markBackEdges(target);
      }
      visiting.delete(id);
      visited.add(id);
    }
    markBackEdges(root);
    for (const id of ids) markBackEdges(id);

    const forwardEdges = edges.filter((edge) => !backEdges.has(`${edge[1]}:${edge[3]}`));
    const forwardIncoming = new Map(ids.map((id) => [id, forwardEdges.filter((edge) => edge[3] === id).length]));
    const levels = new Map(ids.map((id) => [id, 0]));
    const ready = ids.filter((id) => forwardIncoming.get(id) === 0);
    while (ready.length) {
      const id = ready.shift();
      for (const edge of forwardEdges.filter((item) => item[1] === id)) {
        levels.set(edge[3], Math.max(levels.get(edge[3]), levels.get(id) + 1));
        forwardIncoming.set(edge[3], forwardIncoming.get(edge[3]) - 1);
        if (forwardIncoming.get(edge[3]) === 0) ready.push(edge[3]);
      }
    }

    const groups = new Map();
    for (const id of ids) {
      const level = levels.get(id);
      if (!groups.has(level)) groups.set(level, []);
      groups.get(level).push(id);
    }
    const maxLevel = Math.max(...groups.keys());
    const nodeWidth = 180;
    const nodeHeight = 88;
    const width = 920;
    const height = maxLevel * 132 + nodeHeight + 80;
    const points = new Map();
    for (const [level, group] of groups) {
      const usable = width - nodeWidth - 80;
      group.forEach((id, index) => points.set(id, {
        x: 40 + (group.length === 1 ? usable / 2 : index * usable / (group.length - 1)),
        y: 40 + level * 132
      }));
    }

    const split = ids.find((id) => outgoing.get(id).length >= 2);
    const merge = ids.find((id) => incoming.get(id).length >= 2);
    const allLabels = ids.map(nodeText).join(" ");
    const plateType = /증상 재현|근본 원인/.test(allLabels) ? "DIAGNOSIS LOOP" : backEdges.size ? "REVIEW LOOP" : split && merge ? "DEPENDENCY MAP" : split ? "DECISION MAP" : "EVIDENCE MAP";
    const arrowId = `flow-arrow-${figureNumber}`;
    const proofArrowId = `flow-proof-arrow-${figureNumber}`;
    const paths = edges.map((edge) => {
      const from = points.get(edge[1]);
      const to = points.get(edge[3]);
      const fromX = from.x + nodeWidth / 2;
      const fromY = from.y + nodeHeight / 2;
      const toX = to.x + nodeWidth / 2;
      const toY = to.y + nodeHeight / 2;
      const dx = toX - fromX;
      const dy = toY - fromY;
      const boundary = 1 / Math.max(Math.abs(dx) / (nodeWidth / 2), Math.abs(dy) / (nodeHeight / 2));
      const x1 = fromX + dx * boundary;
      const y1 = fromY + dy * boundary;
      const x2 = toX - dx * boundary;
      const y2 = toY - dy * boundary;
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const returning = backEdges.has(`${edge[1]}:${edge[3]}`);
      const controlX = returning ? Math.max(18, Math.min(x1, x2) - 150) : mx;
      const controlY = my;
      const label = edge[2] ? `<text class="flow-label" x="${controlX}" y="${controlY - 8}">${escapeHtml(edge[2])}</text>` : "";
      const kind = returning ? " flow-line-back" : edge[1] === split ? " flow-line-branch" : "";
      return `<path class="flow-line${kind}" d="M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}" marker-end="url(#${returning ? proofArrowId : arrowId})"/>${label}`;
    }).join("");
    const nodes = ids.map((id, index) => {
      const point = points.get(id);
      const raw = nodeText(id);
      const classes = ["flow-node"];
      let kind = "STEP";
      if (id === root) { classes.push("flow-node-origin"); kind = "ENTRY"; }
      if (outgoing.get(id).length >= 2) { classes.push("flow-node-decision"); kind = "GATE"; }
      if (incoming.get(id).length >= 2) { classes.push("flow-node-merge"); kind = "MERGE"; }
      if (outgoing.get(id).length === 0) { classes.push("flow-node-terminal"); kind = "OUTCOME"; }
      if (/REVISE|REJECT|실패|Blocked|Blocker|finding|repair/i.test(raw)) classes.push("flow-node-proof");
      if (/ACCEPT|완료|receipt|통과/i.test(raw)) classes.push("flow-node-accept");
      if (/사람의 결정|중요 결정/i.test(raw)) { classes.push("flow-node-authority"); kind = "HUMAN"; }
      return `<foreignObject x="${point.x}" y="${point.y}" width="${nodeWidth}" height="${nodeHeight}"><div xmlns="http://www.w3.org/1999/xhtml" class="${classes.join(" ")}"><span class="flow-node-index">${String(index + 1).padStart(2, "0")} · ${kind}</span><strong>${escapeHtml(raw)}</strong></div></foreignObject>`;
    }).join("");
    const text = edges.map((edge) => `${nodeLabel(edge[1])} → ${edge[2] ? `${escapeHtml(edge[2])}: ` : ""}${nodeLabel(edge[3])}`).join("; ");
    const branchTargetIds = split ? outgoing.get(split).map((edge) => edge[3]) : [];
    const branchTargets = branchTargetIds.map(nodeLabel);
    const returnSummary = [...backEdges].map((key) => {
      const [from, to] = key.split(":");
      return `${nodeLabel(from)}에서 ${nodeLabel(to)}로 되돌아가는 회귀 경로입니다.`;
    }).join(" ");
    const summary = split
      ? `${nodeLabel(split)} 다음에는 ${branchTargets.join(", ")}의 ${branchTargets.length}개 경로가 있습니다.${returnSummary ? ` ${returnSummary}` : ""}`
      : `${nodeLabel(root)}에서 시작해 연결된 증거와 결과를 확인합니다.${returnSummary ? ` ${returnSummary}` : ""}`;
    const mobileEdges = edges.map((edge) => `<li${edge[1] === split ? ` class="flow-mobile-branch" aria-label="${nodeLabel(split)}에서 갈라지는 경로"` : ""}><span>${nodeLabel(edge[1])}</span><i>${edge[2] ? `${escapeHtml(edge[2])} →` : "→"}</i><strong>${nodeLabel(edge[3])}</strong></li>`).join("");
    return `<figure class="flow-diagram" aria-label="문서 흐름도">
      <header class="flow-plate-head"><span>${plateType} · ${String(figureNumber).padStart(2, "0")}</span><strong>${summary}</strong></header>
      <div class="flow-canvas"><svg viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="${titleId}"><title id="${titleId}">${summary}</title><defs><marker id="${arrowId}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"/></marker><marker id="${proofArrowId}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="proof-arrow" d="M 0 0 L 10 5 L 0 10 z"/></marker></defs>${paths}${nodes}</svg></div>
      <ol class="flow-mobile" aria-label="모바일용 흐름">${mobileEdges}</ol>
      <figcaption><span class="visually-hidden">${text}</span><span>실선은 실행, 붉은 점선은 수정 후 재진입을 뜻합니다.</span></figcaption>
    </figure>`;
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
        const diagram = fence[1] === "mermaid" && renderMermaid(body);
        html.push(diagram || `<pre${fence[1] ? ` data-language="${escapeHtml(fence[1])}"` : ""}><code>${escapeHtml(body.join("\n"))}</code></pre>`);
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
    ledger.innerHTML = `<h2>문서 찾아보기 <span>${docs.length}</span></h2>` + [...groups].map(([group, items], index) => `
      <details class="source-group"${index === 0 ? " open" : ""}>
        <summary>${escapeHtml(group)}</summary>
        <ul>${items.map((doc) => `<li><a href="#/${doc.path}" data-path="${doc.path}">${escapeHtml(doc.title)}</a></li>`).join("")}</ul>
      </details>`).join("");
  }

  function recommendedReading() {
    const readme = byPath.get("README.md");
    if (!readme) return [];
    const section = readme.raw.split(/^## 권장 학습 경로\s*$/m)[1]?.split(/^##\s/m)[0] || "";
    const result = [];
    let phase = "";
    for (const line of section.split("\n")) {
      const heading = line.match(/^###\s+(.+)/);
      if (heading) phase = heading[1].trim();
      for (const link of line.matchAll(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
        const [targetPath, targetAnchor] = link[2].split("#");
        const path = targetPath ? resolvePath("README.md", targetPath) : "README.md";
        if (!byPath.has(path)) continue;
        result.push({ path, heading: targetAnchor ? slug(decodeURIComponent(targetAnchor)) : "", label: link[1], phase });
      }
    }
    return result;
  }

  const recommended = recommendedReading();

  function recommendedNavigation(path) {
    const index = recommended.findIndex((item) => item.path === path);
    if (index < 0) return "";
    const link = (item, direction) => item ? `<a class="recommended-link ${direction}" href="#/${item.path}${item.heading ? `/${item.heading}` : ""}"><small>${direction === "previous" ? "이전 권장 문서" : "다음 권장 문서"}</small><span>${escapeHtml(item.label)}</span></a>` : "";
    return `<nav class="recommended-navigation" aria-label="권장 학습 경로">
      <p><span>README 권장 경로</span>${escapeHtml(recommended[index].phase)} · ${index + 1}/${recommended.length}</p>
      <div>${link(recommended[index - 1], "previous")}${link(recommended[index + 1], "next")}</div>
    </nav>`;
  }

  function setLedgerOpen(open) {
    const visible = mobileLedger.matches && open;
    ledger.dataset.open = String(visible);
    ledger.hidden = mobileLedger.matches && !visible;
    ledger.toggleAttribute("inert", mobileLedger.matches && !visible);
    menu.setAttribute("aria-expanded", String(visible));
    if (!home.hidden) {
      reader.hidden = !visible;
      reader.classList.toggle("ledger-only", visible);
    }
  }

  function showHome() {
    home.hidden = false;
    reader.hidden = true;
    reader.classList.remove("ledger-only", "not-found");
    document.title = "How I Use LLM Agents";
    setLedgerOpen(false);
    requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, 0)));
  }

  function showNotFound(path) {
    document.querySelectorAll(".source-ledger [aria-current]").forEach((item) => item.removeAttribute("aria-current"));
    article.innerHTML = `<section class="not-found-state" aria-labelledby="not-found-title">
      <p class="source-path">${escapeHtml(path)}</p>
      <h1 id="not-found-title">문서를 찾지 못했습니다</h1>
      <p>주소가 바뀌었거나 문서가 이동됐을 수 있습니다. 읽기 지도로 돌아가거나 README부터 다시 시작하세요.</p>
      <p class="source-actions"><a href="#/home">읽기 지도로 돌아가기</a><a href="#/README.md">README 읽기</a></p>
    </section>`;
    outline.innerHTML = "";
    home.hidden = true;
    reader.hidden = false;
    reader.classList.add("not-found");
    document.title = "문서를 찾지 못했습니다 · How I Use LLM Agents";
    setLedgerOpen(false);
    requestAnimationFrame(() => article.focus({ preventScroll: true }));
  }

  function showDocument(path, headingId) {
    const doc = byPath.get(path);
    if (!doc) { showNotFound(path); return; }
    const rendered = markdown(doc.raw, doc.path);
    const first = rendered.headings[0];
    const title = first ? first.label : doc.title;
    const body = first ? rendered.html.replace(new RegExp(`^<h${first.level}[^>]*>.*?</h${first.level}>\\s*`, "s"), "") : rendered.html;
    article.innerHTML = `
      <header class="document-header">
        <p class="source-path">${escapeHtml(doc.path)}</p>
        <h1>${escapeHtml(title)}</h1>
        <div class="source-actions"><a href="${doc.path}">원문 보기</a><a href="https://github.com/hjung3113/how-i-use-llm-agents/blob/main/${doc.path}">GitHub에서 보기</a><a href="#/home">읽기 지도로 돌아가기</a></div>
      </header>
      <div class="document-body" data-source-path="${doc.path}">${body}</div>
      ${recommendedNavigation(doc.path)}`;
    const local = rendered.headings.filter((item) => item.level >= 2 && item.level <= 3);
    outline.innerHTML = `<h2>이 문서의 목차</h2><ol>${local.map((item) => `<li class="level-${item.level}"><a href="#/${doc.path}/${item.id}">${escapeHtml(item.label)}</a></li>`).join("")}</ol>`;
    document.querySelectorAll(".source-ledger [aria-current]").forEach((item) => item.removeAttribute("aria-current"));
    const active = ledger.querySelector(`[data-path="${CSS.escape(doc.path)}"]`);
    if (active) {
      ledger.querySelectorAll(".source-group").forEach((group) => { group.open = false; });
      active.closest(".source-group").open = true;
      active.setAttribute("aria-current", "page");
    }
    home.hidden = true;
    reader.hidden = false;
    reader.classList.remove("ledger-only", "not-found");
    document.title = `${title} · How I Use LLM Agents`;
    setLedgerOpen(false);
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
    setLedgerOpen(open);
    if (open) requestAnimationFrame(() => ledger.querySelector("summary, a")?.focus());
  });
  ledger.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setLedgerOpen(false);
      menu.focus();
    }
  });
  addEventListener("keydown", (event) => {
    if (event.key === "Escape" && ledger.dataset.open === "true") {
      setLedgerOpen(false);
      menu.focus();
    }
  });
  mobileLedger.addEventListener("change", () => {
    const returnFocus = ledger.contains(document.activeElement);
    setLedgerOpen(false);
    if (returnFocus) menu.focus();
  });

  buildLedger();
  addEventListener("hashchange", route);
  route();
})();
