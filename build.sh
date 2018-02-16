#!/usr/bin/env bash

ng build --prod --aot --build-optimizer
docker build -t clarksnut/clarksnut-ui -f Dockerfile.deploy .
docker push clarksnut/clarksnut-ui
