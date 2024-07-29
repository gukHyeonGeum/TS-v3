import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, IonRefresher, PopoverController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ProfileService } from 'src/app/service/profile.service';
import { FriendService } from 'src/app/service/friend.service';
import { AlertService } from 'src/app/service/alert.service';

import { FListMoreComponent } from './f-list-more/f-list-more.component';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
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
    public popover: PopoverController,
    public commonS: CommonService
  ) { 
    this.auth.getMe().then(me => {
      this.me = me;
    });

    this.getLists();
  }

  ngOnInit() {
    this.auth.fbScreen('friend_list');
  }

  getLists() {
    this.friendS.getLists({}, this.limit, this.offset)
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

  imgSrc(src: any) {
    let str = src.replace('/images/avatars/avatar-unknown.jpg', this.images);
    return str;
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

  async popoverMore(ev: any, id: any, idx: any) {
    const popover = await this.popover.create({
      component: FListMoreComponent,
      componentProps: { id },
      event: ev,
      translucent: true,
      mode: 'ios'
    });
    popover.onWillDismiss().then(detail => {
      if (detail.data) {
        this.lists.splice(idx, 1);
      }
    });
    await popover.present();
  }

}
