import { Headers } from '@angular/http';
import { CLARKSNUT_API_URL } from '../ngx/ngx-clarksnut';
import { AuthenticationService } from '../ngx/ngx-login-client';
import { UploadFile, UploadOutput, UploadInput } from 'ngx-uploader';
import { Injectable, Inject, EventEmitter } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { KeycloakService } from '../keycloak-service/keycloak.service';

@Injectable()
export class UploadDocumentService {

  private uploadFiles: UploadFile[] = [];
  private _files: BehaviorSubject<UploadFile[]> = new BehaviorSubject<UploadFile[]>([]);

  private _input: EventEmitter<UploadInput> = new EventEmitter<UploadInput>();

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private documentsUrl: string;

  constructor(
    private auth: AuthenticationService,
    private keycloakService: KeycloakService,
    @Inject(CLARKSNUT_API_URL) apiUrl: string) {
    this.documentsUrl = apiUrl.endsWith('/') ? apiUrl + 'documents' : apiUrl + '/documents';

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
      const tokenPromise: Promise<string> = this.keycloakService.getToken();
      const tokenObservable: Observable<string> = Observable.fromPromise(tokenPromise);

      tokenObservable.subscribe(token => {
        const event: UploadInput = {
          type: 'uploadAll',
          url: this.documentsUrl,
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        };
        this._input.emit(event);
      });


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
