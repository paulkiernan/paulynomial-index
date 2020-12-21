FROM nginx:1.19.6-alpine

LABEL org.opencontainers.image.source=https://github.com/paulkiernan/paulynomial-index

COPY conf/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /src
COPY . /src
