import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'betweenday'
})
export class BetweendayPipe implements PipeTransform {

  transform(value: any, ...args: any): any {

    const reggie = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
    const d = new Date();

    if (args == 'day') {
      if (value) {
        value = value.replace(/\//g, '-');
        let eArray: any = reggie.exec(value); 
        let e = new Date(eArray[1],(eArray[2])-1, eArray[3], eArray[4], eArray[5], eArray[6]);
        let day = Math.floor( ( e.getTime() - d.getTime() )/(1000*60*60*24) );

        return day;
      } else {
        return 0;
      }
    } else if (args == 'dayCount') {
      if (value) {
        value = value.replace(/\//g, '-');
        var eArray: any = reggie.exec(value); 
        var e = new Date(eArray[1],(eArray[2])-1, eArray[3], eArray[4], eArray[5], eArray[6]);
        var day = Math.floor( ( d.getTime() - e.getTime() )/(1000*60*60*24) );

        return day;
      } else {
        return 0;
      }
    }
  }

}
