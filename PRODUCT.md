<!-- impeccable:product-schema 1 -->

# Product

## Platform

Static web documentation hub. It must work from GitHub Pages and by opening `index.html` directly with `file://`.

## Stack

Plain HTML, CSS, and JavaScript. No runtime framework, external UI dependency, module loader, or server-only fetch path.

## Users

- Developers beginning to use LLM agents
- Practitioners already running agent workflows
- PMs and founders who need to understand the author's design and decision process without learning the tooling first

## Purpose

Help a first-time reader accurately reconstruct how the author uses LLM agents, then follow the evidence into the repository's foundations, workflows, tooling, examples, templates, and evaluation material.

## Positioning

This is a source-complete reading map for a personal operating system, not a generic AI landing page, marketing site, or step-by-step product tutorial. The Markdown remains authoritative; the site makes it easier to understand and navigate.

## Operating context

The source corpus is the repository's first-party `README.md`, `CONTRIBUTING.md`, `docs/**/*.md`, `examples/**/*.md`, and `templates/**/*.md`. Readers enter through the author's mental model and can continue by learning level, question, source document, or heading.

## Constraints

- Preserve every source heading, paragraph, list, table, code block, quote, and link without changing meaning.
- Keep summaries visibly derived and link every rendered document to its Markdown source.
- Put understanding before application: explain how and why the author works this way before exposing templates or operational detail.
- Use source-backed examples and diagrams only where they clarify sequence, relationship, or authority; provide equivalent text.
- Keep keyboard, screen-reader, reduced-motion, mobile, no-JavaScript, and deep-link access intact.
- Avoid complex features. Navigation is the product; search is optional.

## Brand commitments

- Korean-first, with English technical terms introduced only when useful and explained on first use.
- Direct, evidence-oriented, calm, and editorial rather than promotional.
- No generic AI visual tells: gradient text, glowing blobs, decorative metrics, repeated card grids, or excessive rounded containers.
- The visual system should feel authored and human: readable typography, visible source provenance, restrained color, and diagrams that teach.

## Evidence on hand

- The repository's live first-party Markdown corpus
- The accepted web evaluation contract in `docs/90-evaluation/web-evaluation-rubric.md`
- Luna Max blind-reader reports and Sol High reviews stored as session evidence outside the product corpus
- Project-local Impeccable 4.0.4 skill installation

## Product principles

1. Start with the author's actual mental model, not tool features.
2. Let one canonical source support both guided reading and direct lookup.
3. Make authority, evidence, escalation, and human decision boundaries visible.
4. Reduce terminology friction without erasing precise distinctions.
5. Add only interactions and visuals that shorten understanding.
