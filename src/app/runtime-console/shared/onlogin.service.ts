import { Injectable } from '@angular/core';

@Injectable()
export class OnLogin {

    // TODO - remove this in favor of handling all tokens through ngx-login-client
    get token(): string {
        return localStorage.getItem('openfact_token')
            || localStorage.getItem('openfact-sync_token');
    }

    public onLogin(token: string) {
        localStorage.setItem('openfact_token', token);
    }
}
