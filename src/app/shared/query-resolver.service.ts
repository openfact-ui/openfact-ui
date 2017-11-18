import { DocumentQuery, DocumentQueryBuilder } from './../models/document-quey';
import { Navigation } from '../models/navigation';
import { Observable, ConnectableObservable, Subject, BehaviorSubject } from 'rxjs';
import { Context, Contexts } from 'ngo-openfact-sync';
import { Injectable } from '@angular/core';
import {
  Resolve,
  Router,
  NavigationEnd,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';

@Injectable()
export class QueryResolver implements Resolve<DocumentQueryBuilder> {

  private _lastRoute: string;

  constructor(private router: Router) {
    // The default place to navigate to if the context cannot be resolved
    this._lastRoute = '/_error';
    this.router.errorHandler = (err) => {
      this.router.navigateByUrl(this._lastRoute);
    };

    // Store the last visited URL so we can navigate back if the context
    // cannot be resolved
    this.router.events
      .filter((e) => e instanceof NavigationEnd)
      .map((e: NavigationEnd) => e.urlAfterRedirects)
      .subscribe((val) => this._lastRoute = val);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DocumentQueryBuilder> {
    let builder: DocumentQueryBuilder = DocumentQuery.builder().query(route.params['query']);
    if (builder) {
      return Observable.of(builder);
    } else {
      return Observable.throw('Invalid query');
    }
  }

}
