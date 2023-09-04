#!/bin/bash
set -e

SCRIPTS_DIR=extract

echo "home en"
sh ${SCRIPTS_DIR}/page.sh en /home
mv out/tmp/index.md out/tmp/_index.md

# echo "contact en"
# sh ${SCRIPTS_DIR}/page.sh en /contact

# echo "expertise en"
# sh ${SCRIPTS_DIR}/page.sh en /expertises

# echo "about en"
# sh ${SCRIPTS_DIR}/page.sh en /about

# echo "mentions en"
# sh ${SCRIPTS_DIR}/page.sh en /mentions

# echo "blogs en"
# sh ${SCRIPTS_DIR}/blog.sh en /blog

# echo "tags en"
sh ${SCRIPTS_DIR}/tags.sh en

sh ${SCRIPTS_DIR}/move.sh content/english/