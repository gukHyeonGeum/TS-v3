import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pOption'
})
export class POptionPipe implements PipeTransform {

  transform(value: any, ...args: any): any {
    if (args == 2) {
      return '1박2일 골프(숙박&식사)';
    } else if (args == 3) {
      return '동반 해외골프(숙박&식사,항공)';
    } else if (args == 4) {
      switch(value) {
        case 1:
          return '스크린';
        case 2:
          return '스크린+식사(커피)';
        case 3:
          return '스크린+소주한잔';
        default: return '';
      }
    } else {
      switch(value) {
        case 1:
          return '라운드';
        case 2:
          return '라운드+식사(커피)';
        case 3:
          return '라운드+소주한잔';
        default: return '';
      }
    }
    
  }

}
