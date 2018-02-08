import { Team } from './team';
import { User } from '../../ngx-login-client';

export interface Space {
  name: string;
  path: String;
  privateSpace?: boolean;
  teams: Team[];
  defaultTeam: Team;
  id: string;
  attributes: SpaceAttributes;
  type: string;
  links: SpaceLink;
  relationships: SpaceRelationships;
  relationalData?: RelationalData;
}

export class SpaceLink {
  self: string;
  filters?: string;
  workitemlinktypes?: string;
  workitemtypes?: string;
}

export class SpaceRelationships {
  collaborators: SpaceRelatedLink;
  ownedBy: SpaceOwner[];
}

export class SpaceOwner {
  data: {
    id: string;
    type: string;
  };
}

export class SpaceRelatedLink {
  links: {
    related: string
  };
}

export class SpaceAttributes {
  assignedId: string;
  name: string;
  description: string;
  updatedAt: string;
  createdAt: string;
  version: number;
}

export class RelationalData {
  owners?: User[];
}
