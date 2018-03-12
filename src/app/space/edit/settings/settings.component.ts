import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Notifications, Notification, NotificationType } from './../../../ngx/ngx-base';
import { Context, Space, SpaceService, SpaceAttributes, SpaceRelatedLink } from './../../../ngx/ngx-clarksnut';
import { ContextService } from './../../../ngx-impl/ngx-clarksnut-impl/context.service';

import { cloneDeep } from 'lodash';

@Component({
  selector: 'cn-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  space: Space;

  private _context: Context;
  private subcriptions: Subscription[] = [];

  constructor(
    private spaceService: SpaceService,
    private contexts: ContextService,
    private notifications: Notifications
  ) {
    this.subcriptions.push(
      contexts.current.subscribe((context) => {
        this._context = context
        this.spaceService.getUserSpaceById('me', context.space.id).subscribe((space) => {
          this.space = space;
        });
      })
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subcriptions.forEach((subs) => subs.unsubscribe());
  }

  save() {
    const updatedSpace = this.createTransientSpace();
    updatedSpace.attributes.name = this.space.attributes.name;
    updatedSpace.attributes.description = this.space.attributes.description;

    this.spaceService.update('me', updatedSpace).subscribe((val) => {
      this.notifications.message({
        message: 'Espacio actualizado',
        type: NotificationType.SUCCESS
      } as Notification);
    });
  }

  createTransientSpace(): Space {
    const space = {} as Space;
    space.id = this.space.id;
    space.type = 'spaces';
    space.attributes = new SpaceAttributes();
    return space;
  }

}
