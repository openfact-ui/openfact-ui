import { Injectable } from '@angular/core';
import { UserService } from '../service/user.service';
import { User, Users } from '../model/user.model';
import { OpenfactResourceStore } from './openfactresource.store';

@Injectable()
export class UserStore extends OpenfactResourceStore<User, Users, UserService> {
    constructor(userService: UserService) {
        super(userService, [], <User>{}, User);
    }


    protected get kind() {
        return 'User';
    }
}
