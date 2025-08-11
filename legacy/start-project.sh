#!/bin/bash

cp .env env.copy;

git stash;
git pull;

cp .env.copy .env;

docker-compose down;
docker-compose up --build -d;