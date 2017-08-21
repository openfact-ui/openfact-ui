import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserScope {

    public user: Observable<string>;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router) {
        this.user = this.router.events
            .filter((event) => event instanceof NavigationEnd)
            .map(() => this.activatedRoute)
            .map(
            (route) => {
                while (route.firstChild) { route = route.firstChild; }
                return route;
            })
            .filter((route) => route.outlet === 'primary')
            .mergeMap((route) => route.params)
            .map((params) => this.getUser(params))
            .filter((n) => n)
            .distinctUntilChanged();
    }

    protected getUser(params) {
        return params['user'] || this.getRouteParams('user');
    }

    protected getRouteParams(key): any {
        if (
            this.router &&
            this.router.routerState &&
            this.router.routerState.snapshot &&
            this.router.routerState.snapshot.root
        ) {
            return this.findParamsFor(this.router.routerState.snapshot.root, key);
        }
        return null;
    }

    protected findParamsFor(route, key): any {
        let children = route.children;
        for (let child of children) {
            let params = child.params;
            if (params) {
                let answer = params[key];
                if (!answer) {
                    answer = this.findParamsFor(child, key);
                }
                if (answer) {
                    return answer;
                }
            }
        }
        return null;
    }

    currentUser() {
        return this.findParamsFor(this.router.routerState.snapshot.root, 'user');
    }
}
