import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {Notification, NotificationType, Notifications} from 'ngo-base';
import {Context, Contexts} from 'ngo-openfact-sync';
import {AuthenticationService, UserService, User} from 'ngo-login-client';

import {ExtProfile, GettingStartedService} from '../../getting-started/services/getting-started.service';
import {ProviderService} from '../../getting-started/services/provider.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'ofs-update',
  templateUrl: 'update.component.html',
  styleUrls: ['./update.component.scss'],
  providers: [GettingStartedService, ProviderService]
})
export class UpdateComponent implements AfterViewInit, OnInit {


  constructor() {

  }

  ngAfterViewInit(): void {

  }

  ngOnInit() {
  }

  ngOnDestroy(): void {

  }


}
