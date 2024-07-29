import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonRefresher } from '@ionic/angular';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ProfileService } from 'src/app/service/profile.service';
import { FriendService } from 'src/app/service/friend.service';
import { AlertService } from 'src/app/service/alert.service';
import { VerifyService } from 'src/app/service/verify.service';
import { BadgeService } from 'src/app/service/badge.service';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.page.html',
  styleUrls: ['./request.page.scss'],
})
export class RequestPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonRefresher) refresher: IonRefresher;

  private limit = 10;
  private offset = 0;
  private refreshChk: boolean = false;
  
  me: any;
  lists: any;
  images = 'assets/icon/profile-none.jpg';
  
  constructor(
    public auth: AuthenticationService,
    public profileS: ProfileService,
    public friendS: FriendService,
    public alertS: AlertService,
    public verifyS: VerifyService,
    public badgeS: BadgeService,
    public commonS: CommonService
  ) { 
    this.auth.getMe().then(me => {
      this.me = me;
    });

    this.getLists();
  }

  ngOnInit() {
    this.auth.fbScreen('friend_request_list');
  }

  getLists() {
    this.friendS.getReqLists({}, this.limit, this.offset)
    .subscribe(res => {
      if (res.success) {
        const data: any = res.data;
        if (this.offset) {
					this.lists = this.lists.concat(data);
					this.infiniteScroll.complete();

					if (data.length < this.limit) {
						this.infiniteScroll.disabled = true;
						this.offset = 0;
					}
				} else {
          this.lists = data;
          
		  		if (this.refreshChk) {
            this.refresher.complete();
            this.refreshChk = false;
          }

		  		if (this.lists.length >= this.limit) {
  					this.infiniteScroll.disabled = false;
  				} else {
  					this.infiniteScroll.disabled = true;
  				}
					
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

  accept(id: any, idx: any) {
    this.verifyS.isCertPhone().then(() => {
      this.verifyS.isProfile().then(() => {
        this.friendS.putAccept({ id }).then(resolve => {
          if (resolve) {
            this.lists.splice(idx, 1);
          }
        });
      }).catch(() => {});
    }).catch(() => {});
  }

  delete(id: any, idx: any) {
    this.friendS.putReqDelete({ id }).then(resolve => {
      if (resolve) {
        this.lists.splice(idx, 1);
      }
    });
  }
}
