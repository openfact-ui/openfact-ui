#!/usr/bin/env bash
ng build --prod --aot --build-optimizer
docker build -t clarksnut/clarksnut-ui .
docker build -t clarksnut/clarksnut-ui-openshift -f Dockerfile.deploy .
docker tag clarksnut/clarksnut-ui clarksnut/clarksnut-ui:$(git rev-parse --short HEAD);
docker tag clarksnut/clarksnut-ui-openshift clarksnut/clarksnut-ui-openshift:$(git rev-parse --short HEAD);
docker push clarksnut/clarksnut-ui
docker push clarksnut/clarksnut-ui-openshift
