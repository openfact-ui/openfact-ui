import { Space } from '../ngx/ngx-clarksnut';

export class SearchEvent {
  keyword?: string;
  offset?: number;
  limit?: number;
  spaces?: Space[];
}
