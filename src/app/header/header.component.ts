import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { Subscription, Observable } from 'rxjs';

import { ContextService } from '../shared/context.service';
import { MenuedContextType } from './menued-context-type';
import { Navigation } from '../models/navigation';
import { MenuItem } from '../models/menu-item';
import { DummyService } from '../shared/dummy.service';

interface MenuHiddenCallback {
  (headerComponent: HeaderComponent): Observable<boolean>;
}

@Component({
  selector: 'ofs-app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(
    public router: Router,
    public route: ActivatedRoute) { }

  public ngOnInit(): void {
  }

  public ngOnDestroy() {
  }

  get isGettingStartedPage(): boolean {
    return (this.router.url.indexOf('_gettingstarted') !== -1);
  }

}
