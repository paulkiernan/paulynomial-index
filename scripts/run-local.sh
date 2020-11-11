#!/bin/bash

set -eux

REPO_ROOT_DIR=$(git rev-parse --show-toplevel)

python -m http.server 8080 -d $REPO_ROOT_DIR
