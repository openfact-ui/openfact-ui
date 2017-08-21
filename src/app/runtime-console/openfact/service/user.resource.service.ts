import { WatcherFactory } from './watcher-factory.service';
import { Restangular } from 'ngx-restangular';
import { OpenfactService } from './openfact.service';
import { Subscription, Observable } from 'rxjs';
import { OpenfactResource } from '../model/openfactresource.model';
import { UserScope } from './user.scope';
import { Watcher } from './watcher';
import { pathJoin } from '../model/utils';

export abstract class UserResourceService<T extends OpenfactResource, L extends Array<T>>
    extends OpenfactService<T, L> {

    protected _serviceUrl: string;

    private userSubscription: Subscription;
    private _user: string;

    constructor(
        openfactRestangular: Restangular,
        private userScope: UserScope,
        private urlSuffix: string,
        watcherFactory: WatcherFactory,
        private urlPrefix: string = '/api/v1/users/',
    ) {
        super(openfactRestangular, watcherFactory);
        this.user = userScope.currentUser();

        if (this.userScope) {
            this.userSubscription = this.userScope.user.subscribe(
                (user) => {
                    this.user = user;
                }
            );
        }
    }


    /**
     * Creates a watcher that can watch for events
     * @param queryParams
     */
    watchNamepace(user: string, queryParams: any = null) {
        if (user) {
            let listFactory = () => this.list(user, queryParams);
            return this.watcherFactory.newInstance(() => this.serviceUrlForUser(user), queryParams, listFactory);
        }
        return this.watch(queryParams);
    }



    get user(): string {
        return this._user;
    }

    set user(user: string) {
        if (user && user != this._user) {
            this._user = user;
            this._serviceUrl = null;
            this.onUserChanged();
        }
    }

    get(id: string, user: string = null): Observable<T> {
        let url = user ? this.serviceUrlForUser(user) : this.serviceUrl;
        return this.restangularService.one(url, id).get();
    }

    list(user: string = null, queryParams: any = null): Observable<L> {
        let url = user ? this.serviceUrlForUser(user) : this.serviceUrl;
        if (!url) {
            return Observable.empty();
        }
        return this.restangularService.all(url).getList(queryParams);
    }


    create(obj: T, user: string = null): Observable<T> {
        let url = this.urlForObject(obj, user);
        let resource = obj.resource || {};
        if (!resource.kind) {
            resource.kind = obj.defaultKind();
        }
        obj.updateResource(resource);
        console.log('Creating resource with value ' + JSON.stringify(resource, null, '  '));

        return this.restangularService.all(url).post(resource);
    }

    delete(obj: T): any {
        let url = this.urlForObject(obj);
        let id = obj.name;
        if (id) {
            return this.restangularService.one(url, id).remove();
        } else {
            return super.delete(obj);
        }
    }

    protected urlForObject(obj: T, user: string = '') {
        if (!user) {
            user = obj.id;
        }
        let url = user ? this.serviceUrlForUser(user) : this.serviceUrl;
        return url;
    }

    /**
     * Returns the service URL to use for the current user scope
     */
    get serviceUrl(): string {
        if (!this._serviceUrl) {
            this._serviceUrl = this.serviceUrlForUser(this.user);
        }
        return this._serviceUrl;
    }

    /**
     * Returns the base URL to use for the given user
     */
    protected serviceUrlForUser(user: string) {
        return this.createServiceUrl(this.urlPrefix, user, this.urlSuffix);
    }

    protected createServiceUrl(urlPrefix: string, user: string, urlSuffix: string): string {
        if (user) {
            let url = pathJoin(urlPrefix, user, urlSuffix);
            // console.log('setting url to: ' + url);
            return url;
        }
        return '';
    }


    // TODO
    ngOnDestroy() {
        this.userSubscription.unsubscribe();
    }

    protected onUserChanged() {

    }
}
