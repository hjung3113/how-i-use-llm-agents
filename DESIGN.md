---
name: "How I Use LLM Agents"
description: "A Korean-first proof-paper reading map for an evidence-led agent operating system."
colors:
  paper: "#f7f7f2"
  paper-deep: "#eceee9"
  ink: "#152631"
  muted: "#52636b"
  rule: "#9eb1b5"
  teal: "#177d84"
  teal-soft: "rgba(23, 125, 132, 0.1)"
  proof: "#b9332a"
  focus: "#075f66"
typography:
  display:
    fontFamily: "SUITE Display, Apple SD Gothic Neo, sans-serif"
    fontSize: "clamp(3.2rem, 5.4vw, 5.2rem)"
    fontWeight: 800
    lineHeight: 0.94
    letterSpacing: "-0.035em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans KR, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.78rem"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  square: "0"
spacing:
  compact: "0.65rem"
  standard: "1rem"
  column: "1.35rem"
  section: "2rem"
components:
  menu-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "0.35rem 0.65rem"
  reading-path-item:
    backgroundColor: "{colors.teal-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "0.45rem 0.75rem"
  proof-note:
    textColor: "{colors.proof}"
    rounded: "{rounded.square}"
    padding: "1rem 0 0"
---

# Design System: How I Use LLM Agents

## Overview

**Creative North Star: "The Design Proof Room"**

This is a Korean-first editorial reading environment that treats an agent workflow as something to inspect, align, and verify. Off-white paper, blue-black ink, thin ledger rules, and numbered procedural marks make source provenance and human decision boundaries tangible without turning documentation into a product landing page.

The system is deliberately flat and spare. Teal carries orientation and alignment; vermilion appears only where a correction, warning, or human boundary needs attention. The page earns its visual character through typographic scale, square-edged structure, and the recurring proof-table grammar rather than cards, gradients, or decorative metrics.

**Key Characteristics:**

- Korean-led editorial typography with one heavy display face.
- Proof-paper layering: rules, registration marks, source paths, and numbered steps.
- Dense but calm reading surfaces with one clear primary path.
- Sparse teal for alignment and sparse vermilion for correction.

## Colors

The palette is an archival proof sheet: paper and ink do most of the work, while color acts as a precise annotation system.

### Primary

- **Registration Teal:** navigation states, sequence markers, source paths, links, and alignment strips use the teal token.
- **Correction Vermilion:** reviewer notes, key corrections, and human-decision boundaries use the proof token; it is an exception signal, never general decoration.

### Neutral

- **Proof Paper:** the page surface uses the paper token, including the opaque overlays behind structural marks.
- **Paper Underside:** inline code and related quiet surfaces use the paper-deep token.
- **Blue-Black Ink:** headings, body copy, borders, and numbered path blocks use the ink token.
- **Ledger Gray:** secondary text and quiet navigation use the muted token; structural dividers use the rule token.

### Named Rules

**The Correction-Only Rule.** Use vermilion only to mark a correction, warning, or retained human decision; do not spend it on ordinary links, fills, or decoration.

**The Ink-First Rule.** Reading hierarchy begins with paper, ink, and rules. Teal supports orientation instead of becoming a second dominant surface color.

## Typography

**Display Font:** SUITE Display (with Apple SD Gothic Neo and sans-serif fallbacks)

**Body Font:** system UI stack (-apple-system, BlinkMacSystemFont, Segoe UI, Noto Sans KR, sans-serif)

**Label/Mono Font:** UI monospace stack (ui-monospace, SFMono-Regular, Menlo, monospace)

**Character:** Heavy Korean display type gives the hub its authored voice; the system body stack keeps long technical source material quiet and dependable. Monospace is reserved for evidence-facing labels such as source paths, counters, and process markers.

### Hierarchy

