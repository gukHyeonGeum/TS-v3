import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'year'
})
export class YearPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (!value) {
  		return;
  	} else {
  		switch(value){
				case 1:
					return '1년 이하';
				break;
				case 2:
					return '2-3년';
				break;
				case 3:
					return '4-5년';
				break;
				case 4:
					return '6-7년';
				break;
				case 5:
					return '8-9년';
        break;
        case 6:
					return '10년 이상';
				break;
			}
  	}
  }

}
