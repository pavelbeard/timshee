FROM nginx:1.19.10-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY test.nginx.conf.template /etc/nginx/conf.d/nginx.conf.template
COPY certs/server.crt /etc/nginx/certs/server.crt
COPY certs/server.key /etc/nginx/certs/server.key

EXPOSE 80
EXPOSE 443

CMD envsubst '${DRF_API_KEY}' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/nginx.conf; nginx -g 'daemon off;'