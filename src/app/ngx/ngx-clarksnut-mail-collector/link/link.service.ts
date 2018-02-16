import { Injectable, Inject } from '@angular/core';
import { CLARKSNUT_MAIL_COLLECTOR_API_URL } from './../api/clarksnut-mail-collector-api';

@Injectable()
export class LinkService {

  private apiUrl: string;

  constructor(@Inject(CLARKSNUT_MAIL_COLLECTOR_API_URL) apiUrl: string) {
    this.apiUrl = apiUrl.endsWith('/') ? apiUrl + 'auth' : apiUrl + '/auth';
  }

  link(provider: string, next: string): void {
    const url = `${this.apiUrl}/broker/${provider}/link?redirect=${next}`;
    this.redirectToAuth(url);
  }

  authorizeOfflineAccess(next: string): void {
    const url = `${this.apiUrl}/authorize_batch?redirect=${next}`;
    this.redirectToAuth(url);
  }

  addManualBroker(provider: string, next: string): void {
    const url = `${this.apiUrl}/broker/${provider}/endpoint?redirect=${next}`;
    this.redirectToAuth(url);
  }

  private redirectToAuth(url) {
    window.location.href = url;
  }

}
