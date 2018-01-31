import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { UploadFile, UploadStatus } from 'ngx-uploader';
import { AuthenticationService } from '../../ngx/ngx-login-client';
import { CLARKSNUT_API_URL } from '../../ngx/ngx-clarksnut';
import { OnInit, Component, Input, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { UploadDocumentService } from '../../shared/upload-document.service';

@Component({
  selector: 'cn-document-upload-progress',
  templateUrl: './document-upload-progress.component.html',
  styleUrls: ['./document-upload-progress.component.scss'],
})
export class DocumentUploadProgressComponent implements OnInit, OnDestroy {

  isMinimized: boolean = false;
  isClosed: boolean = true;

  isUploading: boolean = false;
  totalUploading: number = 0;

  files: UploadFile[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private uploadDocumentService: UploadDocumentService) {
    this.subscriptions.push(this.uploadDocumentService.files.subscribe((files) => {
      this.files = files;
      if (files && files.length > 0) {
        this.isClosed = false;
      }

      let isUploading = false;
      let totalUploading = 0;
      files.forEach(f => {
        if (f.progress.data.percentage !== 100) {
          isUploading = true;
          totalUploading++;
        }
      });
      this.isUploading = isUploading;
      this.totalUploading = totalUploading;
    }))
  }

  ngOnInit() {

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  changeMinimize() {
    this.isMinimized = !this.isMinimized;
  }

  close() {
    this.isClosed = true;
    this.uploadDocumentService.input.emit({ type: 'removeAll' });
  }

  edit(file: UploadFile) {
    if (file.response && file.response.data) {
      this.router.navigate(['/_inbox', file.response.data.id]);
    }
  }

}
