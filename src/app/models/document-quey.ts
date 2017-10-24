export class DocumentQuery {

  private filterText: string;
  private role: string;
  private before: string;
  private after: string;
  private greaterThan: string;
  private lessThan: string;
  private types: string;
  private currencies: string;
  private tags: string;
  private spaces: string;

  private _query: string[] = [];

  constructor(builder: DocumentQueryBuilder) {
    if (builder.getFilterText()) {
      this._query.push('filterText:' + builder.getFilterText());
    }
    if (builder.getRole()) {
      this._query.push('role:' + builder.getRole());
    }
    if (builder.getBefore()) {
      this._query.push('before:' + this.toFormattedDate(builder.getBefore()));
    }
    if (builder.getAfter()) {
      this._query.push('after:' + this.toFormattedDate(builder.getAfter()));
    }
    if (builder.getGreaterThan()) {
      this._query.push('greaterThan:' + builder.getGreaterThan());
    }
    if (builder.getLessThan()) {
      this._query.push('lessThan:' + builder.getLessThan());
    }
    if (builder.getTypes()) {
      this._query.push('types:' + builder.getTypes());
    }
    if (builder.getCurrencies()) {
      this._query.push('currencies:' + builder.getCurrencies());
    }
    if (builder.getTags()) {
      this._query.push('tags:' + builder.getTags());
    }
    if (builder.getSpaces()) {
      this._query.push('spaces:' + builder.getSpaces());
    }
  }

  query(): string {
    return this._query.join(', ');
  }

  static builder(): DocumentQueryBuilder {
    return new DocumentQueryBuilder();
  }

  private toFormattedDate(date: Date): string {
    return date.getFullYear() + '-' + (date.getMonth() - 1) + '-' + date.getDate();
  }

}

export class DocumentQueryBuilder {
  private _filterText: string;
  private _role: string;
  private _before: Date;
  private _after: Date;
  private _greaterThan: number;
  private _lessThan: number;

  private _types: string[];
  private _currencies: string[];
  private _tags: string[];

  private _spaces: string[];

  build() {
    return new DocumentQuery(this);
  }

  getFilterText() {
    return this._filterText;
  }

  filterText(filterText: string): DocumentQueryBuilder {
    this._filterText = filterText;
    return this;
  }

  getRole() {
    return this._role;
  }

  role(role: string): DocumentQueryBuilder {
    this._role = role;
    return this;
  }

  getBefore() {
    return this._before;
  }

  before(before: Date): DocumentQueryBuilder {
    this._before = before;
    return this;
  }

  getAfter() {
    return this._after;
  }

  after(after: Date): DocumentQueryBuilder {
    this._after = after;
    return this;
  }

  getGreaterThan() {
    return this._greaterThan;
  }

  greaterThan(greaterThan: number): DocumentQueryBuilder {
    this._greaterThan = greaterThan;
    return this;
  }

  getLessThan() {
    return this._lessThan;
  }

  lessThan(lessThan: number): DocumentQueryBuilder {
    this._lessThan = lessThan;
    return this;
  }

  getTypes() {
    return this._types;
  }

  types(types: string[]): DocumentQueryBuilder {
    this._types = types;
    return this;
  }

  getCurrencies() {
    return this._currencies;
  }

  currencies(currencies: string[]): DocumentQueryBuilder {
    this._currencies = currencies;
    return this;
  }

  getTags() {
    return this._tags;
  }

  tags(tags: string[]): DocumentQueryBuilder {
    this._tags = tags;
    return this;
  }

  getSpaces() {
    return this._spaces;
  }

  spaces(spaces: string[]): DocumentQueryBuilder {
    this._spaces = spaces;
    return this;
  }
}
