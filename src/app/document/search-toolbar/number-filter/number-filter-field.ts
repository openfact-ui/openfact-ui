import { NumberFilterValue } from './number-filter-value';
/**
 * An object containing properties for a sortable field, used to select categories of sorting
 */
export class NumberFilterField {
  /**
   * A unique Id for the sort field
   */
  id?: string;

  /**
   * Value of the selected field
   */
  value: NumberFilterValue;

  /**
   * The title to display for the sort field
   */
  title?: string;
}
