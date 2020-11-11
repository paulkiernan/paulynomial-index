#!/bin/bash

set -eu

REPO_ROOT_DIR=$(git rev-parse --show-toplevel)

docker run \
    --rm \
    -e OUTPUT_DETAILS=detailed \
    -e RUN_LOCAL=true \
    -e VALIDATE_ALL_CODEBASE=true \
    -e VALIDATE_CSS=true \
    -e VALIDATE_DOCKERFILE=true \
    -e VALIDATE_HTML=true \
    -e VALIDATE_JAVASCRIPT_STANDARD=true \
    -e VALIDATE_JSON=true \
    -v "$REPO_ROOT_DIR":/tmp/lint \
    github/super-linter
