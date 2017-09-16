import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'ofs-analyze',
  templateUrl: 'analyze.component.html'
})
export class AnalyzeComponent implements OnInit {

  constructor(
    private router: Router) {
  }

  public ngOnInit() {

  }

}
