#!/bin/bash
set -e

# param1 : pages output dir

for entry in "out/tmp"/*
do
  cat "$entry" | jq --slurp '.' | jq '.[]' > $(echo "$entry" | sed "s/tmp/pages/")
  rm $entry
done

mv out/pages/* $1

if [ "$(ls -A out/declarations)" ]; then
  cp out/declarations/* $1
else
  echo "nothing to move for declarations"
fi

if [ "$(ls -A out/blogPages)" ]; then
  mv out/blogPages/* $1/blog
  mv $1/blog.md $1/blog/_index.md
else
  echo "nothing to move for blog"
fi
mv out/tags.md $1