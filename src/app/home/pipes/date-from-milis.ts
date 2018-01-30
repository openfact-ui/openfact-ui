import { Pipe, PipeTransform } from '@angular/core';
import { Space } from './../../ngx-clarksnut';

@Pipe({
  name: 'dateFromMilis',
  pure: false
})
export class DateFromMilisPipe implements PipeTransform {
  transform(milis: number): any {
    return new Date(milis);
  }
}
