# Blog LLM Readability Roadmap

## Goal

Make blog content on `porg.dev` reliably readable by non-JS crawlers, LLM tooling, and feed consumers while preserving interactive UX in the browser.

## Scope

This roadmap tracks seven work items:

1. SSR full post body on `/p/<slug>` (`porg-xix`)
2. Improve `/p/<slug>.md` mirror output (`porg-2f9`)
3. Ensure sitemap includes all generated post slugs (`porg-ccu`)
4. Add `llms-full.txt` index for model-friendly discovery (`porg-v04`)
5. Add fuller RSS payloads (including post body where possible) (`porg-r5f`)
6. Add crawler-readability regression tests (`porg-glq`)
7. Make interactive post components SSR-safe (`porg-6pb`)

## Dynamic Content Policy

Some post content is interactive (`.svx` components) and may not be renderable in plain Markdown mirrors or RSS payloads.

When content cannot be represented faithfully in RSS or Markdown:

- Emit a placeholder instead of silently dropping content.
- Placeholder must name what is missing.
- Placeholder can include an optional human-authored description.

### Placeholder Format

For Markdown mirrors:

```md
[Interactive content omitted: <ComponentName>]
```

Optional annotated form:

```md
[Interactive content omitted: <ComponentName> - <Description>]
```

For RSS `content:encoded`, use the same message in HTML:

```html
<p>[Interactive content omitted: <ComponentName> - <Description>]</p>
```

## Annotation Source

Preferred: explicit per-component annotation in post source, for example:

```svx
<!-- llm-placeholder: component=AtmuxInterfaceTour description="Animated walkthrough of atmux screen states." -->
<AtmuxInterfaceTour autoplay={true} intervalMs={6400} />
```

If no annotation exists, fall back to generic:

`[Interactive content omitted: <ComponentName>]`

## Definition Of Done (Project Level)

- HTML post pages expose readable body content server-side.
- Markdown mirrors are LLM-friendly and avoid raw Svelte template control syntax.
- RSS and Markdown never silently drop interactive blocks; placeholders appear when needed.
- Sitemap, RSS, llms.txt/llms-full.txt, and tests stay in sync with generated slugs.
