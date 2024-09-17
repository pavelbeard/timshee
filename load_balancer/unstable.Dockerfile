FROM nginx:1.19.10-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY test.nginx.conf /etc/nginx/conf.d/nginx.conf
COPY certs/server.crt /etc/nginx/certs/server.crt
COPY certs/server.key /etc/nginx/certs/server.key

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]