import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'cn-profile',
  templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnInit {

  constructor(private router: Router) {
  }

  public ngOnInit() {

  }

}
