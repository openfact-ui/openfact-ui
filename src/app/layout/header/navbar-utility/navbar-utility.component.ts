import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'cn-navbar-utility',
  templateUrl: './navbar-utility.component.html',
  styleUrls: ['./navbar-utility.component.scss']
})
export class NavbarUtilityComponent implements OnInit, OnDestroy {

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
