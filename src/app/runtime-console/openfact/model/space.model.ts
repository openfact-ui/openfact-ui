import {OpenfactResource} from './openfactresource.model';

export class Space extends OpenfactResource {

  public defaultKind() {
    return 'Space';
  }

  public defaultIconUrl(): string {
    return '';
  }
}

export class Spaces extends Array<Space> {

}
