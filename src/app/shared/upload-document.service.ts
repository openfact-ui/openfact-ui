import { Headers } from '@angular/http';
import { CLARKSNUT_API_URL } from '../ngx-clarksnut';
import { AuthenticationService } from '../ngx-login-client';
import { UploadFile, UploadOutput, UploadInput } from 'ngx-uploader';
import { Injectable, Inject, EventEmitter } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class UploadDocumentService {

  private uploadFiles: UploadFile[] = [];
  private _files: BehaviorSubject<UploadFile[]> = new BehaviorSubject<UploadFile[]>([]);

  private _input: EventEmitter<UploadInput> = new EventEmitter<UploadInput>();

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private documentsUrl: string;

  constructor(
    private auth: AuthenticationService,
    @Inject(CLARKSNUT_API_URL) apiUrl: string) {
    this.documentsUrl = apiUrl + 'documents';

    this._input.subscribe(event => {
      if (event.type === 'removeAll') {
        this.uploadFiles = [];
        this._files.next(this.uploadFiles);
      }
    });
  }

  get files(): Observable<UploadFile[]> {
    return this._files;
  }

  get input(): EventEmitter<UploadInput> {
    return this._input;
  }

  output(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') { // when all files added in queue
      const event: UploadInput = {
        type: 'uploadAll',
        url: this.documentsUrl,
        method: 'POST',
        headers: {
          'Authorization': this.headers.get('Authorization')
        }
      };
      this._input.emit(event);
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
      this.uploadFiles.push(output.file);
      this._files.next(this.uploadFiles);
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      const index = this.uploadFiles.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.uploadFiles[index] = output.file;
      this._files.next(this.uploadFiles);
    } else if (output.type === 'removed') {
      this.uploadFiles = this.uploadFiles.filter((file: UploadFile) => file !== output.file);
      this._files.next(this.uploadFiles);
    }
  }

}
