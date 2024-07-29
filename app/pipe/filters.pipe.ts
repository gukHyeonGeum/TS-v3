import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filters'
})
export class FiltersPipe implements PipeTransform {

  transform(value: any, ...args: any): any {

    if (args == 'golf_type') {
      switch(value) {
				case 1:
					return '당일';
				case 2:
					return '패키지';
				case 3:
					return '해외';
				case 4:
          return '스크린';
        default:
          return '';
			}
    } else if (args == 'golf_code') {
      let code = value.substring(0,2);
      switch(code) {
				case '10':
					return '일본';
				case '11':
					return '중국';
				case '12':
					return '태국';
				case '13':
          return '베트남';
				case '14':
          return '필리핀';
				case '15':
          return '라오스';
				case '16':
          return '말레이시아';
				case '17':
          return '대만';
				case '18':
          return '미얀마';
				case '19':
          return '브루나이';
				case '20':
          return '인도네시아';
				case '21':
          return '괌';
				case '22':
          return '사이판';
				case '23':
          return '하와이';
        default:
          return '';
			}
    } else if (args == 'golf_gender') {
      switch(value) {
				case 1:
					return '여성';
				case 2:
					return '남성';
				case 3:
          return '무관';
        default: return '';
      }
    } else if (args == 'golf_join_partner') {
      switch(value) {
				case 1:
					return '조인 1명';
				case 2:
					return '조인 2명';
				case 3:
          return '조인 3명';
				case 10:
          return '부부&커플';
        default: return '';
      }
    } else if (args == 'golf_people') {
      switch(value) {
				case 1:
					return '신청 1명';
				case 2:
					return '신청 2명';
				case 3:
          return '부부커플';
        default: return '';
      }
    } else if (args == 'booking_people') {
      switch(value) {
				case 2:
					return '2인이상';
				case 3:
					return '3인이상';
				case 4:
          return '4인필수';
        default: return '';
      }
    } else if (args == 'companion_count') {
      switch(value) {
				case 1: 
					return { cnt: 1, sex: [], text: '' };
				case 2: 
					return { cnt: 2, sex: ['m'], text: '+남1명' };
				case 3: 
					return { cnt: 3, sex: ['m','m'], text: '+남2명' };
				case 4: 
					return { cnt: 2, sex: ['f'], text: '+여1명' };
				case 5: 
					return { cnt: 3, sex: ['f','f'], text: '+여2명' };
				case 6: 
					return { cnt: 3, sex: ['m','f'], text: '+남1여1' };
				case 7:
					return { cnt: 2, sex: ['hw'], text: '' };
				case 8: 
					return { cnt: 2, sex: ['hw'], text: '부부&커플' };
				default:
					return { cnt: 1, sex: [] };
      }
		} else if (args == 'screen_golf_partner') {
      switch(value) {
				case 1:
					return '남 1명';
				case 2:
					return '여 1명';
				case 3:
					return '무관 1명';
				case 4:
					return '남 2명';
				case 5:
					return '여 2명';
				case 6:
					return '무관 2명';
				case 7:
					return '커플';
				case 8:
					return '부부';
				case 9:
					return '3명 이상';
        default: return '';
      }
		} else if (args == 'screen_golf_sponsor') {
      switch(value) {
				case 1:
					return '이용료 초청자 부담';
				case 2:
					return '이용료 신청자 부담';
				case 3:
					return '이용료 1/N';
        default: return '';
      }
    }
    
  }

}
