import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { User } from '../../../model/user.model';

@Component({
  selector: 'openfact-user-edit-toolbar',
  templateUrl: './edit-toolbar.user.component.html',
  styleUrls: ['./edit-toolbar.user.component.scss'],
})
export class UserEditToolbarComponent {

  @Input() user: User;

  constructor(private userService: UserService, private router: Router) {
  }

  save() {
    // let resource = this.yamlEditor.parseYaml();
    // this.userService.updateResource(this.user, resource).subscribe(
    //   () => this.router.navigate(['namespaces']),
    // );
  }
}
