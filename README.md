# kidesia-ui

Shared Svelte 5 component library of the Kidesia / Timesia frontend family, extracted
from the apps' `$ui/elements` folders. `timesia-frontend` and `kidesia-frontend` are the
reference consumers.

## Consuming the library

```sh
pnpm add kidesia-ui
```

Requirements in the consuming app:

- **Svelte 5** (peer dependency).
- **unplugin-icons** with `@iconify/json`, configured in Vite with
  `Icons({ compiler: 'svelte' })` — components import icons as
  `~icons/material-symbols/...`.
- **Design tokens**: import the stylesheet once, e.g. in the root layout:

  ```ts
  import 'kidesia-ui/tokens.css';
  ```

  All colors are consumed via `--color-*` custom properties; override tokens after the
  import to theme. Dark mode is activated by a `dark-mode` class on `body`.

- **i18n** (optional but recommended): bind the library to the app's i18next instance
  during startup. The library registers its bundled `de`/`en` texts under the `ui`
  namespace; without setup, components fall back to the bundled English strings.

  ```ts
  import i18next from 'i18next';
  import { setupUiI18n } from 'kidesia-ui';

  setupUiI18n(i18next);
  ```

  Individual texts can be overridden via
  `i18next.addResourceBundle('de', 'ui', overrides, true, true)`.

## Development

```sh
pnpm install
pnpm storybook   # component catalog / development environment
pnpm dev         # minimal smoke-test page
pnpm fix:all     # eslint --fix, prettier, svelte-check
pnpm test        # vitest (unit)
pnpm build       # vite build + svelte-package + publint
```

## Releasing

The package is published publicly to [npm](https://www.npmjs.com/package/kidesia-ui)
by the `Release` workflow whenever a `v*` tag is pushed. The workflow verifies lint,
types, and tests, builds via `svelte-package`, validates the result with `publint`,
and publishes with npm provenance. It requires an `NPM_TOKEN` repository secret (an
npm automation token with publish rights for `kidesia-ui`), and it fails if the tag
does not match the `version` in `package.json`.

To release:

1. Bump `version` in `package.json` and land that change on `main`.
2. On GitHub, go to Releases → _Draft a new release_, enter the matching tag
   (e.g. `v0.1.0`, created on publish), target `main`, optionally generate release
   notes, and publish. The created tag triggers the workflow.

Alternatively, tag from the command line on the merged commit:

```sh
git tag v0.1.0 && git push origin v0.1.0
```

In a jujutsu checkout, bump the version with
`npm version 0.1.0 --no-git-tag-version`, commit and push with `jj` as usual, and
create the tag with plain git as above (colocated repos share the same refs).

Components live in `src/lib/elements/` and mirror the app files as closely as possible
so app-to-library diffs stay reviewable during the migration. Conventions are documented
in `CLAUDE.md`; the extraction/migration plan and its status live in
`docs/extraction-plan.md`.
