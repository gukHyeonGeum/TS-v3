import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-active-golfjoin',
  templateUrl: './active-golfjoin.page.html',
  styleUrls: ['./active-golfjoin.page.scss'],
})
export class ActiveGolfjoinPage implements OnInit {

  private observable$: any;

  title: string = '활동내역(골프조인)';
  inviteCnt: any;
  requestCnt: any;  

  constructor(
    public router: Router,
    public commonS: CommonService
  ) { 
    this.observable$ = this.commonS.badge$.subscribe((count: any) => {
      this.inviteCnt = count.join;
      this.requestCnt = count.joinRsvp;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.observable$.unsubscribe();
  }

}
