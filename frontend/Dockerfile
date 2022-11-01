FROM nginx:1.23.2

RUN apt update
RUN apt install jq -y

COPY override_config.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/override_config.sh

COPY ./dist/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf