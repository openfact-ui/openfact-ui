import './rxjs-extensions';

import { SyncStatusComponent } from './sync-status-list/sync-status.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  NgModule,
  ApplicationRef
} from '@angular/core';
import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from '@angularclass/hmr';
import {
  RouterModule,
  PreloadAllModules
} from '@angular/router';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { AppRoutingModule } from './app-routing.module';

// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';

import {
  Broadcaster,
  Logger
} from 'ngo-base';

import {
  AuthenticationService,
  UserService
} from 'ngo-login-client';

import {
  Contexts,
  SpaceService,
  Spaces,
  CollaboratorService,
  OpenfactSyncModule
} from 'ngo-openfact-sync';

import {
  // Base functionality for the runtime console
  OnLogin
} from './runtime-console/shared/onlogin.service';

// Header & Footer
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MenusService } from './layout/header/menus.service';

// Component Services
import { ConfigStore } from './base/config.store';
import { ErrorService } from './layout/error/error.service';
// import { DeleteAccountDialogModule } from './delete-account-dialog/delete-account-dialog.module';
// import { ProfileService } from './profile/profile.service';
import { SpaceWizardModule } from './space/wizard/space-wizard.module';
import { ProfileService } from './profile/profile.service';

// About Modal
import { AboutModalModule } from './layout/about-modal/about-modal.module';

import { EventService } from './shared/event.service';

// Shared Services
import { AboutService } from './shared/about.service';
import { NotificationsService } from './shared/notifications.service';
import { LoginService } from './shared/login.service';

import { fabric8UIConfigProvider } from './shared/config/fabric8-ui-config.service';
import { ApiLocatorService } from './shared/api-locator.service';
import { syncApiUrlProvider } from './shared/sync-api.provider';

import { authApiUrlProvider } from './shared/auth-api.provider';
import { ssoApiUrlProvider } from './shared/sso-api.provider';
import { realmProvider } from './shared/realm-token.provider';

import { Fabric8UIOnLogin } from './shared/runtime-console/fabric8-ui-onlogin.service';

import { AuthGuard } from './shared/auth-guard.service';

import { SpacesService } from './shared/spaces.service';
import { ContextService } from './shared/context.service';
import { ContextResolver } from './shared/context-resolver.service';
import { ProfileResolver } from './shared/profile-resolver.service';

// Others
import { GettingStartedService } from './getting-started/services/getting-started.service';

// Third Party libs
import { PatternFlyNgModule } from 'patternfly-ng';
import { LocalStorageModule } from 'angular-2-local-storage';
import { Ng2KeycloakModule, Keycloak } from '@ebondu/angular2-keycloak';
import { ModalModule } from 'ngx-modal';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { MomentModule } from 'angular2-moment';
import { RestangularModule } from 'ngx-restangular';

import '../styles/styles.scss';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SyncStatusComponent,
  ],
  /**
   * Import Angular's modules.
   */
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,

    AboutModalModule,
    SpaceWizardModule,

    OpenfactSyncModule,

    // Third Party libs
    Ng2KeycloakModule.forRoot(),
    PatternFlyNgModule,
    LocalStorageModule.withConfig({
      prefix: 'fabric8',
      storageType: 'localStorage'
    }),
    ModalModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    MomentModule,
    RestangularModule.forRoot(),

    // AppRoutingModule must appear last
    AppRoutingModule,
  ],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
    // Broadcaster must come first
    Broadcaster,
    Logger,
    EventService,

    ENV_PROVIDERS,
    APP_PROVIDERS,

    Keycloak,
    AuthenticationService,
    UserService,
    {
      provide: OnLogin,
      useClass: Fabric8UIOnLogin
    },

    SpacesService,
    SpaceService,
    {
      provide: Spaces,
      useExisting: SpacesService
    },
    ContextService,
    {
      provide: Contexts,
      useExisting: ContextService
    },
    ContextResolver,
    ProfileResolver,

    // Component Services
    ConfigStore,
    ErrorService,
    ProfileService,

    // Shared Services
    AboutService,
    NotificationsService,
    LoginService,

    fabric8UIConfigProvider,
    ApiLocatorService,
    syncApiUrlProvider,

    // Others
    GettingStartedService,
    MenusService,

    // Third party
    BsDropdownConfig,
    TooltipConfig,

    authApiUrlProvider,
    ssoApiUrlProvider,
    realmProvider,

    AuthGuard,
  ]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef,
    public appState: AppState
  ) { }

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    console.log('HMR store', JSON.stringify(store, null, 2));
    /**
     * Set state
     */
    this.appState._state = store.state;
    /**
     * Set input values
     */
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    /**
     * Save state
     */
    const state = this.appState._state;
    store.state = state;
    /**
     * Recreate root elements
     */
    store.disposeOldHosts = createNewHosts(cmpLocation);
    /**
     * Save input values
     */
    store.restoreInputValues = createInputTransfer();
    /**
     * Remove styles
     */
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    /**
     * Display new elements
     */
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
