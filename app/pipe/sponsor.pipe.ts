import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sponsor'
})
export class SponsorPipe implements PipeTransform {

  transform(value: any, ...args: any): any {
    if (args == 1) {
      switch(value) {
        case 1:
          return '그린피';
        case 2:
          return '그린피+카트비';
        case 3:
          return '라운드비용 일체(카트, 캐디비 포함)';
        default: return '';
      }
    } else if (args == 2) {
      switch(value) {
        case 1:
          return '패키지(카트, 캐디비 불포함)';
        case 2:
          return '패키지비용 일체(카트, 캐디피 포함)';
        case 3:
          return '패키지비용 일체(카트, 캐디피 포함)+항공권 포함';
        default: return '';
      }
    } else if (args == 3) {
      return '해외골프비용 일체';
    } else if (args == 4) {
      switch(value) {
        case 1:
          return '스크린 9홀';
        case 2:
          return '스크린 18홀';
        default: return '';
      }
    }
    
  }

}
