import { Headers } from '@angular/http';
import { SYNC_API_URL } from 'ngo-openfact-sync';
import { AuthenticationService } from 'ngo-login-client';
import { UploadFile, UploadOutput, UploadInput } from 'ngx-uploader';
import { Injectable, Inject, EventEmitter, Output } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class UploadDocumentService {

  public _files: BehaviorSubject<UploadFile>[] = [];
  public _filesSubject = new BehaviorSubject<Observable<UploadFile>[]>([]);

  private uploadOutputs: Observable<UploadOutput>[] = [];

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private documentsUrl: string;

  constructor(
    private auth: AuthenticationService,
    @Inject(SYNC_API_URL) apiUrl: string) {
    if (this.auth.getToken() != null) {
      this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
    this.documentsUrl = apiUrl + 'documents';
  }

  public attach(obs: Observable<UploadOutput>): Observable<UploadInput> {
    this.uploadOutputs.push(obs);

    return obs.switchMap((output) => {
      if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') { // 1
        let file = new BehaviorSubject<UploadFile>(output.file);
        this._files.push(file);
        this._filesSubject.next(this._files);
      } else if (output.type === 'allAddedToQueue') {
        return Observable.of({
          type: 'uploadAll',
          url: this.documentsUrl,
          method: 'POST',
          concurrency: 5,
          headers: {
            'Authorization': this.headers.get('Authorization')
          }
        } as UploadInput);
      } else if (output.type === 'uploading' && typeof output.file !== 'undefined') { // 3         
        const index = this._files
          .map(file => file.getValue())
          .findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
        this._files[index].next(output.file);
      }
      return Observable.of(null);
    });
  }

  get files(): Observable<Observable<UploadFile>[]> {
    return this._filesSubject.asObservable();
  }

}
