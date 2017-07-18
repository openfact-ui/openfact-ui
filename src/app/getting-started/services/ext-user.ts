import { ExtProfile } from './ext-profile';
import { User } from 'ngo-login-client';

export class ExtUser extends User {
    public attributes: ExtProfile;
}
