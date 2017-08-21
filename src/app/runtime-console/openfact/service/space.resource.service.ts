import { WatcherFactory } from './watcher-factory.service';
import { Restangular } from 'ngx-restangular';
import { OpenfactService } from './openfact.service';
import { Subscription, Observable } from 'rxjs';
import { OpenfactResource } from '../model/openfactresource.model';
import { SpaceScope } from './space.scope';
import { Watcher } from './watcher';
import { pathJoin } from '../model/utils';

export abstract class SpaceResourceService<T extends OpenfactResource, L extends Array<T>>
    extends OpenfactService<T, L> {

    protected _serviceUrl: string;

    private spaceSubscription: Subscription;
    private _space: string;

    constructor(
        openfactRestangular: Restangular,
        private spaceScope: SpaceScope,
        private urlSuffix: string,
        watcherFactory: WatcherFactory,
        private urlPrefix: string = '/api/v1/spaces/',
    ) {
        super(openfactRestangular, watcherFactory);
        this.space = spaceScope.currentSpace();

        if (this.spaceScope) {
            this.spaceSubscription = this.spaceScope.space.subscribe(
                (space) => {
                    this.space = space;
                }
            );
        }
    }


    /**
     * Creates a watcher that can watch for events
     * @param queryParams
     */
    watchNamepace(space: string, queryParams: any = null) {
        if (space) {
            let listFactory = () => this.list(space, queryParams);
            return this.watcherFactory.newInstance(() => this.serviceUrlForSpace(space), queryParams, listFactory);
        }
        return this.watch(queryParams);
    }



    get space(): string {
        return this._space;
    }

    set space(space: string) {
        if (space && space != this._space) {
            this._space = space;
            this._serviceUrl = null;
            this.onSpaceChanged();
        }
    }

    get(id: string, space: string = null): Observable<T> {
        let url = space ? this.serviceUrlForSpace(space) : this.serviceUrl;
        return this.restangularService.one(url, id).get();
    }

    list(space: string = null, queryParams: any = null): Observable<L> {
        let url = space ? this.serviceUrlForSpace(space) : this.serviceUrl;
        if (!url) {
            return Observable.empty();
        }
        return this.restangularService.all(url).getList(queryParams);
    }


    create(obj: T, space: string = null): Observable<T> {
        let url = this.urlForObject(obj, space);
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

    protected urlForObject(obj: T, space: string = '') {
        if (!space) {
            space = obj.id;
        }
        let url = space ? this.serviceUrlForSpace(space) : this.serviceUrl;
        return url;
    }

    /**
     * Returns the service URL to use for the current space scope
     */
    get serviceUrl(): string {
        if (!this._serviceUrl) {
            this._serviceUrl = this.serviceUrlForSpace(this.space);
        }
        return this._serviceUrl;
    }

    /**
     * Returns the base URL to use for the given space
     */
    protected serviceUrlForSpace(space: string) {
        return this.createServiceUrl(this.urlPrefix, space, this.urlSuffix);
    }

    protected createServiceUrl(urlPrefix: string, space: string, urlSuffix: string): string {
        if (space) {
            let url = pathJoin(urlPrefix, space, urlSuffix);
            // console.log('setting url to: ' + url);
            return url;
        }
        return '';
    }


    // TODO
    ngOnDestroy() {
        this.spaceSubscription.unsubscribe();
    }

    protected onSpaceChanged() {

    }
}
