#!/bin/zsh
docker-compose -f unstable.creator.docker-compose.yml up -d --build;
docker build -t pavelbeard/frontend:unstable -f ./frontend/unstable.Dockerfile ./frontend;
docker build -t pavelbeard/django:unstable -f ./timshee/unstable.Dockerfile ./timshee;
