FROM nginx:1.19.10-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY prod.nginx.conf /etc/nginx/conf.d/nginx.conf
COPY ./certs/fullchain.pem /etc/letsencrypt/certs/fullchain.pem
COPY ./certs/privkey.pem /etc/letsencrypt/certs/privkey.pem

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]