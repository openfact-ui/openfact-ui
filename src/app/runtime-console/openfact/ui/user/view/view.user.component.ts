import { Input, Component } from "@angular/core";
import { User } from "../../../model/user.model";

@Component({
  selector: 'openfact-user-view',
  templateUrl: './view.user.component.html',
})
export class UserViewComponent {

  @Input() user: User;
}
