import { Injectable } from '@angular/core';

@Injectable()
export class AboutService {

  get buildNumber(): string {
    return '47';
  }

  get buildTimestamp(): string {
    return new Date().toString();
  }

  get buildVersion(): string {
    return '1.0.0.Final';
  }

}
