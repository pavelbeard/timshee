#!/bin/bash

cp .env .env.copy;

git stash;
git pull;

cp .env.copy .env

docker pull pavelbeard/django.production:latest;
docker pull pavelbeard/frontend.production:latest;

docker-compose -f prod.images.docker-compose.yaml down;
docker-compose -f prod.images.docker-compose.yaml --env-file .env up -d;