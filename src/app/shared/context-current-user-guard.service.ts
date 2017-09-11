import { NotificationService, NotificationType } from 'patternfly-ng';
import { Observable } from 'rxjs/Observable';
import { Contexts } from 'ngo-openfact-sync';
import { UserService } from 'ngo-login-client';
import { Injectable } from '@angular/core';
import {
    Resolve,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    NavigationEnd
} from '@angular/router';

@Injectable()
export class ContextCurrentUserGuard implements Resolve<any> {

    private _lastRoute: string;

    constructor(
        private contexts: Contexts,
        private router: Router,
        private userService: UserService,
        private notifications: NotificationService
    ) {
        // The default place to navigate to if the context cannot be resolved is /home
        this._lastRoute = '/_home';
        // Store the last visited URL so we can navigate back if the context
        // cannot be resolved
        this.router.events
            .filter((e) => e instanceof NavigationEnd)
            .map((e: NavigationEnd) => e.urlAfterRedirects)
            .subscribe((val) => this._lastRoute = val);
    }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return Observable.combineLatest(
            // tslint:disable-next-line:max-line-length
            this.contexts.current.map((val) => val.user.id).do((val) => console.log('context', val)),
            this.userService.loggedInUser.map((val) => val.id).do((val) => console.log('user', val)),
            (a, b) => (a === b)
        )
            .do((val) => {
                if (!val) {
                    this.notifications.message(NotificationType.WARNING, 'Warning',
                        `You cannot access ${state.url}`, false, null, []);
                }
            }).map((val) => {
                if (val) {
                    return true;
                } else {
                    this.router.navigateByUrl(this._lastRoute);
                    return false;
                }
            }).first();
    }
}
