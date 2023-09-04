#!/bin/bash
set -e

# param1 : language (fr/en)
# param2 : catalog path

echo "retrieve data from $TENANT"

node ./extract/index.js $1 $2
