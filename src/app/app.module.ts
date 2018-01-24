import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import './rxjs-extensions';

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
import { authServiceProvider } from './ngx-login-client-impl/auth-service-keycloak.service';
import { ssoApiUrlProvider } from './ngx-login-client-impl/sso-api.provider';
import { authApiUrlProvider } from './ngx-login-client-impl/auth-api.provider';
import { realmProvider } from './ngx-login-client-impl/realm-token.provider';

// Ngx-clarksnut
import { CollaboratorService, Contexts, Spaces, SpaceService } from './ngx-clarksnut';

// Ngx-clarksnut-impl
import { ContextService } from './ngx-clarksnut-impl/context.service';
import { SpacesService } from './ngx-clarksnut-impl/spaces.service';

// Shared Services
import { AboutService } from './shared/about.service';

// Footer & Header
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { ContextSelectorComponent } from './layout/header/context-selector/context-selector.component';
import { NavbarUtilityComponent } from './layout/header/navbar-utility/navbar-utility.component';
import { NotificationCounterComponent } from './layout/header/notification-counter/notification-counter.component';
//import { MenusService } from './layout/header/menus.service';

// Error
import { ErrorService } from './layout/error/error.service';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    ContextSelectorComponent,
    NavbarUtilityComponent,
    NotificationCounterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    HttpModule,

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
    authServiceProvider,
    ssoApiUrlProvider,
    authApiUrlProvider,
    realmProvider,

    // Ngx-clarksnut
    CollaboratorService,
    ContextService,
    {
      provide: Contexts,
      useExisting: ContextService
    },
    SpacesService,
    {
      provide: Spaces,
      useExisting: SpacesService
    },
    SpaceService,


    // Shared Services
    AboutService,

    // Error
    ErrorService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
