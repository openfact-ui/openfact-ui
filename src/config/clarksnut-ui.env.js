/*window.ClarksnutUIEnv = {
  "ssoApiUrl": "{{ .Env.CLARKSNUT_SSO_API_URL }}",
  "clarksnutApiUrl": "{{ .Env.CLARKSNUT_API_URL }}",
  "authApiUrl": "{{ .Env.CLARKSNUT_AUTH_API_URL }}"
};*/

window.ClarksnutUIEnv = {
  "ssoApiUrl": "http://keycloak-keycloak-sso.apps.console.sistcoop.org/auth",
  "clarksnutApiUrl": "{{ .Env.CLARKSNUT_API_URL }}",
  "authApiUrl": "{{ .Env.CLARKSNUT_AUTH_API_URL }}"
};
