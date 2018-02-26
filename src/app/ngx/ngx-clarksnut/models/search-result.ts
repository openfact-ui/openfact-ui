export interface SearchResult<T> {
  totalResults: number;
  data: T[];
  facets: any;
}
