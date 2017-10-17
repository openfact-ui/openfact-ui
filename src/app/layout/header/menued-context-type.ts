import { MenuItem } from '../../models/menu-item';
import { ContextType } from 'ngo-openfact-sync';
export class MenuedContextType implements ContextType {
  public name: string;
  public icon: string;
  public menus: MenuItem[];
}
