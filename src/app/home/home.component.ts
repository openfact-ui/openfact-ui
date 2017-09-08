import { Logger } from 'ngo-base';
import { Router } from '@angular/router';
import { BrandInformation } from './../models/brand-information';
import { Subscription } from 'rxjs';
import { Space, Context, SpaceService, Contexts, Spaces } from 'ngo-openfact-sync';
import { User, UserService } from 'ngo-login-client';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'ofs-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public brandInformation: BrandInformation;

  public loggedInUser: User;
  public recent: Space[];
  private _context: Context;
  private _defaultContext: Context;
  private _spaces: Space[] = [];
  private _spaceSubscription: Subscription;
  private _loggedInUserSubscription: Subscription;
  private _contextSubscription: Subscription;
  private _contextDefaultSubscription: Subscription;

  constructor(
    private userService: UserService,
    private spaceService: SpaceService,
    private router: Router,
    private contexts: Contexts,
    private spaces: Spaces,
    private logger: Logger) {
    this._spaceSubscription = spaces.recent.subscribe((val) => this.recent = val);
  }

  public ngOnInit() {
    this._loggedInUserSubscription = this.userService.loggedInUser.subscribe((val) => {
      this.loggedInUser = val;
    });
    this._contextSubscription = this.contexts.current.subscribe((val) => {
      this._context = val;
    });
    this._contextDefaultSubscription = this.contexts.default.subscribe((val) => {
      this._defaultContext = val;
      this.initSpaces();
    });

    this.brandInformation = new BrandInformation();

    // replace background image with fabric8 background once available
    this.brandInformation.backgroundClass = 'home-fabric8-background-image';
    this.brandInformation.description = 'A free, end-to-end, cloud-native development experience.';
    this.brandInformation.name = 'openfactsync.io';
    this.brandInformation.moreInfoLink = 'https://openfact.io/';
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
        .getSpacesByUser(this.context.user.id, 5)
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
