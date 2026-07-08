# Workflow files

GitHub blocks automation tokens without the `workflow` scope from writing to
`.github/workflows/`, so these files are staged here. Activate them with:

```sh
mkdir -p .github/workflows
git mv docs/workflows/ci.yml docs/workflows/release.yml .github/workflows/
git commit -m "Activate CI and release workflows"
git push
```

The `Release` workflow additionally needs an `NPM_TOKEN` repository secret —
an npm automation token with publish rights (npmjs.com → Access Tokens →
Generate New Token → Automation), added under Settings → Secrets and
variables → Actions.
