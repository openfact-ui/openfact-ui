import { Entity } from './entity';
import { Profile } from './profile';

export class User implements Entity {
  id: string;
  type: string;
  attributes: Profile;
  links?: {
    self: string;
  };
}
