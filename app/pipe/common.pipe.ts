import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'common'
})
export class CommonPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (args[0].type == 'nl2br') {
      return value.replace(/(?:\r\n|\r|\n)/g, '<br />');
    } else if (args[0].type == 'timestamp') {
      return Math.floor(new Date(value).getTime());
    } else if (args[0].type == 'phoneNumber') {
      if (value) {
				if (value.length == 10) {
					value = value.substring(0,3) + '-' + value.substring(3,6) + '-' + value.substring(value.length-4, value.length);
				} else {
					value = value.substring(0,3) + '-' + value.substring(3,7) + '-' + value.substring(value.length-4, value.length);
				}
			} else {
				value = '';
			}
      return value;
    } else if (args[0].type == 'emailId') {
      let id = value.split('@');
      return id[0];
    } else if (args[0].type == 'profileChange') {
      if (value) {
        return value.replace('/images/avatars/avatar-unknown.jpg', 'assets/icon/profile-none.jpg');
      } else {
        return 'assets/icon/profile-none.jpg';
      }
    } else if (args[0].type == 'screenTagSelect') {
      return value.findIndex((r: any) => { return r == args[0].data });
    } else if (args[0].type == 'rating') {
      let result: any = '';
      if (value) {
        let arr = value.split(',');
        const score = arr.reduce((sum: any, value: any) => {
          return parseInt(sum) + parseInt(value);
        });
        result = (score / arr.length).toFixed(1);
      }
      return result;
    } else {
      return null;
    }
  }

}
