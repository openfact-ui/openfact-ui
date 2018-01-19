import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { KeycloakService } from './app/keycloak-service/keycloak.service';
import { window } from 'rxjs/operators/window';

if (environment.production) {
  enableProdMode();
}

const noLogin: boolean = false; // convenient for development
if (noLogin) {
  platformBrowserDynamic().bootstrapModule(AppModule);
} else {
  KeycloakService.init({ onLoad: 'login-required' }).then(() => {
    platformBrowserDynamic().bootstrapModule(AppModule)
  }).catch((err: any) => {
    console.log('Error in bootstrap: ' + JSON.stringify(err));
  });
}
