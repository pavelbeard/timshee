FROM nginx:1.19.10-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY prod.nginx.conf.template /etc/nginx/conf.d/nginx.conf.template
COPY ./certs/fullchain.pem /etc/letsencrypt/certs/fullchain.pem
COPY ./certs/privkey.pem /etc/letsencrypt/certs/privkey.pem

EXPOSE 80
EXPOSE 443

CMD envsubst '${DRF_API_KEY}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'