import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

interface MenuHiddenCallback {
  (headerComponent: HeaderComponent): Observable<boolean>;
}

@Component({
  selector: 'ofs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  get isGettingStartedPage(): boolean {
    return false;
  }

}
