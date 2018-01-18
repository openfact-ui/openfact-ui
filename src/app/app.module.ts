import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { XHRBackend, RequestOptions } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { KeycloakService } from './keycloak/keycloak.service';
import { KeycloakHttp, keycloakHttpFactory } from './keycloak/keycloak.http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: KeycloakHttp,
      useFactory: keycloakHttpFactory,
      deps: [XHRBackend, RequestOptions, KeycloakService]
    },
    KeycloakService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
