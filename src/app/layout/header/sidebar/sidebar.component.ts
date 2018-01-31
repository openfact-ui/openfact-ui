import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { User, UserService } from '../../../ngx/ngx-login-client';
import { KeycloakService } from '../../../keycloak-service/keycloak.service';

@Component({
  selector: 'cn-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  @Input() shown: boolean = false;

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
