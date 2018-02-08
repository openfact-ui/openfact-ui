import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapValues'
})
export class MapValuesPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    console.log(Array.from(value));
    return Array.from(value);
  }

}
