import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cn-space-sidebar',
  templateUrl: './space-sidebar.component.html',
  styleUrls: ['./space-sidebar.component.scss']
})
export class SpaceSidebarComponent implements OnInit {

  @Input() shown = false;

  constructor() { }

  ngOnInit() {
  }

}
