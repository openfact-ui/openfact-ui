import { Mail } from './../models/mail';
import { Injectable, Inject } from '@angular/core';
import { Headers, Http, URLSearchParams, RequestOptions, ResponseContentType, Response } from '@angular/http';
import { cloneDeep } from 'lodash';
import { Logger } from '../../ngx/ngx-base';
import { Observable } from 'rxjs';

import { CLARKSNUT_API_URL } from '../api/clarksnut-api';

@Injectable()
export class MailService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private mailUrl: string;

  constructor(
    private http: Http,
    private logger: Logger,
    @Inject(CLARKSNUT_API_URL) apiUrl: string) {
    this.mailUrl = apiUrl + 'mail';
  }

  sendMail(mail: Mail): Observable<Response> {
    let url = this.mailUrl;
    let payload = JSON.stringify({ data: mail });
    return this.http
      .post(url, payload, { headers: this.headers })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  private handleError(error: any) {
    this.logger.error(error);
    return Observable.throw(error.message || error);
  }

}
