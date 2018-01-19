import { Component, OnInit } from '@angular/core';
import { Broadcaster } from '../ngx-base';

@Component({
  selector: 'cn-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  constructor(private broadcaster: Broadcaster) {
  }

  ngOnInit() {

  }

}
