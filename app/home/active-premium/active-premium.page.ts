import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-active-premium',
  templateUrl: './active-premium.page.html',
  styleUrls: ['./active-premium.page.scss'],
})
export class ActivePremiumPage implements OnInit {

  private observable$: any;

  title: string = '활동내역(프리미엄)';
  inviteCnt: any;
  requestCnt: any;

  constructor(
    public router: Router,
    public commonS: CommonService
  ) { 
    this.observable$ = this.commonS.badge$.subscribe((count: any) => {
      this.inviteCnt = count.premium;
      this.requestCnt = count.premiumRsvp;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.observable$.unsubscribe();
  }

}
