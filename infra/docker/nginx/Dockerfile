FROM nginx:1.25

WORKDIR /workspace/server

ENV TZ=UTC

COPY ./infra/docker/nginx/*.conf /etc/nginx/conf.d/
