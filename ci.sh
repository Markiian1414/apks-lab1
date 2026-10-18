#!/usr/bin/env sh
set -eu

if [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then
  npm ci
else
  npm install
fi
npm run build
npm test
test -f dist/hello
