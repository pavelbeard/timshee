#!/bin/bash

cp .env .env.copy;

git stash;
git pull;

cp .env.copy .env

docker pull pavelbeard/django:unstable;
docker pull pavelbeard/file_storage:unstable;
docker pull pavelbeard/frontend:unstable;

docker-compose -f unstable.images.docker-compose.yml down;
docker-compose -f unstable.images.docker-compose.yml --env-file .env up -d;