import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { NotificationService, Notification, NotificationType, Action } from 'patternfly-ng';

@Injectable()
export class NotificationsService {

  public static readonly MAX_TOAST_NOTIFICATIONS = 8;

  public actionSubject = new Subject<any>();
  private _actionObserver = this.actionSubject
    .asObservable()
    .map((val) => val as Action);

  private _stream: Subject<Notification> = new Subject();

  constructor(private notificationService: NotificationService) {
  }

  public message(notification: Notification): Observable<Notification> {
    // Trim the list
    // tslint:disable-next-line:max-line-length
    if (this.notificationService.getNotifications.length > NotificationsService.MAX_TOAST_NOTIFICATIONS) {
      for (let i: number = this.notificationService.getNotifications().length - 1; i >= 0; i--) {
        if (i >= 8) {
          this.notificationService.remove(this.notificationService.getNotifications()[i]);
        }
      }
    }

    this.notificationService.message(
      notification.type,
      notification.header,
      notification.message,
      false,
      notification.primaryAction,
      notification.moreActions
    );
    this._stream.next(notification);
    return this._actionObserver;
  }

  get stream(): Observable<Notification> {
    return this._stream.asObservable();
  }

  get current(): any[] {
    return this.notificationService.getNotifications();
  }

  get recent(): Observable<Notification[]> {
    return Observable.empty();
  }

}