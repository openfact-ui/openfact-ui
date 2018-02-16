import { Entity } from './entity';
import { Profile } from './profile';

export class User implements Entity {
  id: string;
  attributes: Profile;
  type: string;
  links?: {
    self: string;
  };
}
