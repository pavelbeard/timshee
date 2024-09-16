FROM nginx:1.19.10-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY prod.nginx.conf.template /etc/nginx/conf.d/nginx.conf

EXPOSE 80
EXPOSE 443

CMD envsubst '${DRF_API_KEY}' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/nginx.conf; nginx -g 'daemon off;'