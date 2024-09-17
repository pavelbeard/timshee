FROM nginx:1.19.10-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY test.nginx.conf /etc/nginx/conf.d/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]