import { Subject, Subscription } from 'rxjs';
import { OnInit, Component, Input, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { UploaderOptions, UploadOutput, UploadInput, UploadFile, humanizeBytes } from 'ngx-uploader';
import { UploadDocumentService } from '../../shared/upload-document.service';

@Component({
  selector: 'ofs-document-wizard',
  templateUrl: './document-wizard.component.html',
  styleUrls: ['./document-wizard.component.scss'],
})
export class DocumentWizardComponent implements OnInit, OnDestroy {

  @Input() label = 'Upload';
  @Input() isButton = true;
  @Input() buttonType = 'primary';
  @Input() buttonSize = 'lg';

  uploadOptions: UploaderOptions = { concurrency: 3 };

  private subscriptions: Subscription[] = [];

  constructor(private uploadDocumentService: UploadDocumentService) { }

  ngOnInit() {

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

}
