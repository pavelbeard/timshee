#!/bin/bash

cp timshee/preprod.env timshee/preprod.env.copy;
cp postgres-files/preprod.env postgres-files/preprod.env.copy;

git stash;
git pull;

cp timshee/preprod.env.copy timshee/preprod.env
cp postgres-files/preprod.env.copy postgres-files/preprod.env

docker-compose down;
docker-compose up --build -d;