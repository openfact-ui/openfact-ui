import {Component, Input} from '@angular/core';
import {User} from '../../../model/user.model';

@Component({
  selector: 'openfact-user-view-toolbar',
  templateUrl: './view-toolbar.user.component.html',
  styleUrls: ['./view-toolbar.user.component.scss'],
})
export class UserViewToolbarComponent {

  @Input() user: User;

}
