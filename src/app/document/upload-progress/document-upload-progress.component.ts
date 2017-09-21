import { Observable, Subscription } from 'rxjs';
import { UploadFile } from 'ngx-uploader';
import { AuthenticationService } from 'ngo-login-client';
import { SYNC_API_URL } from 'ngo-openfact-sync';
import { OnInit, Component, Input, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { UploadDocumentService } from '../../shared/upload-document.service';

@Component({
    selector: 'ofs-document-upload-progress',
    templateUrl: './document-upload-progress.component.html',
    styleUrls: ['./document-upload-progress.component.scss'],
})
export class DocumentUploadProgressComponent implements OnInit, OnDestroy {

    public isMinimized = true;
    public isClosed = true;

    public files: Observable<UploadFile>[] = [];

    private subscriptions: Subscription[] = [];

    constructor(private uploadedDocuments: UploadDocumentService) { }

    public ngOnInit() {
        this.subscriptions.push(this.uploadedDocuments.files.subscribe((files) => {
            if (files && files.length > 0) {
                this.isMinimized = this.isClosed = false;
            }
            this.files = files;
        }))
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => {
            sub.unsubscribe();
        });
    }

}
