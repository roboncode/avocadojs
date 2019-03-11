#!/bin/bash

set -e

npm run docs:build

cd docs/.vuepress/dist

echo 'orango.js.org' > CNAME

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:roboncode/orango.git master:gh-pages

cd -
