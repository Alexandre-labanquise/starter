#!/bin/sh
set -e

node ./extract/tags.js $1
echo "extract over"
# rm -rf out/tags.json