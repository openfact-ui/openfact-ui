export interface DocumentQuery {
  id: string;
  type: string;
  attributes: DocumentQueryAttributes;
}

export class DocumentQueryAttributes {
  filterText: string;
  role: string;
  before: string;
  after: string;
  greaterThan: string;
  lessThan: string;
  types: string[];
  currencies: string[];
  tags: string[];
  spaces: string[];

  offset: number;
  limit: number;

  starred: string;
}
