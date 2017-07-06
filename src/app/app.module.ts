import { ErrorService } from './error/errror.service';
import { ApiLocatorService } from './shared/api-locator.service';
import { syncApiUrlProvider } from './shared/sync-api.provider';
import { fabric8UIConfigProvider } from './shared/config/fabric8-ui-config.service';
import { LoginService } from './shared/login.service';
import './rxjs-extensions';

import { ApplicationRef, NgModule } from '@angular/core';
import { Broadcaster, Logger } from 'ngx-base';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';
import { createInputTransfer, createNewHosts, removeNgStyles } from '@angularclass/hmr';

import { AboutModalModule } from './about-modal/about-modal.module';
import { AboutService } from './shared/about.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { DeleteAccountDialogModule } from './delete-account-dialog/delete-account-dialog.module';
import { DropdownModule } from 'ngx-dropdown';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LocalStorageModule } from 'angular-2-local-storage';
import { MomentModule } from 'angular2-moment';
import { NotificationModule } from 'patternfly-ng';
import { NotificationsService } from './shared/notifications.service';
import { RestangularModule } from 'ngx-restangular';
import { WidgetsModule } from 'ngx-widgets';

import { AuthenticationService, HttpService, UserService } from 'ngx-login-client';

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
    DeleteAccountDialogModule,
    DropdownModule,
    LocalStorageModule.withConfig({
      prefix: 'openfact-sync',
      storageType: 'localStorage'
    }),
    MomentModule,
    RestangularModule,
    // WidgetsModule,
    NotificationModule,

    // About Modal
    AboutModalModule,

    // AppRoutingModule must appear last
    AppRoutingModule
  ],
  providers: [
    // Broadcaster must come first
    Broadcaster,
    Logger,
    NotificationsService,

    AboutService,
    LoginService,

    ApiLocatorService,
    ErrorService,
    UserService,

    AuthenticationService,
    HttpService,

    fabric8UIConfigProvider,
    syncApiUrlProvider,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
