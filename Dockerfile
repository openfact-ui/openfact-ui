# Builds a Docker to deliver dist/
FROM nginx:latest
COPY dist/ /usr/share/nginx/html

VOLUME [ "/usr/share/nginx/html/_config" ]
