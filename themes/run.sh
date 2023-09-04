if [ ${ENV} = "prod" ]
then
pipx run ecoindex-cli analyze --chromedriver-path ./chromedriver --url ${DEV_URL} --recursive --no-interaction --export-format json --max-workers 1 --output-file responsible-digital.json
node ./scripts/responsible_digital.js
elif [ ${ENV} = "local" ]
then
pipx run ecoindex-cli analyze --chromedriver-path ./chromedriver --url ${DEV_URL} --recursive --no-interaction --export-format json --output-file responsible-digital.json
node ./scripts/responsible_digital.js
fi
