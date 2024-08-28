#!/bin/bash

cp .env .env.copy;

git stash;
git pull;

cp .env.copy .env

docker-compose -f unstable.docker-compose.yml down;
docker-compose -f unstable.docker-compose.yml --env-file .env up --build -d;