import { AuthenticationService } from 'ngo-login-client';
import { SYNC_API_URL } from 'ngo-openfact-sync';
import { OnInit, Component, Input, EventEmitter, Inject } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes } from 'ngx-uploader';

@Component({
    selector: 'ofs-document-wizard',
    templateUrl: './document-wizard.component.html',
    styleUrls: ['./document-wizard.component.scss'],
})
export class DocumentWizardComponent implements OnInit {

    @Input() public label = 'Upload';
    @Input() public isButton = true;

    private headers = new Headers({ 'Content-Type': 'application/json' });
    private documentsUrl: string;

    public files: UploadFile[] = [];
    public uploadInput: EventEmitter<UploadInput> = new EventEmitter<UploadInput>();

    constructor(
        private auth: AuthenticationService,
        @Inject(SYNC_API_URL) apiUrl: string) {
        if (this.auth.getToken() != null) {
            this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
        }
        this.documentsUrl = apiUrl + 'documents';
    }

    public ngOnInit() {
    }

    public onUploadOutput(output: UploadOutput): void {
        if (output.type === 'allAddedToQueue') { // 2
            const event: UploadInput = {
                type: 'uploadAll',
                url: this.documentsUrl,
                method: 'POST',
                concurrency: 5,
                headers: {
                    'Authorization': this.headers.get('Authorization')
                }
            };
            this.uploadInput.emit(event);
        } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') { // 1
            this.files.push(output.file);
        } else if (output.type === 'uploading' && typeof output.file !== 'undefined') { // 3            
            // update current data in files array for uploading file
            const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
            this.files[index] = output.file;
        } else if (output.type === 'removed') {
            console.log('removed ', output);
        } else if (output.type === 'dragOver') {
            console.log('dragOver ', output);
        } else if (output.type === 'dragOut') {
            console.log('dragOut ', output);
        } else if (output.type === 'drop') {
            console.log('drop ', output);
        }
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
