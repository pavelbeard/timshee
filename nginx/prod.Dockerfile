FROM nginx:latest

RUN rm /etc/nginx/conf.d/default.conf
COPY test.nginx.conf /etc/nginx/conf.d/nginx.conf

EXPOSE 8111