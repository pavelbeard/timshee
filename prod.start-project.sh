#!/bin/bash

cp .env .env.copy;

git stash;
git pull;

cp .env.copy .env

docker-compose -f prod.docker-compose.yaml down;
docker-compose -f prod.docker-compose.yaml --env-file .env up -d;