import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProfileService } from 'src/app/service/profile.service';
import { IonInfiniteScroll, IonRefresher } from '@ionic/angular';
import { MemberService } from 'src/app/service/member.service';
import { AlertService } from 'src/app/service/alert.service';
import { LoadingService } from 'src/app/service/loading.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CommonService } from 'src/app/service/common.service';
import { UserService } from 'src/app/service/user.service';
import { VerifyService } from 'src/app/service/verify.service';
import { FriendService } from 'src/app/service/friend.service';

@Component({
  selector: 'app-recommended',
  templateUrl: './recommended.page.html',
  styleUrls: ['./recommended.page.scss'],
})
export class RecommendedPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonRefresher) refresher: IonRefresher;
  @ViewChild('lblBottomGuide', { read: ElementRef }) lblBottomGuide: ElementRef;

  private limit = 48;
  private offset = 0;
  private refreshChk: boolean = false;

  me: any;
  lists: any;
  images = 'assets/icon/profile-none.jpg';

  constructor(
    public auth: AuthenticationService,
    public profileS: ProfileService,
    public memberS: MemberService,
    public alertS: AlertService,
    public loadingS: LoadingService,
    public commonS: CommonService,
    public userS: UserService,
    public friendS: FriendService,
    public verifyS: VerifyService
  ) { 
    this.auth.getMe().then(me => {
      this.me = me;
    }); 
  }

  ngOnInit() {
    this.getLists();

    this.auth.fbScreen('member_recommended_list');
  }

  requestFriendship(i: number, state: number) {
    if (state == 0 || state == 2) {
      this.verifyS.isCertPhone().then(() => {
        this.verifyS.isProfile().then(() => {
          this.alertS.confirm({
            header: '알림',
            message: `${this.lists[i].username}님${state == 0 ? '께' : '의'}<br />친구 신청을 ${state == 0 ? '' : '수락'}하시겠습니까?`,
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

  getLists() {
    this.memberS.getLists({ type: 'recommended'}, this.limit, this.offset)
    .subscribe(res => {
      if (res.success) {
        this.lists = res.data;
        this.lblBottomGuide.nativeElement.style.display = 'block';
        
        if (this.refreshChk) {
          this.refresher.complete();
          this.refreshChk = false;
        }

        if (this.lists.length >= this.limit) {
          this.infiniteScroll.disabled = false;
        } else {
          this.infiniteScroll.disabled = true;
        }
      } else {
        this.alertS.alert('오류', res.message);
      }
    }, e => {
      this.alertS.alert('오류', e.statusText);
    });
  }

  loadData() {
    this.offset = this.offset + this.limit;
    this.getLists();
  }

  doRefresh() {
    this.refreshChk = true;
    this.offset = 0;
    this.getLists();
  }

  imgError(event: any) {
    event.target.src = this.images;
  }  

  profile(target: any) {
    let obj: any = {
      id: this.me.id,
      target
    }
    this.profileS.profileOpen(obj).then(modal => {
    });
  }
}
