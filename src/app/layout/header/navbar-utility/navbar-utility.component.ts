import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { User } from './../../../ngx-login-client';
import { UserService } from '../../../ngx-login-client';

import { KeycloakService } from '../../../keycloak-service/keycloak.service';
import { GettingStartedService } from './../../../getting-started/services/getting-started.service';

interface Language {
  id: string;
  name: string;
}

@Component({
  selector: 'cn-navbar-utility',
  templateUrl: './navbar-utility.component.html',
  styleUrls: ['./navbar-utility.component.scss']
})
export class NavbarUtilityComponent implements OnInit, OnDestroy {

  user: User;
  private subcriptions: Subscription[] = [];


  currentLanguage: Language = { id: null, name: 'Browser Default' };
  languages: Language[] = [
    { id: null, name: 'Browser Default' },
    { id: 'en', name: 'English' },
    { id: 'es', name: 'Español' }
  ];
  private defaultLanguage: string = 'en';

  constructor(
    private userService: UserService,
    private keycloakService: KeycloakService,
    private translateService: TranslateService,
    private gettingStartedService: GettingStartedService) {

    // Language
    this.translateService.setDefaultLang('en');
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLanguage = this.languages.filter((lang) => event.lang == lang.id)[0];
    });

    // Get user
    this.subcriptions.push(
      this.userService.loggedInUser.subscribe((val) => {
        this.user = val;
        this.translateService.use((<any>val.attributes).defaultLanguage || this.defaultLanguage);
      })
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subcriptions.forEach(val => val.unsubscribe());
  }

  manageAccount() {
    this.keycloakService.manageAccount();
  }

  logout() {
    this.keycloakService.logout();
  }

  selectLanguage(lang: Language) {
    const languageId = lang.id || this.defaultLanguage;
    this.translateService.use(languageId);

    let profile = this.gettingStartedService.createTransientProfile();
    profile.defaultLanguage = languageId;

    this.gettingStartedService.update(profile).subscribe(() => { }, error => {
      console.log('Could not update user default language:');
    });
  }

}