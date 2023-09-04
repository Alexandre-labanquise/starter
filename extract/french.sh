#!/bin/bash
set -e

SCRIPTS_DIR=extract

echo "home fr"
sh ${SCRIPTS_DIR}/page.sh fr /home
mv out/tmp/index.md out/tmp/_index.md

# echo "contact fr"
# sh ${SCRIPTS_DIR}/page.sh fr /contact

# echo "apropos fr"
# sh ${SCRIPTS_DIR}/page.sh fr /apropos

# echo "expertise fr"
# sh ${SCRIPTS_DIR}/page.sh fr /expertises

# echo "mentions fr"
# sh ${SCRIPTS_DIR}/page.sh fr /mentions

# echo "pageBlog fr"
# sh ${SCRIPTS_DIR}/page.sh fr /pageblog

# echo "blogs fr"
sh ${SCRIPTS_DIR}/blog.sh fr /blog

# echo "tags fr"
sh ${SCRIPTS_DIR}/tags.sh fr

sh ${SCRIPTS_DIR}/move.sh content/french/