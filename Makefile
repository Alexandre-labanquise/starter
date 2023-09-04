include .env
IS_COMPOSE := ${command -v docker-compose}
ifeq (${IS_COMPOSE},)
	COMMAND := "docker-compose"
else
	COMMAND := "docker compose"
endif
DIR := `pwd`
cloudFrontDistributionID:=$(shell cd terraform && terraform output -raw cloudFrontId)

.env:
	cp .env.dist .env

update-submodule:
	git submodule update --remote --recursive

init-responsible-digital:
	git submodule init
	git submodule add https://github.com/Labanquise/declaration-theme themes/declaration
	git submodule update --recursive --remote
	(cd themes/declaration && sudo sh init.sh)

extract-content:
	sh init-export.sh 
	sh run.sh

extract-content-with-declaration:
	sh init-export.sh 
	(cd themes/declaration && ENV=${ENV} DEV_URL=${DEV_URL} sh run.sh)
	sh run.sh

prepare-terraform:
	(cd terraform && TF_VAR_website_name=${TENANT} terraform apply)

init:
	sh init.sh
	(cd terraform && terraform init)
	docker network create labanquise-network || true
	eval "${COMMAND} run --rm node npm install"

start:
	eval "${COMMAND} up -d"

stop:
	eval "${COMMAND} stop"

logs:
	docker logs -f ${APP_NAME}

down:
	eval "${COMMAND} down"

test:
	eval "${COMMAND} run --rm node npm run test"

coverage:
	eval "${COMMAND} run --rm node npm run test:cov"

graph:
	docker run --rm -v "${DIR}":/home/app -w /home/app -p 16064:16064 -ti --name graph node:17 npx @ajustor/madge3d madge -ts ./src
