import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

import { Subscription } from 'rxjs';

import { Space, Spaces, SpaceService, Context, Contexts } from 'ngo-openfact-sync';
import { UserService, User } from 'ngo-login-client';

import { Logger } from 'ngo-base';
import { OpenfactUIConfig } from '../shared/config/openfact-ui-config';
import { BrandInformation } from '../models/brand-information';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  loggedInUser: User;
  recent: Space[];
  private _context: Context;
  private _defaultContext: Context;
  private _spaces: Space[] = [];
  private _spaceSubscription: Subscription;
  private _loggedInUserSubscription: Subscription;
  private _contextSubscription: Subscription;
  private _contextDefaultSubscription: Subscription;
  public brandInformation: BrandInformation;

  constructor(private userService: UserService,
    private spaceService: SpaceService,
    private router: Router,
    private contexts: Contexts,
    private spaces: Spaces,
    private logger: Logger,
    private openfactUIConfig: OpenfactUIConfig) {
    this._spaceSubscription = spaces.recent.subscribe((val) => this.recent = val);
  }

  public ngOnInit() {
    this._loggedInUserSubscription = this.userService.loggedInUser.subscribe((val) => this.loggedInUser = val);
    this._contextSubscription = this.contexts.current.subscribe((val) => {
      this._context = val;
    });
    this._contextDefaultSubscription = this.contexts.default.subscribe((val) => {
      this._defaultContext = val;
      this.initSpaces();
    });

    this.brandInformation = new BrandInformation();
  }

  public ngOnDestroy() {
    this._spaceSubscription.unsubscribe();
    this._loggedInUserSubscription.unsubscribe();
    this._contextSubscription.unsubscribe();
    this._contextDefaultSubscription.unsubscribe();
  }

  public initSpaces() {
    if (this.context && this.context.user) {
      this.spaceService
        .getSpacesByUser(this.context.user.attributes.username, 5)
        .subscribe((spaces) => {
          this._spaces = spaces;
        });
    } else {
      this.logger.error('Failed to retrieve list of spaces owned by user');
    }
  }

  get context(): Context {
    if (this.router.url === '/_home') {
      return this._defaultContext;
    } else {
      return this._context;
    }
  }

}
