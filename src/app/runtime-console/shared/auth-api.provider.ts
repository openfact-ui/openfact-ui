import { AUTH_API_URL } from 'ngx-login-client';

function authApiUrlFactory() {
    return process.env.API_URL;
}

export let authApiUrlProvider = {
    provide: AUTH_API_URL,
    useFactory: authApiUrlFactory
};
