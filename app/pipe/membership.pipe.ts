import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'membership'
})
export class MembershipPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
