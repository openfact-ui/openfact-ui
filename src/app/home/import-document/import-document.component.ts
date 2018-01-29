import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { UploaderOptions } from 'ngx-uploader';
import { UploadDocumentService } from '../../shared/upload-document.service';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'cn-import-document',
  templateUrl: './import-document.component.html',
  styleUrls: ['./import-document.component.scss']
})
export class ImportDocumentComponent implements OnInit, OnDestroy {

  @ViewChild('fileInput') fileInput: ElementRef;

  uploadOptions: UploaderOptions = { concurrency: 3 };

  constructor(private uploadDocumentService: UploadDocumentService) {

  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  open() {
    this.fileInput.nativeElement.click();
  }

}