- **Display** (800, responsive display scale, tight line-height): home and document titles establish the reading subject.
- **Headline** (700, responsive 1.15–3rem scale, 1.08–1.2 line-height): section and column headings organize the proof table and reader.
- **Body** (400, 1rem, 1.65 line-height): source-derived reading copy stays comfortably legible in the 72ch measure.
- **Label** (600, 0.78rem, monospace): source paths, step numbers, and fine evidence labels remain compact and visibly distinct.

### Named Rules

**The Evidence Label Rule.** Monospace is for traceable process information, never for paragraph copy or decorative texture.

## Layout

The home surface is an unequal three-column proof table: author checks, the dominant reading path, and human decisions. Structural rules, arrow connectors, and registration marks make the relationship legible. On medium screens it becomes a two-column arrangement with the decision boundary spanning below; on small screens the reading path leads, then checks, then decisions.

The document reader uses a three-part ledger: sticky source navigation, a centered document column, and a sticky local outline. Its reading measure is 72ch; wide tables and code scroll inside their own element rather than widening the page. The masthead remains visible at the top, and its compact height is preserved as a layout token.

**The Reading-Path-First Rule.** On mobile, preserve the central recommended sequence as the first content column; do not collapse it into a generic card stack.

## Elevation & Depth

This is a flat system. Depth comes from paper-tone overlays, borders, sticky positioning, and translucent teal alignment strips—not shadows, blur, or floating card layers. The masthead's nearly opaque paper surface and the mobile source ledger's paper panel separate navigation from reading without introducing a shadow vocabulary.

**The Flat Proof Rule.** A new surface should use a rule, tonal paper layer, or position change before adding a shadow.

## Shapes

Square edges are the default form language. Buttons, code blocks, tables, numbered markers, source rows, and panels use the square radius token. Thin one-pixel borders and horizontal rules establish containment; plus, arrow, cross, and box marks work as technical proofing symbols rather than rounded ornament.

## Components

### Buttons

The mobile document-menu control is a compact, square-outline utility control.

- **Shape:** square corners (0).
- **Primary:** transparent paper surface, ink text, and a one-pixel ink border with compact horizontal padding.
- **Hover / Focus:** keyboard focus uses the focus token as a three-pixel outline with an offset; do not substitute a glow.

### Navigation

Navigation is a source ledger, not a tab bar. Masthead links are quiet underlined text; the reading path is a numbered, bordered sequence with ink number blocks and a translucent teal-to-transparent strip. Source-ledger and local-outline rows use muted text at rest and teal-soft background with ink text on hover or current state.

### Lists and Process Markers

Checklist and alignment-flow rows are bordered records. Their counters are compact mono labels, boxed or teal, so sequence is visible before the reader parses the prose. Arrow connectors link proof-table columns only at wide sizes; they disappear before the layout reflows.

### Reader Surfaces

The document reader is a centered paper column with a strong header rule, a teal mono source path, and a square-ended source-action row. Blockquotes use a teal left rule and teal-soft fill; code blocks invert to ink with pale text; tables use structural rules and a teal-soft header.

### Correction Note

The proof note is a sparse vermilion boundary: a top correction rule, compact copy, and a single cross mark. It carries the distinction between reviewer evaluation and the user's decision authority.

## Do's and Don'ts

### Do:

- **Do** keep a visible source path, numbered sequence, or ledger rule wherever the interface represents provenance or workflow order.
- **Do** use the paper/ink hierarchy first, teal for alignment, and vermilion only for correction-level meaning.
- **Do** preserve the 72ch document reading measure and confine wide code or tables to local horizontal overflow.
- **Do** retain square edges and one-pixel structural rules on new reader and navigation surfaces.

### Don't:

- **Don't** introduce rounded cards, soft drop shadows, glass effects, or floating dashboard panels.
- **Don't** use gradient text, glowing blobs, decorative metrics, or generic AI-marketing imagery.
- **Don't** turn teal or vermilion into large, competing color fields.
- **Don't** remove the mobile reading-path priority or replace the ledger with an opaque navigation pattern.
