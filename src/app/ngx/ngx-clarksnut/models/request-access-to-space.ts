export interface RequestAccessToSpace {
  id: string;
  type: string;
  attributes: RequestAccessToSpaceAttributes;
}

export class RequestAccessToSpaceAttributes {
  status: string;
  scope: string;
  message: string;
}
