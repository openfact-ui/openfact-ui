import { Observable } from 'rxjs';
import { AuthService } from './../ngx-login-client/token/auth-service';
import { KeycloakService } from '../keycloak-service/keycloak.service';

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
