import { User } from './../../ngx-login-client/user/user';
import { Space } from './space';

export interface RequestAccessToSpace {
  id: string;
  type: string;
  attributes: RequestAccessToSpaceAttributes;
  relationalData?: RequestAccessRelationalData;
}

export class RequestAccessToSpaceAttributes {
  user: string;
  space: string;
  status: string;
  scope: string;
  message: string;
}

export class RequestAccessRelationalData {
  spaceRequested?: Space;
  createdBy?: User;
}
