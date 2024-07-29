import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'score'
})
export class ScorePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (!value) {
  		return;
  	} else {
  		switch(value){
				case 2:
					return '싱글';
				break;
				case 3:
					return '80-90타';
				break;
				case 4:
					return '90-100타';
				break;
				case 5:
					return '100-110타';
				break;
				case 6:
					return '110타 이하';
        break;
        case 7:
					return '초보';
				break;
			}
  	}
  }

}
