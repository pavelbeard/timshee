#!/bin/bash

cp .env .env.copy;

git stash;
git pull;

cp .env.copy .env

docker pull pavelbeard/django.production:latest;
docker pull pavelbeard/file_storage.production:latest;
docker pull pavelbeard/frontend.production:latest;

docker-compose -f prod.docker-compose.yml down;
docker-compose -f prod.docker-compose.yml --env-file .env up -d;