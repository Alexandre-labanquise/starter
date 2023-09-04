#!/bin/bash

set -e
export $(grep -v '^#' .env | xargs)

SCRIPTS_DIR=extract

bash ${SCRIPTS_DIR}/french.sh

bash ${SCRIPTS_DIR}/english.sh

rm -rf out/