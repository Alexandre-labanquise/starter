#!/bin/bash
set -e
export $(grep -v '^#' .env | xargs)

sed -i "s/{{TENANT}}/$TENANT/g" config.toml
sed -i "s/{{TENANT}}/$TENANT/g" config-dev.toml
sed -i "s/{{TENANT}}/$TENANT/g" config-prod.toml