import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { XHRBackend, RequestOptions } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Keycloak
import { KeycloakService } from './keycloak/keycloak.service';
import { KeycloakHttp, keycloakHttpFactory } from './keycloak/keycloak.http';

// Translage
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

// Config
import { clarksnutUIConfigProvider } from './config/clarksnut-ui-config.service';

// Ngx-base
import { Broadcaster, Logger, Notifications } from './ngx-base';

// Ngx-base implementations
import { NotificationsService } from './shared/notifications.service';

// Ngx-login-client
import { AuthenticationService, HttpService, UserService } from './ngx-login-client';

// Ngx-login-client-impl
import { ApiLocatorService } from './ngx-login-client-impl/api-locator.service';
import { ssoApiUrlProvider } from './ngx-login-client-impl/sso-api.provider';
import { realmProvider } from './ngx-login-client-impl/realm-token.provider';

// Footer & Header
//import { FooterComponent } from './layout/footer/footer.component';
//import { HeaderComponent } from './layout/header/header.component';
//import { MenusService } from './layout/header/menus.service';

@NgModule({
  declarations: [
    AppComponent,
    //    FooterComponent,
    //HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    // Translate
    TranslateModule.forRoot()


  ],
  providers: [
    // Keycloak
    /*{
      provide: KeycloakHttp,
      useFactory: keycloakHttpFactory,
      deps: [XHRBackend, RequestOptions, KeycloakService]
    },*/
    KeycloakService,

    // Config
    clarksnutUIConfigProvider,

    // Ngx-base
    Broadcaster,
    Logger,
    NotificationsService,
    {
      provide: Notifications,
      useExisting: NotificationsService
    },

    // Ngx-login-client
    AuthenticationService,
    HttpService,
    UserService,

    ApiLocatorService,
    ssoApiUrlProvider,
    realmProvider

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
