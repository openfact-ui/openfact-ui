export interface Party {
  id: string;
  attributes: PartyAttributes;
  type: string;
}

export class PartyAttributes {
  name: string;
  assignedId: string;
}
