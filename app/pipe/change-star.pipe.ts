import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'changeStar'
})
export class ChangeStarPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (!value) {
      return;
    } else {
      let arr = value.split('@');
      let substr = arr[0].substr(0, arr[0].length-2);
      if (arr.length == 2) {
        return substr + '**@' + arr[1];
      } else {
        return substr;
      }
    }
  }

}
