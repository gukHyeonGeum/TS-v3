import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'socialName'
})
export class SocialNamePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (!value) {
  		return;
  	} else {
  		switch(value){
				case 'naver':
					return '네이버';
				break;
				case 'kakao':
					return '카카오톡';
				break;
				case 'facebook':
					return '페이스북';
				break;
			}
  	}
  }

}
