import { RoleFilterCustomRange } from './role-filter-custom-value';
/**
 * An object containing properties for a sortable field, used to select categories of sorting
 */
export class RoleFilterField {
  /**
   * A unique Id for the sort field
   */
  id?: string;

  /**
   * Value of the selected field
   */
  value: string;

  /**
   * The title to display for the sort field
   */
  title?: string;
}
