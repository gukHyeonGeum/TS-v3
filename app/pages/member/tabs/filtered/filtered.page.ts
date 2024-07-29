import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonRefresher } from '@ionic/angular';
import { ProfileService } from 'src/app/service/profile.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { Router } from '@angular/router';
import { MemberService } from 'src/app/service/member.service';
import { VerifyService } from 'src/app/service/verify.service';
import { AlertService } from 'src/app/service/alert.service';
import { CommonService } from 'src/app/service/common.service';
import { UserService } from 'src/app/service/user.service';
import { FriendService } from 'src/app/service/friend.service';

@Component({
  selector: 'app-filtered',
  templateUrl: './filtered.page.html',
  styleUrls: ['./filtered.page.scss'],
})
export class FilteredPage implements OnInit {
  // @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonRefresher) refresher: IonRefresher;
  @ViewChild('lblBottomGuide', { read: ElementRef }) lblBottomGuide: ElementRef;

  private limit = 48;
  private offset = 0;
  private refreshChk: boolean = false;
  
  obj: any;
  me: any;
  lists: any;
  images = 'assets/icon/profile-none.jpg';

  constructor(
    public auth: AuthenticationService,
    public memberS: MemberService,
    public profileS: ProfileService,
    public verifyS: VerifyService,
    public alertS: AlertService,
    public commonS: CommonService,
    public userS: UserService,
    public friendS: FriendService,
    private router: Router
  ) {
    this.auth.getMe().then(me => {
      this.me = me;
    });
  }

  ngOnInit() {
    this.obj = this.router.getCurrentNavigation().extras.state?.obj;
    if (!this.obj) this.filter();
    this.commonS.setStorage('kr.co.teeshot.filter.is_filtered', true);
    this.getLists();
    this.auth.fbScreen('member_filter_list');
  }

  imgError(event: any) {
    event.target.src = this.images;
  }

  requestFriendship(i: number, state: number) {
    if (state == 0 || state == 2) {
      this.verifyS.isCertPhone().then(() => {
        this.verifyS.isProfile().then(() => {
          this.alertS.confirm({
            header: '알림',
            message: `${this.lists[i].username}님${state == 0 ? '께' : '의'}<br />친구 신청을 ${state == 0 ? '요청' : '수락'}하시겠습니까?`,
            okText: '확인',
            cancelText: '취소'
          }).then(value => {
            if (value) {
              if (state == 0) {
                this.auth.fbLog('action_event_add_friend');
                this.userS.setAddFriend({ id: this.lists[i].user_id }).then((resolve) => {
                  if (resolve) this.lists[i].is_friend = 1;
                });
              } else if (state == 2) {
                this.friendS.putAccept({ id: this.lists[i].user_id }).then(resolve => {
                  if (resolve) this.lists[i].is_friend = 3;
                });
              }
            }
          });
        });
      });
    }
  }

  profile(target: any) {
    let obj: any = {
      id: this.me.id,
      target
    }
    this.profileS.profileOpen(obj).then(modal => {
    });
  }

  doRefresh() {
    this.refreshChk = true;
    this.offset = 0;
    this.getLists();
  }

  filter() {
    this.commonS.setStorage('kr.co.teeshot.filter.is_filtered', false);
    this.router.navigateByUrl('/member/filter', { replaceUrl: true, state: { obj: this.obj } });
  }

  getLists() {
    // 조건 : 유료 회원 && 핸드폰 인증자 && 사진 있는 사람
    this.memberS.getFilterObservable(this.obj).subscribe(res => {
      if (res.success) {
        const data: any = res.data;
        this.lists = data;
        this.lblBottomGuide.nativeElement.style.display = 'block';
        
        if (this.refreshChk) {
          this.refresher.complete();
          this.refreshChk = false;
        }
      }
    }, e => {
      this.alertS.alert('오류', e.statusText);
    });
  }
}
