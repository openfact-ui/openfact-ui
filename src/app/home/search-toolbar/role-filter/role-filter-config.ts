import { RoleFilterField } from './role-filter-field';

/**
 * A config containing properties for sort
 */
export class RoleFilterConfig {

  /**
   * A list of sortable fields
   */
  fields: RoleFilterField[];

  /**
   * True if sort should be shown
   */
  visible?: boolean;
}
