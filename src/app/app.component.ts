import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from './ngx-impl/ngx-base-impl/notifications.service';

@Component({
  selector: 'cn-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'Clarksnut';

  constructor(
    private translateService: TranslateService,
    public notifications: NotificationsService) {
    this.translateService.setDefaultLang('es');
  }

  handleAction($event: any): void {
    this.notifications.actionSubject.next($event.action);
  }

}
