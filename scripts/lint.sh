#!/bin/bash

# Runs the same linters CI runs (see .github/workflows/lint.yml) — no Docker.
# Linter versions are pinned in package.json.

set -eu

REPO_ROOT_DIR=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT_DIR"

if [ ! -d node_modules ]; then
    npm ci --no-fund --no-audit
fi

npm run lint
