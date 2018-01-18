import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { KeycloakService } from './app/keycloak-service/keycloak.service';

if (environment.production) {
  enableProdMode();
}

declare const authUrl: string;
declare const resourceUrl: string;
declare const realm: string;

const noLogin: boolean = false; // convenient for development
if (noLogin) {
  platformBrowserDynamic().bootstrapModule(AppModule);
} else {
  KeycloakService.init(authUrl + '/realms/' + realm + '/account/keycloak.json', { onLoad: 'login-required' })
    .then(() => {
      platformBrowserDynamic().bootstrapModule(AppModule)
    })
    .catch((err: any) => {
      console.log('Error in bootstrap: ' + JSON.stringify(err));
    });

}
