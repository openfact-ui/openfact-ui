#!/bin/bash

# Show command before executing
set -x

set -e

# Build builder image
docker build -t openfact-ui-ui-builder -f Dockerfile.builder .
# User root is required to run webdriver-manager update. This shouldn't be a problem for CI containers
mkdir -p dist && docker run --detach=true --name=openfact-ui-ui-builder --user=root --cap-add=SYS_ADMIN -e "API_URL=http://api.prod-preview.openshift.io/api/" -e "CI=true" -t -v $(pwd)/dist:/dist:Z openfact-ui-ui-builder

# Build
docker exec openfact-ui-ui-builder npm install

# Clean up OpenShift builds, pipelines, etc. from prior jobs

docker exec openfact-ui-ui-builder wget https://github.com/openshift/origin/releases/download/v1.5.0/openshift-origin-client-tools-v1.5.0-031cbe4-linux-64bit.tar.gz

docker exec openfact-ui-ui-builder tar -xzvf openshift-origin-client-tools-v1.5.0-031cbe4-linux-64bit.tar.gz

docker exec openfact-ui-ui-builder openshift-origin-client-tools-v1.5.0-031cbe4-linux-64bit/oc login https://api.starter-us-east-2.openshift.com --token=$4

docker exec openfact-ui-ui-builder openshift-origin-client-tools-v1.5.0-031cbe4-linux-64bit/oc delete bc --all -n almusertest1
docker exec openfact-ui-ui-builder openshift-origin-client-tools-v1.5.0-031cbe4-linux-64bit/oc delete build --all -n almusertest1
docker exec openfact-ui-ui-builder openshift-origin-client-tools-v1.5.0-031cbe4-linux-64bit/oc delete build --all -n almusertest1-test
docker exec openfact-ui-ui-builder openshift-origin-client-tools-v1.5.0-031cbe4-linux-64bit/oc delete build --all -n almusertest1-stage
docker exec openfact-ui-ui-builder openshift-origin-client-tools-v1.5.0-031cbe4-linux-64bit/oc delete build --all -n almusertest1-run

## Delete/cleanup Jenkins jobs - commented out for now - until test can run more reliably
##
## export TOKEN=`docker exec openfact-ui-ui-builder cat ../.kube/config | grep token | sed -e 's/token://g' |  sed -e 's/ //g'`
## export ID=`docker exec openfact-ui-ui-builder openshift-origin-client-tools-v1.5.0-031cbe4-linux-64bit/oc whoami`
## export GITID=almightytest
##
## curl  -d "json=%7B%7D&Submit=Yes"  -X POST -H "Authorization: Bearer ${TOKEN}" -H "Referer: https://jenkins-${ID}-jenkins.8a09.starter-us-east-2.openshiftapps.com/job/${GITID}/delete" -H "Content-Type: application/x-www-form-urlencoded" https://jenkins-${ID}-jenkins.8a09.starter-us-east-2.openshiftapps.com/job/${GITID}/doDelete

# Exec EE tests
docker exec openfact-ui-ui-builder ./local_run_EE_tests.sh $1 $2 $3

# Test results to archive
docker cp openfact-ui-ui-builder:/home/openfact-ui/openfact-ui-ui/target/ .
docker cp openfact-ui-ui-builder:/home/openfact-ui/openfact-ui-ui/functional_tests.log target

