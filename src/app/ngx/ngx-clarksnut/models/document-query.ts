export interface DocumentQuery {
  id: string;
  type: string;
  attributes: DocumentQueryAttributes;
}

export class DocumentQueryAttributes {
  filterText: string;
  role: string;

  types: string[];
  currencies: string[];
  tags: string[];
  spaces: string[];

  offset: number;
  limit: number;

  greaterThan: number;
  lessThan: number;

  before: Date;
  after: Date;

  starred: boolean;
  viewed: boolean;
  checked: boolean;
}
