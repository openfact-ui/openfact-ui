import { Profile } from 'ngo-login-client';

export class ExtProfile extends Profile {
    public contextInformation: any;
    public registrationCompleted: boolean;
    public refreshToken: string;
}
