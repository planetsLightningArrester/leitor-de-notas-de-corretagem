#!/bin/bash -e
# Update all dependencies and dev dependencies to their latest
# in the current folder
# shellcheck disable=SC2046

[[ ! -f "./package.json" ]] && echo "[ERROR] Must run from a directory with a 'package.json' file" && exit 1
# Get dev dependencies
npm i -D $(npm ls --parseable | grep -vxF -f <(npm list --parseable --omit=dev) | sed -r 's,.*node_modules/(.*),\1@latest,g' | tr '\n' ' ')
# Get prod dependencies
npm i $(npm list --omit dev --parseable | tail -n +2 | sed -r 's,.*node_modules/(.*),\1@latest,g' | tr '\n' ' ')
# Remove unused
npm update

# EOF