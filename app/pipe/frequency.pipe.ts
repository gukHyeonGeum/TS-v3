import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'frequency'
})
export class FrequencyPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (!value) {
  		return;
  	} else {
  		switch(value){
				case 1:
					return '1회 이하';
				break;
				case 2:
					return '1-2회';
				break;
				case 3:
					return '2-3회';
				break;
				case 4:
					return '4-5회';
				break;
				case 5:
					return '6-7회';
        break;
        case 6:
					return '8-9회';
        break;
        case 7:
					return '10회 이상';
				break;
			}
  	}
  }

}
