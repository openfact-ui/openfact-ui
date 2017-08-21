import { Input, Component } from '@angular/core';
import { User } from '../../../model/user.model';

@Component({
  selector: 'openfact-user-edit',
  templateUrl: './edit.user.component.html',
})
export class UserEditComponent {

  @Input() user: User;

}
