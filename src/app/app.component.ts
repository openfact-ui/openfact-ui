import { Component } from '@angular/core';
import { NotificationsService } from './ngx-impl/ngx-base-impl/notifications.service';

@Component({
  selector: 'cn-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'cn';

  constructor(public notifications: NotificationsService) {
  }

  handleAction($event: any): void {
    this.notifications.actionSubject.next($event.action);
  }

}
