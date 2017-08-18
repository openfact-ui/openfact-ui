import { BaseEntity } from '../../store/entity/entity.model';
import { currentOAuthConfig } from '../store/oauth-config-store';

export class OpenfactResource implements BaseEntity {
    public id: string;
    public name: string;
    public version: string;
    public description: string;
    public icon: string;
    public labels: Map<string, string> = new Map<string, string>();
    public annotations: Map<string, string> = new Map<string, string>();
    public resource: any;
    public creationTimestamp: any;

    public setResource(resource) {
        this.resource = resource || {};
        this.updateValuesFromResource();
        return this;
    }

    public updateResource(resource) {
        if (!this.labels) {
            this.labels = new Map<string, string>();
        }
        if (!this.annotations) {
            this.annotations = new Map<string, string>();
        }
        this.annotations['description'] = this.description;

        let metadata = resource.metadata;
        if (!metadata) {
            metadata = {};
            resource.metadata = metadata;
        }
        if (this.name) {
            metadata.name = this.name;
        }
        metadata.labels = this.labels;
        metadata.annotations = this.annotations;
    }

    public updateValuesFromResource() {
        let resource = this.resource || {};
        let metadata = resource.metadata || {};
        this.name = metadata.name || '';
        this.id = this.name;
        this.creationTimestamp = metadata.creationTimestamp;
        this.labels = metadata.labels || new Map<string, string>();
        this.annotations = metadata.annotations || new Map<string, string>();
        this.version = this.labels['version'] || '';

        // for Replicas we need to also look in the spec.template.metadata.annotations
        let spec = resource.spec || {};
        let template = spec.template || {};
        let templateMetadata = template.metadata || {};
        let templateAnnotations = templateMetadata.annotations || new Map<string, string>();

        this.icon = this.annotations['fabric8.io/iconUrl']
            || templateAnnotations['fabric8.io/iconUrl']
            || this.defaultIconUrl();

        // TODO any other annotations we should look for?
        this.description = this.annotations['description']
            || templateAnnotations['description'] || '';
    }

    public defaultIconUrl() {
        return '/img/openfact.svg';
    }

    public defaultKind() {
        return 'Unknown';
    }
}
