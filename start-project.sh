#!/bin/bash

cp timshee/prod.env timshee/prod.env.copy;
cp postgres-files/prod.env postgres-files/prod.env.copy;

git stash;
git pull;

cp timshee/prod.env.copy timshee/prod.env
cp postgres-files/prod.env.copy postgres-files/prod.env

pip download -r timshee/requirements.txt -d timshee/packages;
docker-compose down;
docker-compose up --build -d;