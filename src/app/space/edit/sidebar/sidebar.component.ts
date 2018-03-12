import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cn-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input() collapsed: boolean;

  constructor() { }

  ngOnInit() {
  }

}
