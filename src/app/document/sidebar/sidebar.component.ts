import { Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  encapsulation: ViewEncapsulation.None, // For make patternfly sidebar works
  selector: 'ofs-document-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnDestroy, OnInit {

  constructor() {
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

}
