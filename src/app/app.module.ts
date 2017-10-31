import './rxjs-extensions';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import {
  NgModule,
  ApplicationRef
} from '@angular/core';
import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from '@angularclass/hmr';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { AppRoutingModule } from './app-routing.module';

// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';

import '../styles/patternfly.scss';
import '../styles/headings.css';

import { LocalStorageModule } from 'angular-2-local-storage';
import { MomentModule } from 'angular2-moment';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-modal';

import { RestangularModule } from 'ngx-restangular';
import {
  Broadcaster,
  Logger,
  Notifications
} from 'ngo-base';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {
  Contexts,
  SpaceService,
  Spaces,
  CollaboratorService,
  UBLDocumentService,
  OpenfactSyncModule
} from 'ngo-openfact-sync';
import {
  AuthenticationService,
  HttpService,
  UserService
} from 'ngo-login-client';
import { WidgetsModule } from 'ngx-widgets';
import { PatternFlyNgModule } from 'patternfly-ng';

// Footer & Header
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { MenusService } from './layout/header/menus.service';

// Shared Services
import { AboutService } from './shared/about.service';
import { AnalyticService } from './shared/analytics.service';
import { ApiLocatorService } from './shared/api-locator.service';
import { AuthGuard } from './shared/auth-guard.service';
import { authApiUrlProvider } from './shared/auth-api.provider';
import { BrandingService } from './shared/branding.service';
import { openfactUIConfigProvider } from './shared/config/openfact-ui-config.service';
import { AuthUserResolve } from './shared/common.resolver';
import { ContextService } from './shared/context.service';
import { ContextCurrentUserGuard } from './shared/context-current-user-guard.service';
import { ContextResolver } from './shared/context-resolver.service';
import { DummyService } from './shared/dummy.service';
import { ExperimentalFeatureResolver } from './shared/experimental-feature.resolver';
import { OpenfactUIHttpService } from './shared/openfact-ui-http.service';
import { LoginService } from './shared/login.service';
import { NotificationsService } from './shared/notifications.service';
import { SpacesService } from './shared/spaces.service';
import { ssoApiUrlProvider } from './shared/sso-api.provider';
import { syncApiUrlProvider } from './shared/sync-api.provider';
import { realmProvider } from './shared/realm-token.provider';
//import { OpenfactRuntimeConsoleService } from './shared/runtime-console/openfact-runtime-console.service';
import { ProfileResolver } from './shared/profile-resolver.service';
import { UploadDocumentService } from './shared/upload-document.service';

// Component Services
import { ConfigStore } from './base/config.store';
import { ErrorService } from './layout/error/error.service';
import { ProfileService } from './profile/profile.service';
import { SpaceWizardModule } from './space/wizard/space-wizard.module';
import { DocumentUploadProgressModule } from './document/upload-progress/document-upload-progress.module';

// About Modal
import { AboutModalModule } from './layout/about-modal/about-modal.module';
import { GettingStartedService } from './getting-started/services/getting-started.service';
import { EventService } from './shared/event.service';

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
    FooterComponent,
    HeaderComponent,
  ],
  /**
   * Import Angular's modules.
   */
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    RouterModule,

    BsDropdownModule.forRoot(),
    LocalStorageModule.withConfig({
      prefix: 'openfactsync',
      storageType: 'localStorage'
    }),
    ModalModule,
    MomentModule,
    ReactiveFormsModule,
    RestangularModule,
    WidgetsModule,
    PatternFlyNgModule,

    AboutModalModule,
    OpenfactSyncModule,
    SpaceWizardModule,
    DocumentUploadProgressModule,

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
    AboutService,
    APP_PROVIDERS,

    AuthenticationService,
    AuthGuard,

    LoginService,
    NotificationsService,
    {
      provide: Notifications,
      useExisting: NotificationsService
    },

    // Component Services
    ConfigStore,
    ErrorService,
    ProfileService,

    BrandingService,
    ContextResolver,
    ContextCurrentUserGuard,
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
    CollaboratorService,
    ProfileResolver,
    UploadDocumentService,
    UBLDocumentService,

    // Others
    //OpenfactRuntimeConsoleService,
    {
      provide: Http,
      useClass: OpenfactUIHttpService
    },
    HttpService,

    GettingStartedService,
    MenusService,

    openfactUIConfigProvider,
    ApiLocatorService,
    syncApiUrlProvider,

    UserService,
    authApiUrlProvider,
    ssoApiUrlProvider,
    realmProvider,
  ]
})
export class AppModule {

  constructor(public appRef: ApplicationRef,
    public appState: AppState) {
  }

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
