import './rxjs-extensions';

import { Fabric8UIHttpService } from './shared/fabric8-ui-http.service';

import { ApplicationRef, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';
import { createInputTransfer, createNewHosts, removeNgStyles } from '@angularclass/hmr';

import { AboutModalModule } from './about-modal/about-modal.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { DropdownModule } from 'ngx-dropdown';
import { LocalStorageModule } from 'angular-2-local-storage';
import { MomentModule } from 'angular2-moment';
import { NotificationModule, NotificationService } from 'patternfly-ng';
import { RestangularModule } from 'ngx-restangular';
import { WidgetsModule } from 'ngx-widgets';

import {
  Broadcaster,
  Logger
} from 'ngx-base';

import {
  AuthenticationService,
  HttpService,
  UserService
} from 'ngx-login-client';

import {
  // Base functionality for the runtime console
  OnLogin,
} from './openfact-runtime-console';

// Header & Footer
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

// Component Services
import { ConfigStore } from './base/config.store';
import { DeleteAccountDialogModule } from './delete-account-dialog/delete-account-dialog.module';
import { ErrorService } from './error/error.service';
import { ProfileService } from './profile/profile.service';

// Shared Services
import { AboutService } from './shared/about.service';
import { LoginService } from './shared/login.service';
import { NotificationsService } from './shared/notifications.service';
import { ApiLocatorService } from './shared/api-locator.service';
import { authApiUrlProvider } from './shared/auth-api.provider';
import { ssoApiUrlProvider } from './shared/sso-api.provider';
import { realmProvider } from './shared/realm-token.provider';
import { fabric8UIConfigProvider } from './shared/config/fabric8-ui-config.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,

    // Third party modules
    DropdownModule,
    LocalStorageModule.withConfig({
      prefix: 'openfact-sync',
      storageType: 'localStorage'
    }),
    MomentModule,
    RestangularModule,
    NotificationModule,

    // About Modal
    AboutModalModule,

    // Delete Account Modal
    DeleteAccountDialogModule,

    // AppRoutingModule must appear last
    AppRoutingModule
  ],
  providers: [
    // Broadcaster must come first
    Broadcaster,
    AuthenticationService,
    OnLogin,

    // Component Services
    ConfigStore,
    ErrorService,
    ProfileService,

    // Shared Services
    ApiLocatorService,
    authApiUrlProvider,
    ssoApiUrlProvider,
    realmProvider,
    fabric8UIConfigProvider,
    AboutService,
    LoginService,
    NotificationsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
