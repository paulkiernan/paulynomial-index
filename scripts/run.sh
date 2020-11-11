#!/bin/bash

set -eux

REPO_ROOT_DIR=$(git rev-parse --show-toplevel)

docker build -t paulynomial-index:latest "$REPO_ROOT_DIR"

docker run \
    --rm \
    -p 8080:80 \
    -it paulynomial-index:latest
