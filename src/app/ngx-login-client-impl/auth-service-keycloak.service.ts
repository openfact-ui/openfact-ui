import { Observable } from 'rxjs';
import { KeycloakService } from './../keycloak/keycloak.service';
import { AuthService } from './../ngx-login-client/auth-service';

export class AuthKeycloakService extends AuthService {

  constructor(private keycloakService: KeycloakService) {
    super();
  }

  public getToken(): Observable<string> {
    return Observable.fromPromise(this.keycloakService.getToken());
  }

  public logout(): void {
    KeycloakService.logout();
  }

}
