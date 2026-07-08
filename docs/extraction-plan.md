# UI Library Extraction Plan — Kidesia/Timesia family

> **Status (2026-07-08):** package-repo-first execution. The scaffold, tokens
> (`src/lib/styles/tokens.css`), utils, `ui`-namespace i18n module with de/en bundles,
> and ~55 components (Tiers A/B plus decoupled Tier C) are ported into this repo with
> the Phase-0 cleanups applied here. Still open: Grid (ag-grid), Scheduler/DayScheduler,
> rich text (pending editor decision), app-side migration of both apps (Phase 4 step 4),
> and Phase 5 (kidesia-daily).

Goal: extract the shared `src/ui/elements` layer of `timesia-frontend` and
`kidesia-frontend` into a standalone npm package, consumed by both apps (and later by
`timesia-app`, `timesia-terminal-app`, `kidesia-parents`). `kidesia-daily` is **out of
scope for v1** (see §8) — it is a different design system (mobile-first, Material-style
`--clr-*` tokens, Capacitor shell, `deviceType`-branching interaction models), not a
restyled copy.

This plan is self-contained: it carries the audit facts needed to execute it without
re-deriving them. Facts were gathered 2026-07-08 from the three repos.

---

## 0. Ground facts (from the audit)

- **Drift state:** of 42 files shared between timesia-frontend and kidesia-frontend,
  24 are byte-identical; most others differ by <20 lines. Real forks:
  `AppContainer` (707 vs 346 lines), `Page`, `List`, `SubNavigation`, `QueryWrapper`.
- **Toolchains are aligned** (desktop pair): Svelte `^5.43.8`, Kit `^2.48.5`,
  Vite `^7.2.2`, i18next `^25.7.2`, svelte-tiny-query `^2.0.0`, unplugin-icons `^22.5.0`.
  Neither repo uses `@sveltejs/package` yet.
- **svelte-tiny-query coupling is already solved:** `QueryWrapper` in all repos consumes
  a structural `{loading, error, data, reload}` shape. Only `Button`, `Dialog`,
  `ConfirmDialog` have **type-only** `LoadResult` imports.
- **i18n:** apps init i18next with a single `translation` namespace, languages `en`/`de`,
  fallback `de` (`src/lib/i18n/index.svelte.ts`). ~28 components per desktop repo call
  `i18n.t()` directly, usually as `prop ?? t('common.x')` defaults.
- **Tokens:** both desktop repos define ~80 `--color-*` / `--shadow-*` tokens in
  `src/lib/assets/styles.css` (`:root` light + `.dark-mode` block). No spacing/radius/
  typography tokens. `Grid` detects dark mode by watching `document.body` for the
  `.dark-mode` class.
- **App utils imported by elements** (timesia line counts): `icons-registry.ts` 172,
  `tooltip.ts` 103, `format.ts` 257, `date-string.ts` 68, `date-range.ts` 150,
  `lane-layout.ts` 76, `platform.ts` 8, `persisted-state.svelte.ts` 68. Total ~900 lines.
- **VCS note:** kidesia-frontend is a **jujutsu (jj)** repo (`jj commit`, never push);
  the others are git. Follow each repo's CLAUDE.md.

---

## 1. Decisions (defaults chosen; overridable before Phase 3)

