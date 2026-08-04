---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Documentation hub surface brief

- Mode: Read. Audience spans beginner developers, practitioners, and PM/founders.
- Job: reconstruct how the author uses LLM agents, then reach every authoritative Markdown source without losing context.
- Primary action: follow the recommended reading path; direct action: open any source/heading within three actions.
- Proof: the complete first-party Markdown corpus, source links, examples, and evaluation evidence.
- Constraints: plain HTML/CSS/JS, GitHub Pages plus `file://`, no external runtime dependencies, accessible no-JS fallback.
- Direction: 설계 교정실. Approved comp: `.impeccable/mocks/comp-c.webp`.
- Memorable moment: three aligned columns connect what the author checks, how the repository is read, and what remains a human decision.

## Composition and medium inventory

| Commitment | Medium |
|---|---|
| thin masthead with product/source actions | semantic HTML + CSS |
| three unequal first-viewport columns | CSS grid, one-column mobile order |
| translucent alignment strips and registration marks | CSS pseudo-elements; decorative and hidden from accessibility tree |
| author check sequence | semantic ordered list |
| six-part reading path | semantic navigation links generated from source map |
| human-decision boundary and reviewer note | semantic aside with source citation |
| document/source navigation | semantic nav generated from corpus manifest |
| document reader with local outline | semantic article + sticky local nav |
| source-backed workflow and alignment diagrams | inline SVG or HTML/CSS with equivalent text |
| dense Markdown tables and code | semantic table/pre with responsive overflow at the element, never the page |

Do not literalize generated filenames, counts, or copy from the comp. The live corpus supplies every fact. No image-native region is required in the shipped interface.
