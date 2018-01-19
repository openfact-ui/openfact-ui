import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { XHRBackend, RequestOptions } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Keycloak
import { KeycloakService } from './keycloak-service/keycloak.service';
import { KEYCLOAK_HTTP_PROVIDER } from './keycloak-service/keycloak.http';

// Translage
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

// Bootstrap
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';

// Patternfly
import { NotificationModule } from 'patternfly-ng';

// Config
import { clarksnutUIConfigProvider } from './config/clarksnut-ui-config.service';

// Ngx-base
import { Broadcaster, Logger, Notifications } from './ngx-base';

// Ngx-base implementations
import { NotificationsService } from './ngx-base-impl/notifications.service';

// Ngx-login-client
import { AuthenticationService, UserService } from './ngx-login-client';

// Ngx-login-client-impl
import { ApiLocatorService } from './ngx-login-client-impl/api-locator.service';
import { ssoApiUrlProvider } from './ngx-login-client-impl/sso-api.provider';
import { realmProvider } from './ngx-login-client-impl/realm-token.provider';

// Shared Services
import { AboutService } from './shared/about.service';

// Footer & Header
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { ContextSelectorComponent } from './layout/header/context-selector/context-selector.component';
//import { MenusService } from './layout/header/menus.service';

// Error
import { ErrorService } from './layout/error/error.service';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    ContextSelectorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    // Translate
    TranslateModule.forRoot(),

    // Bootstraop
    BsDropdownModule.forRoot(),

    // Patternfly
    NotificationModule,

  ],
  providers: [
    // Keycloak
    KeycloakService,
    KEYCLOAK_HTTP_PROVIDER,

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
    UserService,

    ApiLocatorService,
    ssoApiUrlProvider,
    realmProvider,

    // Shared Services
    AboutService,

    // Error
    ErrorService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