| Decision           | Default                                                                                                                                                                                                                                                                  | Rationale / alternatives                                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Package name       | `@kidesia/ui` (placeholder — confirm scope/name)                                                                                                                                                                                                                         |                                                                                                                                                        |
| Repo shape         | New standalone repo, built with `@sveltejs/package` (ships raw `.svelte` + `.js`/`.d.ts`)                                                                                                                                                                                | Alternative: pnpm-workspace monorepo containing apps — cheaper iteration, bigger restructure. Standalone matches the family's one-repo-per-app layout. |
| Distribution       | Private registry (GitHub Packages under the `kidesia` org)                                                                                                                                                                                                               | Alternative during development: `file:`/`pnpm link`.                                                                                                   |
| Svelte compilation | Consumer compiles (standard for Svelte libs). **Consumers must have `unplugin-icons` + `@iconify/json` configured** — all family apps already do. Document as a hard requirement.                                                                                        | Alternative (inlining SVGs) rejected: churn, loses icon consistency.                                                                                   |
| Heavy deps         | Subpath exports so the core stays light: `@kidesia/ui` (core), `@kidesia/ui/grid` (ag-grid), `@kidesia/ui/richtext` (rich text editor), `@kidesia/ui/scheduler` (Scheduler/DayScheduler + date-fns). Peer deps declared per subpath via `peerDependenciesMeta.optional`. |                                                                                                                                                        |
| i18n strategy      | Package ships its own resource bundles under a `ui` **namespace** (de + en); app registers them on its i18next instance via one setup call. Per-component label props remain as override hatch. See §5.                                                                  |                                                                                                                                                        |
| App shells         | `AppContainer`, `Page`, `SubNavigation` **stay app-side** in v1 (most diverged, SvelteKit/Sentry-bound, legitimately per-app). Revisit in v2.                                                                                                                            |                                                                                                                                                        |
| Rich text          | Pick **one** editor. kidesia-frontend currently ships both `RichTextEditor` (quill) and `form/RichTextEditor` (tiptap); timesia has quill only. Default: **tiptap** (actively developed; quill variant is the older one) — confirm with team before Phase 2.             |                                                                                                                                                        |
| Versioning         | Semver + changesets (or manual semver if changesets is overkill); apps pin `^x.y.z`.                                                                                                                                                                                     |                                                                                                                                                        |

---

## 2. Component tiers (what goes in, and in what order)

### Tier A — clean already, move as-is

Form primitives (`Checkbox`, `Field`, `FieldRow`, `Input`, `RadioButtonGroup`, `Select`,
`TextArea`, `ReadonlyField`, `FilterToggleGroup`), `Message`, `Spinner`,
`ProgressIndicator`, `TabsHeader`, `StatusDot`, `FilterLabel`, `HueSelector`,
`MultiToggle`, `Portal`, `PhoneNumberLink`, `CheckBoxGroup`, `RadioCardGroup`,
`KpiCard`, `KpiGrid`, `CountPill`, `EmptyMessage`, `ListCompact`, `ListRow`,
`ButtonRow`, `BadgeRow`, `ContactAction`, `ColorDot`_, `Avatar`_, `SanitizedContent`
(dompurify), `TooltipContainer` (@floating-ui/dom), `OrderableList/ListItem`,
`Grid/helpers`, `Grid/renderers/*`.
(\* = only needs the `tooltip` util, which moves into the package in Phase 2.)

### Tier B — i18n-only coupling (portable once §5 lands)

`Toasts`, `List`, `ListCard`, `YearSelector`, `MonthSelector`, `DateSelector`,
`DropDownSelection`, `OrderableList`, `GridPager`, `Grid/Grid`, `ComingSoon`,
`FilterControl`, `SortControl`, `form/PasswordInput`, `form/SearchInput`,
`form/ComboBox`, `form/DurationInput`, `form/PasswordStrengthIndicator`,
`StepperSelector`.

### Tier C — app-logic coupling, needs the Phase 0/2 refactors first

`Button`, `Badge`, `Card`, `Chip`, `DropDown`, `DropDownMenu`,
`form/FilterToggleButton` (icons-registry/tooltip), `Dialog`, `ConfirmDialog`
(error-type + i18n), `QueryWrapper` (ACCESS_DENIED sentinel), `Drawer`
(persisted-state), `Age`, `HistoryTimeline`, `Scheduler`, `DayScheduler`
(format/date utils), `form/MultiComboBox`, `RichTextEditor` (editor decision),
`NameValueList` (`$app/paths` leak).

### Stays app-side (v1)

`AppContainer`, `Page`, `SubNavigation`; kidesia-frontend one-offs that are really
features (`DayScheduler` variants stay if diverged, `Grid` extras assessed at move
time). In kidesia-daily: everything (see §8), plus its misfiled `UnifiedSearch` should
move to `$ui/components` regardless.

---

## 3. Phase 0 — in-place cleanups (both desktop repos; no package yet, zero risk)

Worth doing even if extraction stalls. Keep the two repos in lockstep — apply every fix
to both, matching files byte-for-byte where they are identical today.

