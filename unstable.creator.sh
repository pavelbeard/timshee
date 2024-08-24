#!/bin/zsh
docker-compose -f unstable.creator.docker-compose.yml up -d --build;
docker buildx create --name timshee_builder --use;
docker buildx build --platform linux/amd64,linux/arm64 -t pavelbeard/frontend:unstable -f ./frontend/unstable.Dockerfile ./frontend;
docker buildx build --platform linux/amd64,linux/arm64 -t pavelbeard/django:unstable -f ./timshee/unstable.Dockerfile ./timshee;
