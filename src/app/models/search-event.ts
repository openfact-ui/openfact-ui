import { Space } from '../ngx/ngx-clarksnut';

export class SearchEvent {
  keyword?: string;
  offset?: number;
  limit?: number;
  spaces?: Space[];

  type?: string[];
  currency?: string[];

  fromAmount?: number;
  toAmount?: number;

  fromIssueDate?: Date;
  toIssueDate?: Date;

  star?: boolean;
  view?: boolean;
  check?: boolean;
}
