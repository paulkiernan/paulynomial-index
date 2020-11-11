FROM nginx:1.19.4-alpine

COPY conf/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /src
COPY . /src