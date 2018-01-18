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

  private offset: string;
  private limit: string;

  private starred: string;

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
    if (builder.getTypes() && builder.getTypes().length > 0) {
      this._query.push('types:' + builder.getTypes());
    }
    if (builder.getCurrencies() && builder.getCurrencies().length > 0) {
      this._query.push('currencies:' + builder.getCurrencies());
    }
    if (builder.getTags() && builder.getTags().length > 0) {
      this._query.push('tags:' + builder.getTags());
    }
    if (builder.getSpaces() && builder.getSpaces().length > 0) {
      this._query.push('spaces:' + builder.getSpaces());
    }
    if (builder.getOffset()) {
      this._query.push('offset:' + builder.getOffset());
    }
    if (builder.getLimit()) {
      this._query.push('limit:' + builder.getLimit());
    }
    if (builder.getOrderBy()) {
      this._query.push('orderBy:' + builder.getOrderBy());
    }
    if (builder.getAsc() !== undefined && builder.getAsc() !== null) {
      this._query.push('asc:' + builder.getAsc());
    }
    if (builder.getStarred() !== undefined && builder.getStarred() !== null) {
      this._query.push('starred:' + builder.getStarred());
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

  private _offset: number;
  private _limit: number;
  private _orderBy: string;
  private _asc: boolean;

  private _starred: boolean;

  build() {
    return new DocumentQuery(this);
  }

  query(q: string): DocumentQueryBuilder {
    let result: any = {};
    q.split(', ').forEach(function (x) {
      let arr = x.split(':');
      arr[1] && (result[arr[0]] = arr[1]);
    });

    if (Object.keys(result).length === 0 && result.constructor === Object) {
      return null;
    }

    if (result.filterText) {
      this.filterText(result.filterText);
    }
    if (result.role) {
      this.role(result.role);
    }
    if (result.before) {
      this.before(result.before);
    }
    if (result.after) {
      this.after(result.after);
    }
    if (result.greaterThan) {
      this.greaterThan(result.greaterThan);
    }
    if (result.lessThan) {
      this.lessThan(result.lessThan);
    }

    if (result.types) {
      this.types(result.types);
    }
    if (result.currencies) {
      this.currencies(result.currencies);
    }
    if (result.tags) {
      this.tags(result.tags);
    }

    if (result.spaces) {
      this.spaces(result.spaces);
    }

    if (result.offset) {
      this.offset(result.offset);
    }
    if (result.limit) {
      this.limit(result.limit);
    }
    if (result.orderBy) {
      this.orderBy(result.orderBy);
    }
    if (result.asc) {
      this.asc(result.asc);
    }
    if (result.starred) {
      this.starred(result.starred);
    }

    return this;
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

  getOffset() {
    return this._offset;
  }

  offset(offset: number): DocumentQueryBuilder {
    this._offset = offset;
    return this;
  }

  getLimit() {
    return this._limit;
  }

  limit(limit: number): DocumentQueryBuilder {
    this._limit = limit;
    return this;
  }

  getOrderBy() {
    return this._orderBy;
  }

  orderBy(orderBy: string): DocumentQueryBuilder {
    this._orderBy = orderBy;
    return this;
  }

  getAsc() {
    return this._asc;
  }

  asc(asc: boolean): DocumentQueryBuilder {
    this._asc = asc;
    return this;
  }

  getStarred() {
    return this._starred;
  }

  starred(starred: boolean): DocumentQueryBuilder {
    this._starred = starred;
    return this;
  }

}
