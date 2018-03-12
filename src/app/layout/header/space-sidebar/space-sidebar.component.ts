import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { User, UserService } from '../../../ngx/ngx-login-client';
import { KeycloakService } from '../../../keycloak-service/keycloak.service';

@Component({
  selector: 'cn-space-sidebar',
  templateUrl: './space-sidebar.component.html',
  styleUrls: ['./space-sidebar.component.scss']
})
export class SpaceSidebarComponent implements OnInit {

  @Input() shown = false;

  user: User;
  private subcriptions: Subscription[] = [];

  constructor(
    private keycloakService: KeycloakService,
    private userService: UserService) {
    // Get user
    this.subcriptions.push(
      this.userService.loggedInUser.subscribe((val) => {
        this.user = val;
      })
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subcriptions.forEach(val => val.unsubscribe());
  }

  logout() {
    this.keycloakService.logout();
  }

}
