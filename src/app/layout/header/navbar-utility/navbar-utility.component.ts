import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  Renderer2,
  AfterViewInit
} from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { NavigationItemConfig } from 'patternfly-ng/navigation';

import { User, UserService } from '../../../ngx/ngx-login-client';

import { KeycloakService } from '../../../keycloak-service/keycloak.service';
import { GettingStartedService } from './../../../getting-started/services/getting-started.service';
import { WindowRef } from './../../../shared/windows-ref.service';

export interface Language {
  id: string;
  name: string;
}

@Component({
  selector: 'cn-navbar-utility',
  templateUrl: './navbar-utility.component.html',
  styleUrls: ['./navbar-utility.component.scss']
})
export class NavbarUtilityComponent implements OnInit, OnDestroy, AfterViewInit {

  loggedInUser: User;
  private subcriptions: Subscription[] = [];

  // Language
  currentLanguage: Language = { id: null, name: 'Browser Default' };
  languages: Language[] = [
    { id: null, name: 'Browser Default' },
    { id: 'en', name: 'English' },
    { id: 'es', name: 'Español' }
  ];

  // Launcher
  navigationItems: NavigationItemConfig[];

  constructor(
    private userService: UserService,
    private keycloakService: KeycloakService,
    private translateService: TranslateService,
    private gettingStartedService: GettingStartedService,
    private renderer: Renderer2,
    private windowsRef: WindowRef, ) {

    // Language
    this.subcriptions.push(
      translateService.onLangChange.subscribe((event: LangChangeEvent) => {
        this.currentLanguage = this.languages.filter((lang) => event.lang == lang.id)[0];
      })
    );

    // Get user
    this.subcriptions.push(
      this.userService.loggedInUser.subscribe((val) => {
        this.loggedInUser = val;
        if (val.attributes.defaultLanguage) {
          this.translateService.use(val.attributes.defaultLanguage);
        }
      })
    );

    // Launcher
    this.navigationItems = [{
      title: 'Home',
      url: '/',
      iconStyleClass: 'pficon-home',
      badges: [{
        count: 4,
        tooltip: 'Launch Home'
      }]
    }, {
      title: 'Collector',
      url: '/_mailcollectorsettings',
      iconStyleClass: 'pficon-settings',
      badges: [{
        count: 1,
        tooltip: 'Configure Mail Collector'
      }]
    }];
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    let jiraButton = document.getElementById('jiraBugsButton');
    if (jiraButton) {
      this.bootstrapJira(jiraButton);
    } else {
      setTimeout(() => {
        jiraButton = document.getElementById('jiraBugsButton');
        if (jiraButton) {
          this.bootstrapJira(jiraButton);
        } else {
          console.log('Could not bootstrap JIRA');
        }
      }, 2000);
    }
  }

  ngOnDestroy() {
    this.subcriptions.forEach(val => val.unsubscribe());
  }

  bootstrapJira(button: any) {
    this.windowsRef.nativeWindow.ATL_JQ_PAGE_PROPS = {
      'triggerFunction': function (showCollectorDialog) {
        button.onclick = function (event) {
          event.preventDefault();
          showCollectorDialog();
        };
      }
    };
  }

  manageAccount() {
    this.keycloakService.manageAccount();
  }

  logout() {
    this.keycloakService.logout();
  }

  selectLanguage(lang: Language) {
    if (!lang) {
      return;
    }

    this.translateService.use(lang.id);

    const profile = this.gettingStartedService.createTransientProfile();
    profile.defaultLanguage = lang.id;

    this.gettingStartedService.update(profile).subscribe(() => { }, (error) => {
      console.log('Could not update user default language:');
    });
  }

}
