#!/bin/bash

cp timshee/prod.env timshee/prod.env.copy;
cp postgres-files/prod.env postgres-files/prod.env.copy;

git stash;
git pull;

cp timshee/prod.env.copy timshee/prod.env
cp postgres-files/prod.env.copy postgres-files/prod.env

docker pull pavelbeard/django.production:latest;
docker pull pavelbeard/frontend.production:latest;

docker-compose -f prod.images.docker-compose.yaml down;
docker-compose -f prod.images.docker-compose.yaml up -d;