1. **Tokenize hardcoded colors** (violations are near-identical in both repos):
   - `Button.svelte` success variant: `hsl(140,50%,42%)` / `#fff` / `hsl(140,50%,36%)`
     → new tokens (e.g. `--color-success`, `--color-success-fg`, `--color-success-hover`)
     added to both `styles.css` light + dark blocks.
   - `form/PasswordStrengthIndicator.svelte`: 4 literal `hsl()` strength colors → tokens.
   - `Page.svelte` scrim `rgba(0,0,0,0.35)` → existing `--color-overlay`.
   - `form/MultiComboBox.svelte` `rgb(0 0 0 / 0.08)` → token or `color-mix` on a token.
   - (`Spinner`'s `#00000000` transparent gradient stop is benign — leave or switch to
     the `transparent` keyword.)
2. **Invert app-runtime leaks:**
   - `NameValueList`: drop `$app/paths` `resolve` — take a plain `href` from the caller.
   - `Page`: drop `@sentry/sveltekit` import — accept `onError?: (e: unknown) => void`
     prop; app passes Sentry capture.
   - `QueryWrapper`: drop `ACCESS_DENIED_ERROR` import from `$lib/utils/fetch.svelte` —
     accept an `isAccessDenied?: (error) => boolean` predicate prop (or export the
     sentinel from the future package); app supplies it.
   - timesia `Dialog`: drop runtime `$lib/api/error` (`apiError`, `errorMessage`) —
     accept an error-formatting prop, aligning it with kidesia-frontend's version.
   - `Button`/`Dialog`/`ConfirmDialog`: replace type-only `LoadResult` import with a
     locally declared structural type (same shape), removing the svelte-tiny-query
     dependency entirely.
3. **Fix hardcoded strings:** `SubNavigation` `aria-label="Sub navigation"` → `t()`.
4. **Fix key-namespace leak:** `form/PasswordStrengthIndicator` reads
   `settings.kidesiaDaily.password*` — move keys to `common.*` in both repos' locale
   files.
5. **Rich-text decision:** delete the losing editor in kidesia-frontend (default: keep
   tiptap `form/RichTextEditor`, migrate usages of quill `RichTextEditor`, drop quill).

Verification: `pnpm fix:all` + `pnpm test` in each repo per commit; visually spot-check
Button success variant, password strength colors, dialogs, page error state.

## 4. Phase 1 — reconcile the forked shared files

