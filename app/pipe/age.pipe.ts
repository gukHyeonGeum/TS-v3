import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (!value) {
    	return;
    } else {
				var birth = value.split("-");
				var today = new Date();
				var year	= today.getFullYear()-1; 
				var month	= today.getMonth()+1;
				var day		= today.getDate();
				var ck		= parseInt(birth[0]);

				if(ck == 0) return "";

				var age = year - ck;

				if (month > parseInt(birth[1]) || (month === parseInt(birth[1]) && day > parseInt(birth[2]))) {
					age++;
				}

				return age;
    }
  }

}
