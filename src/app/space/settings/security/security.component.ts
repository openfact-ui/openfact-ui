import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'cn-security',
  templateUrl: 'security.component.html'
})
export class SecurityComponent implements OnInit {

  constructor(
    private router: Router) {
  }

  ngOnInit() {

  }

}