For each of `List`, `QueryWrapper` (and any file that Phase 0 didn't already align),
diff the two desktop versions, choose the superset/better implementation, and sync both
repos to byte-identical. `AppContainer`/`Page`/`SubNavigation` are exempt (staying
app-side). Outcome: `diff -rq` of the two `ui/elements` folders shows differences only
in app-side files and repo-specific extras.

## 5. Phase 2 — absorb the small utils into the UI boundary

Move into the future package source (for now: a `src/ui/lib/` folder mirrored in both
repos, so the extraction later is a pure directory move):

- `icons-registry.ts`, `tooltip.ts` (used by Tier C primitives)
- `format.ts`, `date-string.ts`, `date-range.ts`, `lane-layout.ts`, `platform.ts`
  (Scheduler family) — move only the functions elements actually use; leave app-only
  helpers behind.
- `persisted-state.svelte.ts` (Drawer) — generic, moves along. Note: `.svelte.ts` state
  modules are banned _in `$ui/elements`_ by convention; place it under the package's
  `lib/` (non-elements) path.

Update element imports from `$lib/utils/...` → relative/`$ui/lib/...`. Apps keep their
own copies for non-UI call sites (or re-export from the UI lib to avoid duplication).

## 6. Phase 3 — i18n: package-owned namespace

1. Package ships `locales/{en,de}.json` containing every key its components use, under
   a `ui` namespace with library-generic keys (`ui:dialog.cancel`, `ui:list.noEntries`,
   `ui:pagination.next`, …).
2. Package exposes a tiny module:
   - `setupUiI18n(i18n: i18n)` — calls `addResourceBundle('en'|'de', 'ui', …)` and
     stores the instance;
   - internal `t(key, params?)` used by components, reading the stored instance, with
     the bundled English strings as last-resort fallback so components render sensibly
     even if setup was forgotten.
3. Components switch `i18n.t('common.x')` → package `t('ui:x')`. Existing
   `prop ?? t(...)` override props stay exactly as they are.
4. Apps call `setupUiI18n(i18next)` once in their i18n init; app locale files drop the
   now-unused keys (grep before deleting — some `common.*` keys are also used by app
   code and must stay).
5. Apps can override individual strings via `addResourceBundle(..., 'ui', overrides,
true, true)` — document this.

Rollout trick: this phase can land **before** the package exists, as a `src/ui/i18n/`
module mirrored in both repos, keeping the final extraction mechanical.

## 7. Phase 4 — create the package and migrate

1. **Scaffold the package repo** (the repo the user provides):
   `@sveltejs/package` + SvelteKit lib template, pnpm, family ESLint/Prettier/svelte-check
   config, vitest, the family CLAUDE.md (with a repo-specific section), and a minimal
   SvelteKit **showcase app** (`src/routes`) rendering every component for development
   and visual review.
2. **Move code**: `ui/elements` (Tiers A–C) + `ui/lib` utils + `ui/i18n` + locale
   bundles. Set up subpath exports (`.`, `./grid`, `./richtext`, `./scheduler`) and
   `peerDependencies`: `svelte ^5`, `@floating-ui/dom`/`svelte-floating-ui`, `dompurify`,
   `date-fns` (scheduler), `@ag-grid-community/*` (grid), tiptap pkgs (richtext) — the
   heavy ones optional via `peerDependenciesMeta`. Document the `unplugin-icons`
   consumer requirement in the README.
3. **Tokens**: ship `styles/tokens.css` (the `--color-*`/`--shadow-*` set, light +
   `.dark-mode`) as an importable stylesheet; apps import it and may override tokens
   after it. Document the `.dark-mode`-class-on-`body` contract that `Grid` relies on.
   (Backlog, not v1: spacing/radius/typography tokens.)
4. **Consume**: publish `0.1.x`; migrate **timesia-frontend first** (smaller surface) —
   delete moved files, rewrite `$ui/elements/X` imports to `@kidesia/ui`, run
   `pnpm fix:all` + `pnpm test`, full visual pass of main screens. Then kidesia-frontend
   the same way. Keep one release per migration step so a revert is a version pin.
5. **Guardrail**: add a CI/lint rule in both apps forbidding new files in
   `src/ui/elements` (the folder disappears; app-specific components live in
   `$ui/components`).

## 8. Phase 5 — kidesia-daily (deliberately minimal in v1)

- Do **not** port daily's components into the package or vice versa.
- Daily adopts only universal, style-light pieces where its own version is equivalent:
  `QueryWrapper` (its version is already structurally identical in approach),
  `SanitizedHtml`→`SanitizedContent`, possibly `Spinner`/`Portal`-class utilities.
- Housekeeping in daily regardless: move `UnifiedSearch` (imports API code + reaches
  into `../components/children/`) out of `elements` into `$ui/components`; tokenize
  `StatusDot`'s hardcoded `rgb(208,50,50)` and the `rgba(0,0,0,…)` overlays.
- Convergence backlog (v2 candidates, in order): align **token names** (daily's
  `--clr-*` Material vocabulary vs package `--color-*`); align component naming/APIs
  (`Checkbox` vs `CheckBoxGroup`, `DatePicker` vs `DateSelector`); evaluate whether the
  package's Dialog/Drawer can absorb daily's bottom-sheet mode behind a prop instead of
  the app-global `deviceType` store. Only after tokens+APIs converge does sharing
  styled components with daily become realistic.

## 9. Execution order & verification

Phases 0–3 happen inside the two app repos (parallel, kept in lockstep); Phase 4 needs
the new package repo; Phase 5 is independent. Every commit in every repo must pass
`pnpm fix:all` + `pnpm test` (family CLAUDE.md rule). kidesia-frontend uses `jj`
commits and is never pushed by the agent; the other repos follow their branch
instructions. Suggested checkpoints for review: end of Phase 0 (pure cleanup diff),
end of Phase 1 (`diff -rq` report of the two element folders), Phase 4 step 4 after
each app migration (screenshots from the showcase app + app smoke test).

## 10. Open items to confirm before Phase 3/4

1. Package name/scope and registry (default `@kidesia/ui` on GitHub Packages).
2. Rich-text editor choice (default tiptap).
3. Standalone package repo vs monorepo (default standalone; the user will provide the
   repo).
4. Whether `Drawer`'s persisted width and `Grid`'s `.dark-mode` body-class contract are
   acceptable as documented conventions (default yes for v1).
