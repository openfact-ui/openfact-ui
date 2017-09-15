#!/usr/bin/env bash

oc project openfact-dev

export OPENFACT_REALM="openfact"

export OPENFACT_SSO_API_URL="http://`oc get route keycloak --template={{.spec.host}}`/"
export OPENFACT_SYNC_API_URL="http://`oc get route sync --template={{.spec.host}}`/api/"

echo ""
echo "OPENFACT_SSO_API_URL           ${OPENFACT_SSO_API_URL}"
echo "OPENFACT_SYNC_API_URL          ${OPENFACT_SYNC_API_URL}"
echo "OPENFACT_REALM                 ${OPENFACT_REALM}"
echo ""

echo ""
echo "export OPENFACT_SSO_API_URL=${OPENFACT_SSO_API_URL}"
echo "export OPENFACT_SYNC_API_URL=${OPENFACT_SYNC_API_URL}"
echo "export OPENFACT_REALM=${OPENFACT_REALM}"
echo ""
