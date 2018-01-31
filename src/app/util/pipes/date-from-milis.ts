import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFromMilis',
  pure: false
})
export class DateFromMilisPipe implements PipeTransform {
  transform(milis: number): any {
    return new Date(milis);
  }
}
