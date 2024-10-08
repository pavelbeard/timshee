#!/bin/bash

cp .env .env.copy;

git stash;
git pull;

cp .env.copy .env

docker-compose -f prod.docker-compose.yml down;
docker-compose -f prod.docker-compose.yml --env-file .env up -d;