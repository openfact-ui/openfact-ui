import { OpenfactResource } from './openfactresource.model';

export class User extends OpenfactResource {

    public defaultKind() {
        return 'User';
    }

    public defaultIconUrl(): string {
        return '';
    }
}

export class Users extends Array<User>{

}
