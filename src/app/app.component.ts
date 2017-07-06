import { LoginService } from './shared/login.service';
import { NotificationsService } from './shared/notifications.service';
import { ActivatedRoute } from '@angular/router';
import { AboutService } from './shared/about.service';
/**
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { AppState } from './app.service';

/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  constructor(
    public appState: AppState,
    private about: AboutService,
    private activatedRoute: ActivatedRoute,
    public notifications: NotificationsService,
    private loginService: LoginService,
  ) { }

  public ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

}
