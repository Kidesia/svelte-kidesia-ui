# CLAUDE.md

These conventions are shared across the Kidesia / Timesia family of Svelte frontends
(`timesia-frontend`, `timesia-app`, `timesia-terminal-app`, `kidesia-daily`,
`kidesia-parents`, `kidesia-frontend`). This file is maintained identically in every
repo — when you change a rule here, propagate the same change to the other repos so the
family stays in sync.

## This repo: svelte-kidesia-ui

This section is repo-specific and exempt from the sync rule above.

- This is the shared component library (`kidesia-ui`) extracted from the family's
  `$ui/elements` folders. `timesia-frontend` and `kidesia-frontend` are the reference
  consumers; `kidesia-daily` has its own mobile-first element set and only adopts
  selected pieces.
- Components live in `src/lib/elements/` and mirror the apps' `$ui/elements` files as
  closely as possible (imports included) so app-to-library diffs stay reviewable.
- Nothing under `src/lib/` may import SvelteKit runtime modules (`$app/*`), app APIs,
  query libraries, or error-reporting SDKs. Framework and app concerns are inverted
  into props.
- User-facing copy goes through the package i18n module (`$lib/i18n/index.svelte`),
  which binds to the host app's i18next instance via `setupUiI18n()` under the `ui`
  namespace. The bundled `de`/`en` resources live next to the module; every key a
  component uses must exist in both files.
- Design tokens ship in `src/lib/styles/tokens.css` (consumers import
  `kidesia-ui/tokens.css`). Dark mode is driven by a `.dark-mode` class on `body`.
- Storybook is the development environment (`pnpm storybook`); colocate stories as
  `X.stories.svelte` next to the component.
- Consumers must configure `unplugin-icons` with `@iconify/json` (icons are imported
  as `~icons/material-symbols/...`).
- `docs/extraction-plan.md` documents the extraction plan and migration status.
- The `$ui` alias and query-hook sections below describe the consuming apps; in this
  repo the library root is `$lib` and there are no query hooks.

## Verifying changes

Before handing a code-changing task back to the user, run `pnpm fix:all` **and**
`pnpm test` and ensure both succeed. `pnpm fix:all` wraps `lint:fix`, `format`, and
`check` (eslint `--fix`, prettier `--write`, and `svelte-kit sync` + `svelte-check`) —
use it in place of running `check` on its own. `pnpm test` runs the test suite once
(non-watch). If either reports problems you can't resolve, surface them rather than
declaring the task done.

When a task is split across multiple commits, run `pnpm fix:all` and `pnpm test` before
recording each commit, not just the final one. Every commit should independently pass
lint, format, type-check, and tests so the history stays bisectable and intermediate
states aren't broken.

## Project structure & the `$ui` convention

Reusable UI lives under the `$ui` alias (`src/ui`):

- `$ui/elements/` is reserved for purely reusable Svelte components — these are extracted
  into a shared component library used across the family's projects. Don't put
  route-specific or app-glue code here. Standalone state modules (`.svelte.ts`) don't
  belong in this folder either; if state is tied to a component, colocate it inside the
  component's `<script module>` block.
- `$ui/components/` holds app-specific layout and feature components.

## Queries (svelte-tiny-query)

**Hard rule — query hooks must never be invoked inside a reactive context.** The `use*`
functions defined with `createQuery` in `src/lib/api/` must be called exactly once, at the
top level of a component's `<script>` block. Never call them inside `$derived` /
`$derived.by`, `$effect`, template expressions, `.map()`-style callbacks, or any function
that runs in a tracking context. This also rules out `$derived(useThings(...))` wrappers —
even when the param is already a getter.

When a parameter is reactive (props, `$state`, `$derived` values), pass a **getter**
instead of re-invoking the hook:

```ts
const query = useThings(() => ({ id, startDate: range.start }));
```

The library re-keys and reloads automatically when the getter's value changes. To make a
query conditional, keep the call top-level and use the `enabled` option
(`useThings(param, { enabled: () => condition })`) rather than calling it inside an `{#if}`
or ternary.

## Svelte 5

- Use runes for all component state and reactivity: `$state`, `$derived` / `$derived.by`,
  `$props`, and `$effect`. Don't reach for the legacy `export let`, `$:` reactive
  statements, or writable stores for component-local state.
- `$effect` is for genuine side effects (DOM work, subscriptions, imperative calls) only.
  Derived values belong in `$derived` — never in an `$effect` that writes back to `$state`.

## Code style

- **Event handlers must use braces.** No implicit-return arrows (`onclick={() => doX()}`
  is out — write `onclick={() => { doX(); }}`). Cap inline handlers at 3 lines; longer
  handlers move into the `<script>` block as named functions and are referenced by name.
- **JSDoc on exported functions, not internal ones.** Every exported function gets a JSDoc
  block — short description plus `@param` for each parameter and `@returns`; module APIs
  document their contract, concisely. Internal helpers get **no** JSDoc. This JSDoc
  requirement is the one place that overrules the general "default to no comments" stance.
  Keep all other comments to a minimum: prefer self-explanatory names, and add a short
  `//` note only for a non-obvious _why_ — never to restate _what_ the code already says.
- **No conversational comments.** A comment must still make sense long after its change
  merged. Never narrate the change, address the reviewer, or point at a discussion or code
  elsewhere ("mirrors X", "see backend", "resolves the TODO", "as discussed"). If a `//`
  line is only useful to someone who knows the current task, leave it out.
- **Component prop order**: shorthand booleans → regular props → event handlers.
- **Input bindings**: use `bind:value` / `bind:checked` when reading and writing the same
  value. When the read/write logic differs, switch to the explicit `value` / `checked`
  property plus an `onchange` handler — don't use the getter/setter form of `bind`.
- **CSS values**: colors via CSS custom properties only (no literal hex/rgb). Use `rem` /
  `em` for spacing and font sizing, `%` for fluid widths, `px` only for fixed widths
  (dialogs), borders, and precise non-relative values. Leave a blank line between class
  definitions.
- **Component extraction**: extract when a section is genuinely reusable, when the same
  pattern repeats, or when a single component file grows past ~250 lines. Don't extract
  single-use components where the call site is as verbose as the component itself.

Where present, `.github/copilot-instructions.md` holds longer-form examples of these
rules.

## TypeScript

- `strict` is on in every repo. Don't introduce `any` — prefer precise types, or
  `unknown` plus narrowing when a value's shape is genuinely open.
- Use `import type { ... }` for type-only imports.
- Give exported functions explicit parameter and return types.

## Internationalization (i18n)

All apps use **i18next**. User-facing copy must go through the translation layer
(`t('...')`) — never hardcode display strings in components. Keep new keys in the
appropriate namespace and add them for every supported language.

## Icons

Icons come from `@iconify/json` via `unplugin-icons`, imported directly where used
(e.g. `~icons/material-symbols/add-rounded`):

- Don't add a shared `Icon.svelte` wrapper unless a strong repeated need appears. Let
  icons inherit `currentColor` unless a specific override is needed.
- Size an icon-only wrapper from the parent (`font-size`, `line-height: 1`). When an icon
  sits next to text, fills a fixed square slot, or animates independently, pass it a class
  and style that class from the parent (`:global(.my-icon)` in Svelte).
- Keep `:global(svg)` only for raw SVG injected with `{@html}`.
- Decorative icons get `aria-hidden="true"`; label icon-only buttons on the button, not
  the icon; give meaningful standalone icons an accessible label.

Where present, `docs/icon-conventions.md` holds the full icon guide.
