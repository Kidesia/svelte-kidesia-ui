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
by the `Release` workflow whenever a version tag is pushed:

```sh
npm version 0.1.0        # bumps package.json and creates the v0.1.0 tag
git push --follow-tags
```

The workflow verifies lint, types, and tests, builds via `svelte-package`, validates
the result with `publint`, and publishes with npm provenance. It requires an `NPM_TOKEN`
repository secret (an npm automation token with publish rights for `kidesia-ui`).

Components live in `src/lib/elements/` and mirror the app files as closely as possible
so app-to-library diffs stay reviewable during the migration. Conventions are documented
in `CLAUDE.md`; the extraction/migration plan and its status live in
`docs/extraction-plan.md`.
