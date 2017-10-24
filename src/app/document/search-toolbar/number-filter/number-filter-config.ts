import { NumberCustomRange } from './number-filter-custom-value';
import { NumberFilterField } from './number-filter-field';

/**
 * A config containing properties for sort
 */
export class NumberFilterConfig {

  /**
   * A list of sortable fields
   */
  fields: NumberFilterField[];

  /**
   * True if sort should be shown
   */
  visible?: boolean;
}
