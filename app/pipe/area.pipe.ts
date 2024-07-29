import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'area'
})
export class AreaPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
