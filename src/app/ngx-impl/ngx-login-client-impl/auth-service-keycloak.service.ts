import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../ngx/ngx-login-client/token/auth-service';
import { KeycloakService } from '../../keycloak-service/keycloak.service';

@Injectable()
export class AuthKeycloakService extends AuthService {

  constructor(private keycloakService: KeycloakService) {
    super();
  }

  public getToken(): Observable<string> {
    return Observable.fromPromise(this.keycloakService.getToken());
  }

  public logout(): void {
    this.keycloakService.logout();
  }

}

export let authServiceFactory = (keycloakService: KeycloakService) => {
  return new AuthKeycloakService(keycloakService);
};

export let authServiceProvider = {
  provide: AuthService,
  useFactory: authServiceFactory,
  deps: [KeycloakService]
};
