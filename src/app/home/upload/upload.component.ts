import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ofs-upload',
  templateUrl: 'upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnDestroy, OnInit {

  constructor() {
  }

  public ngOnInit() {
  }

  public ngOnDestroy(): void {
  }

}
