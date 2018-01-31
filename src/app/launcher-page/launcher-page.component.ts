import { Component, OnInit } from '@angular/core';
import { Broadcaster } from '../ngx/ngx-base';

@Component({
  selector: 'cn-launcher-page',
  templateUrl: './launcher-page.component.html',
  styleUrls: ['./launcher-page.component.scss']
})
export class LauncherPageComponent implements OnInit {

  constructor(private broadcaster: Broadcaster) {
  }

  ngOnInit() {

  }

}
