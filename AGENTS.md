# AGENTS.md

Edge Delivery Services. Read a block first. Omissions are in the repo or known.

## Avoid
- `scripts/aem.js` is vendored. Never edit.
- Markup comes from the backend. `curl localhost:3000/x.plain.html` first.
- `buildAutoBlocks` rewrites content before your block runs.
- Authors omit and add cells. Decorate defensively.
- No build step; devDependencies only.
- Scope CSS to `.blockname`; `-wrapper`/`-container` are section classes.
- `fragment/fragment.js` is the only cross-block import. Otherwise use `/scripts/`.

## Outdated
- `fstab.yaml`, `paths.json` are retired. Config lives at tools.aem.live.

## Query index
- `helix-query.yaml` is committed as the versioned, canonical, reviewable reference for the query-index columns the dynamic blocks read. The LIVE runtime index config still lives at tools.aem.live — keep the two in sync (mirror any column change in the same PR).
- Runtime `/query-index.json` is generated server-side (tools.aem.live), NOT by `aem up`. For local dev, a generated `/query-index.json` under the content root lets the dynamic `cards-article` variant render offline.
- Dynamic `cards-article` (class `cards-article dynamic`) reads columns: `path,title,description,image,lastModified,robots,activity`; filters by `source` prefix + optional `activity`; sorts newest-first; caps by `limit`.

## Remember
- `npx -y @adobe/aem-cli up`: local code, previewed content.
- Merging `main` ships code; content publishes separately.
- A PR without a `{branch}--{repo}--{owner}.aem.page/{path}` link is rejected.
- All committed files are served. Use `.hlxignore`.
- Skills: `/plugin marketplace add adobe/skills`, then `aem-edge-delivery-services` (24 skills, incl. `docs-search`).
