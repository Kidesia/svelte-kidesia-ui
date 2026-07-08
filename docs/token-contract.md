# Design-token contract

`src/lib/styles/tokens.css` is the cross-repo styling interface of the family: it
defines the vocabulary components may consume, the default (light) values, the
`.dark-mode` scheme, and experimental theme data. Consuming apps import it
(`kidesia-ui/tokens.css`) and may layer their own theme blocks over it.

## Vocabulary

- **Semantic colors** — `--color-bg-*`, `--color-text-*`, `--color-border-*`,
  `--color-icon-*`, `--color-interactive-*`, `--color-primary*`, and full semantic
  ramps for info, error, success, warning, and purple (`solid/-fg/-bg/-text/-surface/
-border/-surface-text`, keyed off `--hue-*` variables where ramp-based).
- **Page vs inset** — `--color-bg-page` is the document background; `--color-bg-inset`
  is the recessed-panel tone (dialog wells, drawer bodies, disabled inputs). Both
  currently alias `--color-bg-primary`, which stays defined for app compatibility; a
  hued page tint must override `--color-bg-page` only, so it cannot leak into wells.
- **Navigation** — `--color-nav-bg`/`--color-nav-fg` let the sidebar diverge from card
  surfaces (today they alias surface/text).
- **Parametric tints** — `--tint-soft-bg/-fg`, `--tint-strong-bg/-fg` are oklch
  lightness/chroma pairs combined with a component-set hue:
  `background: oklch(var(--tint-soft-bg) var(--hue))`. Avatar, Badge, and Card build
  their hue-parametric variants from these, so themes can retune all tinted chips at
  once. (Named tones from the design map onto hues at the call site.)
- **Focus** — `--focus-ring` is a full outline shorthand (`<width> solid <color>`);
  every `:focus-visible` site uses `outline: var(--focus-ring)`.
- **Radii** — `--radius-xs/sm/md/lg/pill` (0.25/0.375/0.5/0.7rem/999px). Circles stay
  `50%`; a handful of off-scale literals (6px, 4px, 2px, 1rem) are intentional.
- **Typography** — `--font-body` (Nunito stack), `--font-display` (aliases body until
  a display face is licensed), `--font-mono`.
- **Shadows / overlays** — `--shadow-sm/md/lg`, `--color-overlay`,
  `--color-overlay-light`.

Spacing is deliberately **not** tokenized (the `rem` convention covers it), and
control-height tokens are out of scope.

## Authoring rules

- Components consume only tokens from this contract — no literal colors, no literal
  radii on the scale values, no font stacks.
- Theme blocks (`.dark-mode`, `.theme-warm`, app-defined) are **pure data**: no
  component may reference a theme class.
- Alias tokens (`--color-bg-page`, `--focus-ring`, `--font-display`, …) must be
  re-declared in every theme block whose referents change — `var()` inside a custom
  property resolves where the property is declared, not where it is used.
- New tokens are initialized to the current effective value in both schemes so their
  introduction is a zero-visual-change refactor; retuning values is a separate,
  deliberate step.

## Themes

- `:root` — default light scheme.
- `.dark-mode` (class on `body`) — complete parallel scheme; components like Grid
  detect it via that class.
- `.theme-warm` — experimental scheme from `kidesia-frontend/_design/design.md`
  (peach page tint, warm signature card shadow, soft alpha focus ring, brand-orange
  primary at raised lightness on the hue-56/58 ramp). Trial-only; not part of the
  stable contract yet.

## Open decisions

1. **Sidebar tone** — design.md contradicts itself (dark `#292525` in the layout
   section vs warm-light `#FAF6EB` in the neutrals table). Both are expressible via
   `--color-nav-bg/-fg`; undecided which the warm theme adopts.
2. **Moderat font** — commercial license unresolved ("Moderat Trial" in Figma); Inter
   is the designated fallback. `--font-display` is the slot either lands in.
3. **Structural design adoption** — pill buttons with offset shadows, radius bumps,
   stroke icons, display typography: explicitly deferred. This contract only ensures
   they are expressible when attempted.

## Resolved decisions

- Badge/Avatar/Card keep the **hue-parametric** tone API (named design tones map onto
  hues); the tint tokens make it theme-aware.
- The token contract ships **with the library**; apps import and layer rather than
  fork.
- Duplicates removed in favor of `--color-text-disabled` and
  `--color-error-emphasis`; `--color-nav-item*` and `--color-base-black` deleted.
