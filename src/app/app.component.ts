import { ActivatedRoute, Router } from '@angular/router';

import { AboutService } from './shared/about.service';
import { Component } from '@angular/core';

@Component({
  selector: 'ofs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ofs';

  constructor(
    private activatedRoute: ActivatedRoute,
    private about: AboutService
  ) { }

  nOnInit() {
    console.log('Welcome to Fabric8!');
    console.log('This is', this.about.buildVersion, '(Build', '#' + this.about.buildNumber, 'and was built on', this.about.buildTimestamp, ')');
    this.activatedRoute.params.subscribe(() => {
      //this.loginService.login();
    });
  }
}
