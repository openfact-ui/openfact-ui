import {Injectable} from '@angular/core';

@Injectable()
export class BrandingService {
  private isOpenfact: boolean;
  private _logo: string;
  private _backgroundClass: string;
  private _description: string;
  private _name: string;
  private _moreInfoLink: string;

  constructor() {
    this.isOpenfact = true;

    if (this.isOpenfact) {
      this._logo = 'openfact_logo';
      // replace background image with fabric8 background once available
      this._backgroundClass = 'home-openfact-background-image';
      this._description = 'A free, end-to-end, cloud-native development experience.';
      this._name = 'openfact.io';
      this._moreInfoLink = 'https://openfact.io/';
    } else {
      // default openshift.io branding
    }
  }

  get name(): string {
    return this._name;
  }

  get logo(): string {
    return this._logo;
  }

  get backgroundClass(): string {
    return this._backgroundClass;
  }

  get description(): string {
    return this._description;
  }

  get moreInfoLink(): string {
    return this._moreInfoLink;
  }

}
