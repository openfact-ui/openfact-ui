import { DateFilterCustomRange } from './date-filter-custom-value';
import { DateFilterField } from './date-filter-field';

/**
 * A config containing properties for sort
 */
export class DateFilterConfig {

  /**
   * A list of sortable fields
   */
  fields: DateFilterField[];

  /**
   * True if sort should be shown
   */
  visible?: boolean;
}
