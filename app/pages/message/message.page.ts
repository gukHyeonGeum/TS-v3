import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavController, IonInfiniteScroll, IonRefresher, ViewWillEnter, ViewWillLeave, Platform } from '@ionic/angular';

import { Observable } from 'rxjs';

import { appConfig } from 'src/config';

import { AlertService } from 'src/app/service/alert.service';
import { MessageService } from 'src/app/service/message.service';
import { ProfileService } from 'src/app/service/profile.service';
import { VerifyService } from 'src/app/service/verify.service';
import { CommonService } from 'src/app/service/common.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { BadgeService } from 'src/app/service/badge.service';
import { UserService } from 'src/app/service/user.service';

declare var io: any;

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit, OnDestroy, ViewWillEnter, ViewWillLeave {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonRefresher) refresher: IonRefresher;

  private socket: any;
  
  private limit = 10;
  private offset = 0;

  private events: any;
  private observableMe$: any;

  private refreshChk: boolean = false;
  private joinRoomId = 0;
  
  me: any;
  lists: any;
  adminList: any;
  images = 'assets/icon/profile-none.jpg';

  constructor(
    public auth: AuthenticationService,
    public nav: NavController,
    public profileS: ProfileService,
    public messageS: MessageService,
    public alertS: AlertService,
    public userS: UserService,
    // public socket: Socket,
    public verifyS: VerifyService,
    public commonS: CommonService,
    public plt: Platform,
    public badgeS: BadgeService
  ) {
    this.socket = io.connect(appConfig.teeshotConfig.socketOldUrl, {
      transports: this.plt.is('cordova') && this.plt.is('android') ? ['polling'] : ['websocket', 'polling']
    });

    new Promise((resolve, reject) => {
      this.observableMe$ = this.commonS.me$.subscribe((me: any) => {
        resolve(me);
      });
    }).then(async (it: any) => {
      if (!it || !it.id) {
        return await this.userS.getTokenUser();
      } else {
        return it;
      }
    }).then((me) => {
      if (!this.me) {
        this.me = me;

        this.socket.emit('joinRoom', this.me.id);

        this.getMsgList().subscribe(res => {
          let data: any = res;
          data.thread_id = data.id;
          data.message = data.lastmsg;
          data.created_at = data.message_created_at;

          if (this.lists) {
            let idx = this.lists.findIndex((r: { id: any; }) => { return r.id == data.thread_id });
            if (idx >= 0) {
              let list: any = this.lists.find((r: { id: any; }) => { return r.id == data.thread_id });
              list.lastmsg = data.message;
              list.message_created_at = data.created_at;
              if (data.thread_id != this.joinRoomId && data.user_id != this.me.id) {
                list.unread_cnt++;
                this.badgeS.refresh(this.auth.isToken()).then(() => {});
              }

              this.lists.splice(idx, 1);
              this.lists.splice(1, 0, list);
            }
          }
        });
      }
    });

    this.getAdminList();
  }

  ionViewWillEnter(): void {
    this.joinRoomId = 0;
  }
  ionViewWillLeave(): void {
  }

  ngOnInit() {
    this.events = this.messageS.leaveRoom$.subscribe(val => {
      if (val) this.listsplice(val);
    });

    this.auth.fbScreen('message_list');
  }

  ngOnDestroy() {
    this.events.unsubscribe();
    this.observableMe$.unsubscribe();
    if (this.socket) {
      this.socket.removeAllListeners('putMessageListBadge');
      this.socket.emit('leaveRoom');
      this.socket.disconnect();
    }
  }

  getAdminList() {
    this.messageS.getAdminLists().subscribe(data => {
      this.adminList = data;
      this.getLists();
    });
  }

  getLists() {
    this.messageS.getLists({}, this.limit, this.offset)
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

            if (this.adminList) this.lists.unshift(this.adminList);

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

  getMsgList() {
    let observable = new Observable(observer => {
      this.socket.on('putMessageListBadge', (data: any) => {
        observer.next(data);
      });
    });
    return observable;
  } 

  profile(target: any) {
    let obj: any = {
      id: this.me.id,
      target
    }
    this.profileS.profileOpen(obj).then(modal => {
    });
  }

  async room(list: any, idx: any) {
    if (list.user_id === 1) {
      this.forwardRoom(list);
    } else {
      this.verifyS.isCertPhone().then(() => {
        this.verifyS.isProfile().then(() => {
          this.verifyS.isExpire().then(async () => {
            this.forwardRoom(list);
            this.joinRoomId = list.id;
          }).catch(() => {});
        }).catch(() => {});
      }).catch(() => {});
    }
  }

  async forwardRoom(list: any) {
    await this.commonS.getStorage('count').then(data => {
      data.newMessage -= list.unread_cnt;
      this.commonS.setStorage('count', data);
      this.commonS.badge$.next(data);
    });
    list.unread_cnt = 0;
    this.nav.navigateForward(['message/room/' + list.id]);
  }

  listsplice(id: any) {
    let idx = this.lists.findIndex((r: { id: any }) => { return r.id == id });

    this.lists.splice(idx, 1);
    this.messageS.leaveRoom$.next('');
  }


}
