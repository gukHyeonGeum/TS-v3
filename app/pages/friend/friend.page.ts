import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.page.html',
  styleUrls: ['./friend.page.scss'],
})
export class FriendPage implements OnInit {

  title: string = '친구요청';
  requestCnt: any;
  friendCnt: any;

  observable: any;

  constructor(
    public router: Router,
    public commonS: CommonService
  ) { 
  }

  ngOnInit() {
    this.observable = this.commonS.badge$.subscribe(data => {
      let badge: any = data;
      this.requestCnt = badge.newInvite;
      this.friendCnt = badge.friendCnt;
    });

    this.commonS.selectedIndex$.next(1);
  }

  ngOnDestroy() {
    this.observable.unsubscribe();
  }
  

  change() {
    if (this.router.url == '/friend/list') {
      this.title = '친구목록';
    } else {
      this.title = '친구요청';
    }
  }

}
