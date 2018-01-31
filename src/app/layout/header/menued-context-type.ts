import { MenuItem } from '../../models/menu-item';
import { ContextType } from '../../ngx/ngx-clarksnut';
export class MenuedContextType implements ContextType {
  public name: string;
  public icon: string;
  public menus: MenuItem[];
}
