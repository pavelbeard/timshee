#!/bin/bash

cp .env .env.copy;

git stash;
git pull;

cp .env.copy .env

docker pull pavelbeard/django:unstable;
docker pull pavelbeard/frontend:unstable;

docker-compose -f unstable.images.docker-compose.yaml down;
docker-compose -f unstable.images.docker-compose.yaml --env-file .env up --build -d;