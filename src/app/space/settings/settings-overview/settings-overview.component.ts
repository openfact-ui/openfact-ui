import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'cn-settings-overview',
  templateUrl: 'settings-overview.component.html'
})
export class SettingsOverviewComponent implements OnInit {

  constructor(
    private router: Router) {
  }

  ngOnInit() {

  }

}
