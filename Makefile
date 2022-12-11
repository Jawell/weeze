#!/usr/bin/make

include .env

aws_bin=$(shell command -v aws 2> /dev/null)
docker_compose_bin=$(shell command -v docker-compose 2> /dev/null) -p performance-testing-tool
docker_bin=$(shell command -v docker 2> /dev/null)
GREEN := $(shell tput -Txterm setaf 2)
RESET := $(shell tput -Txterm sgr0)

.DEFAULT_GOAL=help

compose=-f docker-compose.yml

help:
	@echo "${GREEN}init${RESET}" - initiate project: install modules, create init migrations, run seeds
	@echo "${GREEN}up${RESET}" - up services
	@echo "${GREEN}down${RESET}" - down all
	@echo "${GREEN}destroy${RESET}" - destroy all

init:
	yarn
	yarn typeorm migration:generate src/migrations/Init -t 1670670000000
	yarn typeorm migration:run
	yarn seed:run

up:
	$(docker_compose_bin) $(compose) up -d

down:
	$(docker_compose_bin) $(compose) down

destroy:
	$(docker_compose_bin) $(compose) down -v --rmi all
