FROM node:latest

WORKDIR /usr/src/app

COPY ./timshee/package*.json ./

RUN npm install

COPY ./timshee .

RUN npm run build:stagging

#########
# FINAL #
#########
FROM nginx:1.19.10-alpine

COPY --from=0 /usr/src/app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY prod.nginx.conf /etc/nginx/conf.d/nginx.conf
COPY server.crt /etc/nginx/certs/server.crt
COPY server.key /etc/nginx/certs/server.key

EXPOSE 80
EXPOSE 443