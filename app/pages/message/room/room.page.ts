import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { IonContent, IonList, IonTextarea, IonInfiniteScroll, AlertController, NavController, ActionSheetController, Platform, IonHeader, IonFooter, PopoverController, ViewWillEnter, ViewWillLeave } from '@ionic/angular';

import { Observable, Subscription } from 'rxjs';
import { distinct } from 'rxjs/operators';

import { appConfig } from 'src/config';

import { CommonService } from 'src/app/service/common.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/service/message.service';

import { ReportComponent } from 'src/app/modal/report/report.component';
import { UserService } from 'src/app/service/user.service';
import { ImageUploadService } from 'src/app/service/image-upload.service';
import { ImageViewService } from 'src/app/service/image-view.service';
import { ProfileService } from 'src/app/service/profile.service';

import { MessageRoomMenuComponent } from 'src/app/pages/message/room/message-room-menu/message-room-menu.component';
import { LoadingService } from 'src/app/service/loading.service';

declare var io: any;

@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit, OnDestroy, ViewWillEnter, ViewWillLeave {
  @ViewChild(IonContent) contentArea: IonContent;
	@ViewChild(IonList, {static: true, read:ElementRef}) chatList: ElementRef;
	@ViewChild(IonTextarea) tarea: IonTextarea;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonHeader,{static: true, read: ElementRef}) header: ElementRef;
  @ViewChild(IonFooter,{static: true, read: ElementRef}) footer: ElementRef;

  private socket: any;
  private socketId: string;
  private socketRetryCount: number = 0;
  
  private id: any;
  private type: any;
  private idx: any;
  
  private thumb_image: any;
  private completeMsg: any;
  private getMsg: any = [];
  private chatsMsg: Object[];
	private mutationObserver: MutationObserver;

  private loadingChk = false;
  private scrollChk = false;

  private observableMe$: any;

	private limit = 50;
  private offset = 0;

  private imageUrl: string;
  private token: string;

  private keyboardShowEventListener: EventListener;
  private scrollAmount: any;
  private backButtonSubscription: Subscription;

  me: any;
	target: any;
  target_participant: any;
  
  message: any = '';
  emojiMessage: any = '';
	chats: any;
  listLoad: boolean = true;
  images = 'assets/icon/profile-none.jpg';
  transparent = 'assets/icon/emoji-transparent.png';
  isDisabled = true;

  emojis: any = [];
  showEmojiPicker = false;
  emojiHeight: any = window.innerHeight/2;
  rootHeight: any;

  chatShow: boolean = false;

  keyboardOffset: any = 'auto';
  
  constructor(
    public auth: AuthenticationService,
    public commonS: CommonService,
    public activatedRoute: ActivatedRoute,
    public messageS: MessageService,
    public alertCtrl: AlertController,
    public nav: NavController,
    public userS: UserService,
    public actionSheet: ActionSheetController,
    public imgUploadS: ImageUploadService,
    public imageViewS: ImageViewService,
    public profileS: ProfileService,
    public plt: Platform,
    public loadingS: LoadingService,
    public popover: PopoverController
  ) { 
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.type = this.activatedRoute.snapshot.paramMap.get('type');

    this.rootHeight = window.innerHeight;
  }

  private resumeSocket(callback: () => void = undefined) {
    this.socket = io.connect(appConfig.teeshotConfig.socketOldUrl, {
      transports: this.plt.is('cordova') && this.plt.is('android') ? ['polling'] : ['websocket', 'polling']
    });

    const promiseAll = [
      new Promise((resolve, reject) => {
        this.socket.timeout(8000).emit('joinRoom', this.id, function(err: Error, response: any) {
          if (err) {
            reject('채팅방 입장에 실패했습니다, 인터넷 연결을 확인해주세요');
          } else {
            if (response.success) {
              resolve(true);
            } else {
              reject('채팅방 입장에 실패했습니다');
            }
          }
        });
      }),
      new Promise((resolve, reject) => {
        this.messageS.getMessage(this.id, this.limit, this.offset)
          .subscribe((res: any) => {
            if (res.success) {
              resolve(res);
            } else {
              reject('데이터를 받아오는데 실패했습니다');
            }
        });
      }),
      new Promise((resolve, reject) => {
        this.observableMe$ = this.commonS.me$
          .pipe(distinct((it: any) => it.id))
          .subscribe(async (it: any) => {
          let me = it;
          if (!it || !it.id) {
            me = await this.userS.getTokenUser();
            me = await this.userS.getMeExpired(me);
          }
    
          this.auth.authToken.subscribe(token => {
            this.token = token;
          });
          if (!me || !me?.id) {
            reject('사용자 데이터를 불러오는데 실패했습니다');
          } else {
            resolve(me);
          }
        });
      })
    ]
    Promise.all(promiseAll).then((values: Array<any>) => {
      this.me = values[2];
      if (values[1].toUser && values[1].toUser.id !== 1) {
        if (this.me.expire) this.nav.navigateRoot('payments');
      }

      this.putMsgRead();
      const obj = values[1];

      if (obj.participants?.blocked_at) {
        this.blockAlert();
        this.nav.back();
      }

      this.chats = obj.data;

      this.target_participant = obj.toUser;
      this.target = obj.toUser;

      if (obj.data?.length < this.limit) {
        this.infiniteScroll.disabled = true;
        this.offset = 0;
      }

      this.isDisabled = false;
      this.socketId = this.socket.id;
      if (callback) callback();
    }).catch((err) => {
      this.commonS.toastMsg(err);
      this.nav.back();
    });
    this.getMessages().subscribe(message => {
      this.getMsg = message;
      if (this.getMsg.user_id != this.me.id && this.getMsg.thread_id == this.id) {
        this.loadingChk = true;
        this.chats.push(this.getMsg);

        this.putMsgRead();
      }
    });
    this.getMsgRead().subscribe(obj => {
      let data: any = obj;
      if (this.target_participant) {
        this.target_participant.last_read = data?.date?.replaceAll('-', '/');
      }
    });
  }

  private pauseSocket(callback: () => void = undefined) {
    this.isDisabled = true;
    this.observableMe$.unsubscribe();

    if (this.socket) {
      this.socket.emit('leaveRoom');
      this.socket.removeAllListeners('getMessage');
      this.socket.removeAllListeners('getMsgRead');
      this.socket.disconnect();
    }
    if (callback) callback();
  }

  ngOnInit() {
    this.keyboardShowEventListener = (event) => this.didShow(event);

    window.addEventListener('ionKeyboardDidShow', this.keyboardShowEventListener);
    this.backButtonSubscription = this.plt.backButton.subscribeWithPriority(10, () => {
      this.nav.back();
    });

    this.mutationObserver = new MutationObserver((mutations) => {
  		if (!this.scrollChk) {
        let chatShowTime: any = 500;
        if (this.plt.is('android')) {
          chatShowTime = 200;
        }
        this.contentArea.scrollToBottom();  
        setTimeout(() => {
          this.contentArea.scrollToBottom();
          this.chatShow = true;
        }, chatShowTime);
  		} else {
        this.scrollChk = false;
      }
    });
    this.mutationObserver.observe(this.chatList.nativeElement, {
      childList: true
    });
    this.resumeSocket();
    this.auth.fbScreen('message_room');
  }

  ngOnDestroy() {
    window.removeEventListener('ionKeyboardDidShow', this.keyboardShowEventListener);
    this.backButtonSubscription?.unsubscribe();
    this.pauseSocket();
  }

  ionViewWillEnter() {
  }

  ionViewWillLeave() {
  }

  didShow(event: any) {
    let detail: any = event.detail;
    if (detail.keyboardHeight) {
      let contentHeight: any = this.rootHeight - window.innerHeight;
      
      setTimeout(() => {
        if (this.emojiHeight==this.rootHeight/2 && contentHeight > detail.keyboardHeight) this.emojiHeight = contentHeight + 47;
      }, 100);
      
      let outHeight: any = this.header.nativeElement.offsetHeight + this.footer.nativeElement.offsetHeight;
      let bottomTime: any = 0;
      if (this.plt.is('android')) {
        bottomTime = 0;
      } else {
        bottomTime = 100;
      }

      this.contentArea.getScrollElement().then((data) => {
        let scrollTop: any = Math.floor(data.scrollTop);
        let scrollHeight: any = this.rootHeight + scrollTop - outHeight;

        if (data.scrollHeight < scrollHeight) {
          scrollHeight = scrollTop + window.innerHeight - outHeight;
          bottomTime = 100;
        }
        if (data.scrollHeight == scrollHeight) {
          setTimeout(() => {
            this.contentArea.scrollToBottom();
          }, bottomTime);
        }
      });

    }
  }

  getMessage() {
    this.messageS.getMessage(this.id, this.limit, this.offset)
      .subscribe(res => {
        let obj: any = res;

        if (obj.participants?.blocked_at) {
          this.blockAlert();
          this.nav.back();
        }

        if (res.success) {
          let data: any = obj.data;

          if (this.offset) {
            this.chats = data.concat(this.chats);
            
            this.contentArea.scrollY = true;
            
            if (data.length < this.limit) {
              this.infiniteScroll.disabled = true;
              this.offset = 0;
            }
          } else {

            this.chats = data;

            this.target_participant = obj.toUser;
            this.target = obj.toUser;

            if (data.length >= this.limit) {
            } else {
              this.infiniteScroll.disabled = true;
            }
            
          }
        }
		});
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('getMessage', (data: any) => {
        observer.next(data);
      });
    });
    return observable;
  }

  getMsgRead() {
  	let observable = new Observable(observer => {
	  	this.socket.on('getMsgRead', (data) => {
	  		observer.next(data);
	  	});
	  });
  	return observable;
  }

  async putMsgRead() {
    let msgRead: any = { thread_id: this.id, user_id: this.me.id, date: new Date() };
    await this.socket.emit('putMsgRead', msgRead);
  }
  
  loadData(e: any) {
    e.target.complete();
    if (this.chatShow) {
      if (this.chats?.length) {
        if (!this.scrollChk) {
          this.contentArea.scrollY = false;
          this.scrollChk = true;
          this.offset = this.offset + this.limit;

          this.getMessage();
        } else {
        }
      } else {
      }
    }
  }  

  imageLoaded() {
		if (this.loadingChk) {
			this.contentArea.scrollToBottom();
			this.loadingChk = false;
    } else {
      setTimeout(() => {
        this.contentArea.scrollToBottom();
      }, 0);
    }
  }
  
  loadDefault(event: any) {
    event.target.src = this.images;
  }

  imageView(chat: any) {
    this.imageViewS.imageView({ image: chat.body }).then(modal => {
    });
  }

  refreshAni(img: any) {
    const src = img.target.src;
    img.target.src = this.transparent;
    setTimeout(() => {
      img.target.src = src;
    }, 50);
  }

  addChat(type: string) {
    this.isDisabled = true;
    if (this.socket.id != this.socketId) {
      if (this.socketRetryCount > 1) {
        this.commonS.toastMsg('인터넷이 불안정합니다, 잠시 후 다시 시도해주세요');
        this.nav.back();
      } else {
        this.socketRetryCount++;
        this.loadingS.show(5000);
        this.pauseSocket(() => {
          this.resumeSocket(() => {
            this.loadingS.hide();
            this.addChat(type);
          });
        });
      }
    } else {
      if (type != 'image' && !this.showEmojiPicker) {
        this.tarea.setFocus();
      }

      this.loadingChk = true;

      if (this.emojiMessage) {
        let emoji = '';
        if (this.emojiMessage.indexOf('assets') >= 0) {
          emoji = `${appConfig.teeshotConfig.webRoot}/images` + this.emojiMessage.replace('assets','');
        } else {
          emoji = this.emojiMessage;
        }

        let obj = {
          token: this.token,
          thread_id: parseInt(this.id),
          dst_user_id: this.target.id,
          recipient: this.target.id,
          message: emoji,
          created_at: new Date(),
          body: emoji,
          user_id: this.me.id,
          username: this.me.username
        }
        
        this.socket.timeout(5000).emit('setMessage', obj, (err: Error, response: any) => {
          if (err) {
            this.commonS.toastMsg('메시지 전송에 실패했습니다, 인터넷 연결을 확인해주세요');
          } else {
            if (response.success) {
              this.socketRetryCount = 0;
              this.chats.push(obj);
              this.emojiMessage = '';
            } else {
              this.commonS.toastMsg('메시지 전송에 실패했습니다');
            }
          }
          this.isDisabled = false;
        });
      }

      if (this.message || this.imageUrl) {
        let obj = {
          token: this.token,
          thread_id: parseInt(this.id),
          dst_user_id: this.target.id,
          recipient: this.target.id,
          message: type == 'image' ? this.imageUrl : this.message,
          created_at: new Date(),
          body: type == 'image' ? this.imageUrl : this.message,
          user_id: this.me.id,
          username: this.me.username
        }
        this.socket.timeout(5000).emit('setMessage', obj, (err: Error, response: any) => {
          if (err) {
            this.commonS.toastMsg('메시지 전송에 실패했습니다, 인터넷 연결을 확인해주세요');
          } else {
            if (response.success) {
              this.socketRetryCount = 0;
              this.chats.push(obj);
              if (type == 'image') {
                this.imageUrl = '';
              } else {
                this.message = '';
              }
            } else {
              this.commonS.toastMsg('메시지 전송에 실패했습니다');
            }
          }
          this.isDisabled = false;
        });
      }
    }
  }

  refresh(obj: any, idx: any) {

  }

  logScrolling(event: any) {
    this.scrollAmount = event.detail.scrollTop;
  }

  focus() {
    if (this.emojiHeight!=this.rootHeight/2) {
      this.keyboardOffset = this.emojiHeight;
    }
    let focusTime: any = 100;
    if (this.plt.is('android')) {
      focusTime = 63;
    }
    if (this.showEmojiPicker) {
      setTimeout(() => {
        this.showEmojiPicker = false;  
      }, focusTime);
    }
	}

	blur() {
    if (!this.message) this.emojiMessage = '';
    if (this.showEmojiPicker) {
      this.showEmojiPicker = false;
    }
  }

  imgSrc(src: any) {
    let str = src.replace('/images/avatars/avatar-unknown.jpg', this.images);
    return str;
  }

  imgError(event: any) {
    event.target.src = this.images;
  }

  userReport(user: any, me: any) {
    this.commonS.commonModal({ user, me }, ReportComponent).then(modal => {

    });
  }

  switchEmoji() {
    if (!this.showEmojiPicker) {
      let headerHeight: any = this.header.nativeElement.offsetHeight;
      let footerHeight: any = this.footer.nativeElement.offsetHeight
      let outHeight: any = headerHeight + footerHeight;
      if (headerHeight == 88 && footerHeight == 46) {
        outHeight+=34;
      }
      if (this.plt.is('android')) {
        setTimeout(() => {
          this.showEmojiPicker = true;
          this.scrollChkBottom(outHeight);
        }, 100);
      } else {
        setTimeout(() => {
          this.showEmojiPicker = true;
          this.scrollChkBottom(outHeight);
        }, 200);
      }
    } else {
      this.tarea.setFocus();
    }
  }

  emojiSend(emoji: any) {
    this.message =  emoji;
    this.addChat('image');
  }

  emojiFieldClose() {
    this.emojiMessage = '';
  }

  scrollChkBottom(outHeight: any) {
    this.contentArea.getScrollElement().then((data) => {
      let scrollTop: any = Math.floor(data.scrollTop);
      let scrollHeight: any = this.rootHeight + scrollTop - outHeight;

      if (data.scrollHeight < scrollHeight) {
        scrollHeight = scrollTop + window.innerHeight - outHeight;
      }
      if (data.scrollHeight == scrollHeight) {
        setTimeout(() => {
          this.contentArea.scrollToBottom();
        }, 0);
      }
    });
  }

  profile(target: any) {
    let obj: any = {
      id: this.me.id,
      target
    }
    this.profileS.profileOpen(obj).then(modal => {
    });
  }

  async chatOut(thread_id: any) {
    const alert = await this.alertCtrl.create({
      header: '대화방 나가기',
      message: '<p>대화방에서 나가시겠습니까?<p><p>나가기 하시면 대화내용이 삭제되고 리스트에서도 삭제됩니다.</p>',
      buttons: [
        {
          text: '취소',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: '확인',
          handler: () => {
            this.messageS.putLeaveChat(thread_id).then(resolve => {
              if (resolve) {
                this.messageS.leaveRoom$.next(this.id);
                this.nav.back();
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async block(thread_id: any) {
    const alert = await this.alertCtrl.create({
      header: '대화 차단하기',
      message: '<p>상대방을 차단하시겠습니까?</p><p>차단하시면 상대방으로부터 메시지를 받지않습니다.</p>',
      buttons: [
        {
          text: '취소',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: '확인',
          handler: () => {
            this.messageS.putBlockUser(thread_id).then(resolve => {
              if (resolve) {
                this.messageS.leaveRoom$.next(this.id);
                this.nav.back();
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async blockAlert() {
    const alert = await this.alertCtrl.create({
      header: '대화 차단',
      message: '회원님이 대화를 차단하여 메시지를 보낼수 없습니다.',
      buttons: ['확인']
    });
    await alert.present();
  }

  async attach() {
  	// this.tarea.setFocus();

  	let action = await this.actionSheet.create({
      header: '선택',
      buttons: [{
        text: '사진',
        icon: 'images',
        handler: () => {
          this.imgUploadS.uploadPhotoMessage('photo', this.id).then(resolve => {
            if (resolve) {
              this.imageUrl = resolve;
              this.addChat('image');
            }
          });
        }
      }, {
        text: '카메라',
        icon: 'camera',
        handler: () => {
          this.imgUploadS.uploadPhotoMessage('camera', this.id).then(resolve => {
            if (resolve) {
              this.imageUrl = resolve;
              this.addChat('image');
            }
          });
        }
      }]
    });
    await action.present();
  }

  async popoverMore(ev: any) {
    const popover = await this.popover.create({
      component: MessageRoomMenuComponent,
      componentProps: { target: this.target },
      event: ev,
      translucent: true
    });
    popover.onWillDismiss().then(detail => {
      if (detail.data) {
        if (detail.role === 'report') {
          this.userReport(this.target, this.me);
        } else if (detail.role === 'out') {
          this.chatOut(this.target?.thread_id);
        } else if (detail.role === 'block') {
          this.block(this.target?.thread_id);
        }
      }
    });
    await popover.present();
  }

}
