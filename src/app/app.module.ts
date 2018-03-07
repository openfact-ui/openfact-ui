import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import './rxjs-extensions';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Keycloak
import { KeycloakService } from './keycloak-service/keycloak.service';
import { KEYCLOAK_HTTP_INTERCEPTOR } from './keycloak-service/keycloak.interceptor';

// Translage
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

// Bootstrap
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// Patternfly
import { NotificationModule } from 'patternfly-ng/notification';
import { NavigationModule } from 'patternfly-ng/navigation';

// Config
import { clarksnutUIConfigProvider } from './config/clarksnut-ui-config.service';
import { ApiLocatorService } from './config/api-locator.service';

// Ngx-base
import { Broadcaster, Logger, Notifications } from './ngx/ngx-base';

// Ngx-base implementations
import { NotificationsService } from './ngx-impl/ngx-base-impl/notifications.service';

// Ngx-login-client
import { UserService } from './ngx/ngx-login-client';

// Ngx-login-client-impl
import { authServiceProvider } from './ngx-impl/ngx-login-client-impl/auth-service-keycloak.service';
import { ssoApiUrlProvider } from './ngx-impl/ngx-login-client-impl/sso-api.provider';
import { authApiUrlProvider } from './ngx-impl/ngx-login-client-impl/auth-api.provider';
import { realmProvider } from './ngx-impl/ngx-login-client-impl/realm-token.provider';

// Ngx-clarksnut
import { ClarksnutModule } from './ngx/ngx-clarksnut';
import {
  CollaboratorService,
  RequestAccessService,
  Contexts,
  Spaces,
  SpaceService,
  UBLDocumentService,
  PartyService
} from './ngx/ngx-clarksnut';

// Ngx-clarksnut-impl
import { ContextService } from './ngx-impl/ngx-clarksnut-impl/context.service';
import { SpacesService } from './ngx-impl/ngx-clarksnut-impl/spaces.service';
import { clarksnutApiUrlProvider } from './ngx-impl/ngx-clarksnut-impl/clarksnut-api.provider';
import { ContextResolver } from './ngx-impl/ngx-clarksnut-impl/context-resolver.service';

// Ngx-clarksnut-mail-collector
import { LinkService } from './ngx/ngx-clarksnut-mail-collector';
import { UserService as UserMailCollectorService } from './ngx/ngx-clarksnut-mail-collector';

// Ngx-clarksnut-mail-collector-impl
import { clarksnutMailCollectorApiUrlProvider } from './ngx-impl/ngx-clarksnut-mail-collector-impl/clarksnut-mail-collector-api.provider';

// Custom modules
import { AboutModalModule } from './layout/about-modal/about-modal.module';

// Getting Services
import { GettingStartedService } from './getting-started/services/getting-started.service';
import { UserNotificationsService } from './layout/header/services/notifications.service';

// Shared Services
import { AboutService } from './shared/about.service';
import { WindowRef } from './shared/windows-ref.service';

// Component Services
import { ProfileService } from './profile/profile.service';

// Footer & Header
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { NavbarUtilityComponent } from './layout/header/navbar-utility/navbar-utility.component';
import { NotificationCounterComponent } from './layout/header/notification-counter/notification-counter.component';
import { EventService } from './ngx-impl/ngx-clarksnut-impl/event.service';
import { SidebarComponent } from './layout/header/sidebar/sidebar.component';
import { SpaceSidebarComponent } from './layout/header/space-sidebar/space-sidebar.component';

// Search
import { SearchEventService } from './shared/search-event.service';

// Error
import { ErrorService } from './layout/error/error.service';

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    NavbarUtilityComponent,
    NotificationCounterComponent,
    SidebarComponent,
    SpaceSidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    HttpClientModule,

    // Translate
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),

    // Bootstraop
    BsDropdownModule.forRoot(),

    // Patternfly
    NotificationModule,
    NavigationModule,

    // Custom modules
    ClarksnutModule,
    AboutModalModule,
  ],
  providers: [
    // Keycloak
    KeycloakService,
    KEYCLOAK_HTTP_INTERCEPTOR,

    // Config
    clarksnutUIConfigProvider,
    ApiLocatorService,

    // Ngx-base
    Broadcaster,
    Logger,
    NotificationsService,
    {
      provide: Notifications,
      useExisting: NotificationsService
    },

    // Ngx-login-client
    UserService,

    authServiceProvider,
    ssoApiUrlProvider,
    authApiUrlProvider,
    realmProvider,

    // Ngx-clarksnut
    clarksnutApiUrlProvider,
    CollaboratorService,
    ContextResolver,
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
    UBLDocumentService,
    RequestAccessService,
    PartyService,

    // Ngx-clarksnut-mail-collector
    LinkService,
    UserMailCollectorService,
    clarksnutMailCollectorApiUrlProvider,

    // Getting Services
    GettingStartedService,
    UserNotificationsService,

    // Shared Services
    AboutService,
    WindowRef,

    // Component Services
    ProfileService,

    // Footer & Header
    EventService,

    // Search
    SearchEventService,

    // Error
    ErrorService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
