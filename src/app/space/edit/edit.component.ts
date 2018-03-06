import { Component, OnInit, Inject, Renderer2, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { Context, Space, SpaceService } from './../../ngx/ngx-clarksnut';
import { UserService, User } from './../../ngx/ngx-login-client';
import { ContextService } from './../../ngx-impl/ngx-clarksnut-impl/context.service';

@Component({
  selector: 'cn-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  loggedInUser: User;
  context: Context;
  permittedSpaces: Space[];

  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private contexts: ContextService,
    private userService: UserService,
    private spaceService: SpaceService) {
    this.renderer.addClass(document.body, 'has-project-bar');

    this.userService.loggedInUser
      .map((user) => {
        this.loggedInUser = user;

        const ownedSpaces = (<any>user.attributes).ownedSpaces || [];
        const collaboratedSpaces = (<any>user.attributes).collaboratedSpaces || [];
        return ownedSpaces.concat(collaboratedSpaces);
      })
      .switchMap((spaceIds: string[]) => {
        return Observable.forkJoin(spaceIds.map(id => this.spaceService.getSpaceById(id)));
      })
      .do((spaces) => {
        this.permittedSpaces = spaces;
      })
      .publish().connect();

    this.subscriptions.push(
      this.contexts.current.subscribe(val => {
        this.context = val;
      })
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

  get current() {
    return this.context.space;
  }

}
