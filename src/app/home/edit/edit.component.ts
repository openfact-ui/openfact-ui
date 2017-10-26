import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ofs-edit',
  templateUrl: 'edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnDestroy, OnInit {

  constructor() {
  }

  public ngOnInit() {

  }

  public ngOnDestroy(): void {
  }

}
