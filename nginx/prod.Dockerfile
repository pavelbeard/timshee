FROM nginx:latest

RUN rm /etc/nginx/conf.d/default.conf
COPY prod.Dockerfile /etc/nginx/conf.d/nginx.conf

EXPOSE 80