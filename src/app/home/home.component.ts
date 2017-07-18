import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'alm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  public ngOnInit() {
    console.log('Home works!');
  }

}
