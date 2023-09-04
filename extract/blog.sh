#!/bin/sh
set -e

node ./extract/blog.js $1 $2
echo "extract over"
