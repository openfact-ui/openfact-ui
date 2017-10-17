import { Subject, Subscription } from 'rxjs';
import { OnInit, Component, Input, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes } from 'ngx-uploader';
import { UploadDocumentService } from '../../shared/upload-document.service';

@Component({
    selector: 'ofs-document-wizard',
    templateUrl: './document-wizard.component.html',
    styleUrls: ['./document-wizard.component.scss'],
})
export class DocumentWizardComponent implements OnInit, OnDestroy {

    @Input() public label = 'Upload';
    @Input() public isButton = true;

    public uploadInput: EventEmitter<UploadInput> = new EventEmitter<UploadInput>();

    private uploadOutput = new Subject<UploadOutput>();
    private subscriptions: Subscription[] = [];

    constructor(private uploadedDocuments: UploadDocumentService) { }

    public ngOnInit() {
        this.subscriptions.push(
            this.uploadedDocuments.attach(this.uploadOutput)
                .distinctUntilChanged()
                .filter(event => event != null)
                .subscribe((event) => {
                    this.uploadInput.emit(event);
                })
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => {
            sub.unsubscribe();
        });
    }

    public onUploadOutput(output: UploadOutput): void {
        this.uploadOutput.next(output);
    }

    public cancelUpload(id: string): void {
        this.uploadInput.emit({ type: 'cancel', id: id });
    }

    public removeFile(id: string): void {
        this.uploadInput.emit({ type: 'remove', id: id });
    }

    public removeAllFiles(): void {
        this.uploadInput.emit({ type: 'removeAll' });
    }

}
