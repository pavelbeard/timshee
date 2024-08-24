#!/bin/bash

cp timshee/prod.env timshee/prod.env.copy;
cp postgres-files/prod.env postgres-files/prod.env.copy;

git stash;
git pull;

cp timshee/prod.env.copy timshee/prod.env
cp postgres-files/prod.env.copy postgres-files/prod.env

docker-compose -f unstable.docker-compose.yaml down;
docker-compose -f unstable.docker-compose.yaml up --build -d;