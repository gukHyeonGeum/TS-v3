import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (!value) {
  		return;
  	} else {
  		if (value == 'male') {
				return '남';
			} else if (value == 'female') {
				return '여';
  		} else {
  			return '-';
  		}
  	}
  }

}
