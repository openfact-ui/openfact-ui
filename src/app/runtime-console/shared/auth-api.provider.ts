import { AUTH_API_URL } from 'ngo-login-client';

function authApiUrlFactory() {
    return process.env.API_URL;
}

export let authApiUrlProvider = {
    provide: AUTH_API_URL,
    useFactory: authApiUrlFactory
};
