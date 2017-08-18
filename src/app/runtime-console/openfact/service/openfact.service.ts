import { Observable } from 'rxjs/Observable';

import { Restangular } from 'ngx-restangular';

import { RESTService } from '../../store/entity/rest.service';
import { OpenfactResource } from '../model/openfactresource.model';
import { WatcherFactory } from './watcher-factory.service';

export abstract class OpenfactService<T extends OpenfactResource, L extends Array<T>>
    extends RESTService<T, L> {

    constructor(
        openfactRestangular: Restangular,
        public watcherFactory: WatcherFactory,
    ) {
        super(openfactRestangular);
    }

    /**
     * Creates a watcher that can watch for events
     * @param queryParams
     */
    public watch(queryParams: any = null) {
        let poller = () => this.list(queryParams);
        return this.watcherFactory.newInstance(() => this.serviceUrl, queryParams, poller);
    }

    public get(id: string): Observable<T> {
        return super.get(id);
    }

    public create(obj: T): Observable<T> {
        let resource = obj.resource || {};
        if (!resource.kind) {
            resource.kind = obj.defaultKind();
        }
        obj.updateResource(resource);
        console.log('Creating resource with value ' + JSON.stringify(resource, null, '  '));

        return this.restangularService.all(this.serviceUrl).post(resource);
    }

    public update(obj: T): Observable<T> {
        let resource = obj.resource;
        obj.updateResource(resource);
        return this.updateResource(obj, resource);
    }

    public updateResource(obj: T, resource: any) {
        let id = obj.id;
        console.log('Updating key ' + id + ' with value ' + JSON.stringify(resource, null, '  '));
        let resty: any = obj;
        return resty.customPUT(resource);
    }

    public delete(obj: T): any {
        let resty: any = obj;
        return resty.customDELETE();
    }

    public defaultKind() {
        return 'Service';
    }

    abstract get serviceUrl(): string;
}
