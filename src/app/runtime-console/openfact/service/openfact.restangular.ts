import { NgModule, InjectionToken } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { OAuthService } from 'angular2-oauth2/oauth-service';
import { OnLogin } from '../../shared/onlogin.service';
import { AuthenticationService } from 'ngx-login-client';
import { LoginService } from '../../shared/login.service';
import { Route } from '../model/route.model';
import { OpenfactResource } from '../model/openfactresource.model';
import { currentOAuthConfig } from '../store/oauth-config-store';

export const OPENFACT_RESTANGULAR = new InjectionToken<string>('OpenfactRestangular');

function convertToOpenfactResource(resource) {
  // TODO would be nice to make this bit more modular so
  // we could register other kinds of resource more easily

  let kind = resource.kind;
  if (!kind) {
    return resource;
  }
  switch (kind) {
    default:
      console.log('Unknown resource kind ' + kind);
      return new OpenfactResource().setResource(resource);
  }
}

export function OpenfactRestangularFactory(restangular: Restangular, onLogin: OnLogin) {

  const config = restangular.withConfig((RestangularConfigurer) => {
    let baseUrl = '';

    // console.log('using Restangular base URL ' + baseUrl);
    RestangularConfigurer.setBaseUrl(baseUrl);

    RestangularConfigurer.addErrorInterceptor((error, operation, what, url, response) => {
      return OpenfactErrorInterceptor(error, operation, what, url, response);
    });

  });
  return config;
}

function OpenfactErrorInterceptor(error, operation, what, url, response) {
  return null;
}

@NgModule({
  providers: [
    {
      provide: OPENFACT_RESTANGULAR,
      useFactory: OpenfactRestangularFactory,
      deps: [Restangular, OAuthService, OnLogin]
    },
  ],
})
export class OpenfactRestangularModule {
}
