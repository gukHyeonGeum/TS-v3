import { Component, NgZone } from '@angular/core';

import { Platform, MenuController, NavController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { Appsflyer } from '@ionic-native/appsflyer/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';

import { appConfig } from 'src/config';

import { AppversionService } from './service/appversion.service';
import { AuthenticationService } from './service/authentication.service';
import { BadgeService } from './service/badge.service';
import { CommonService } from './service/common.service';
import { PushService } from './service/push.service';
import { UserService } from './service/user.service';
import { GeoService } from './service/geo.service';

import { ScreenPage } from 'src/app/pages/screen/screen.page';
import { LogsService } from './service/logs.service';
import { PaymentService } from './service/payment.service';
import { PermissionComponent } from './modal/permission/permission.component';

declare var io: any;
declare var kakaoPixel: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  private backButtonPressedOnceToExit: boolean = false;
  private pltType: String = '';
  private socket: any;

  me: any;
  images = 'assets/icon/profile-none.jpg';
  count: any = [];

  public selectedIndex = 0;
  public appPages = [
    {
      title: '마이페이지',
      url: '/home',
      icon: 'home-outline',
      lines: 'none'
    },
    {
      title: '이용권 구매',
      url: '/payments',
      icon: 'card-outline',
      lines: 'none'
    },
    {
      title: '골프조인',
      url: '/golfjoin',
      icon: 'golf-outline',
      lines: 'none'
    },
    {
      title: '프리미엄',
      url: '/premium',
      icon: 'flag-outline',
      lines: 'none'
    },
    {
      title: '스크린 번개',
      url: '/screen/map',
      icon: 'flash-outline',
      lines: 'full'
    },
    {
      title: '친구추천',
      url: '/member',
      icon: 'search-outline',
      lines: 'none'
    },
    {
      title: '메시지',
      url: '/message',
      icon: 'chatbubbles-outline',
      lines: 'none',
      badge: ''
    },
    {
      title: '프로필방문자',
      url: '/visit',
      icon: 'enter-outline',
      lines: 'none',
      badge: ''
    },
    {
      title: '친구',
      url: '/friend',
      icon: 'people-outline',
      lines: 'none',
      badge: ''
    },
    {
      title: '내 소식',
      url: '/news',
      icon: 'notifications-outline',
      lines: 'full',
      badge: ''
    },
    {
      title: '설정',
      url: '/settings',
      icon: 'settings-sharp',
      lines: 'none'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private appsflyer: Appsflyer,
    private fba: FirebaseAnalytics,
    public auth: AuthenticationService,
    public storage: Storage,
    public userS: UserService,
    public menu: MenuController,
    public pushS: PushService,
    public commonS: CommonService,
    public appVersion: AppversionService,
    public badgeS: BadgeService,
    public geo: GeoService,
    public deeplink: Deeplinks,
    public nav: NavController,
    public ngZone: NgZone,
    public logS: LogsService,
    public paymentS: PaymentService,
    private modal: ModalController
  ) {
    this.initializeApp();

    this.commonS.me$.subscribe(data => {
      if (data) {
        this.me = data;
      } else {
        this.userS.getMeInfo().then(me => {
          this.me = me;
        });
      }
    });

    this.commonS.badge$.subscribe(data => {
      if (data) {
        this.count = data;
        this.badgeRefresh(this.count);
      }
    });

    this.commonS.selectedIndex$.subscribe(val => {
        this.menuSelect();
    });
  }

  badgeRefresh(count: any) {
    this.appPages[6].badge = count.newMessage;
    this.appPages[7].badge = count.newVisit;
    this.appPages[8].badge = count.newInvite;
    this.appPages[9].badge = count.newsCnt;
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      if (this.platform.is('cordova')) {
        if (this.platform.is('android')) {
          this.statusBar.styleLightContent();
          this.pltType = 'android';
        } else {
          this.statusBar.styleDefault();
          this.pltType = 'ios';
        }

        await this.appVersion.versionCheck(this.pltType).then().catch(() => {});

        this.deeplink.route({
          '/': '',
          '/home': 'home',
          '/golfjoin': 'golfjoin',
          '/golfjoin/:id': 'golfjoin/view',
          '/premium': 'premium',
          '/premium/:id': 'premium/view',
          '/screen': 'screen/map',
          '/screen/:id': 'screen/view',
          '/member': 'member/popular',
          '/message': 'message',
          '/friend': 'friend/request',
          '/visit': 'visit'
        }).subscribe(match => {
          if (match.$route) {
            this.ngZone.run(() => {
              const url = `${match.$route}${match.$args['id'] ? '/' + match.$args['id'] : ''}`;
              this.nav.navigateRoot(url);
            });
          }
        }, () => {
        });

        let options = {
          devKey: 'ot6xDWiRtZLjPTYbVUXRUU',
          appId: 'id1092007968'
        };
        await this.appsflyer.initSdk(options);

        // 인앱결제
        await this.paymentS.iapLoad();

        this.splashScreen.hide();
      }

      this.auth.authToken.subscribe(token => {
        if (token) {
          this.userS.getTokenUser(token).then(async (data) => {
            await this.badgeS.refresh(token).then(() => {});
          });
        }
      });

      // 푸시
      this.pushS.pushToken();

      this.registerHardwareBackButton();
    });
  }

  async ngOnInit() {
    this.menuSelect();

    await this.auth.getMe().then((me: any) => {
      if (me) {
        this.fba.setUserId(me.id.toString());
      }
    });
  }

  menuSelect() {
    const path = window.location.pathname.split('/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.url === '/' + path);
    }
  }

  menuClose() {
    this.menu.close();
  }

  imgSrc(src: any) {
    let str = src.replace('/images/avatars/avatar-unknown.jpg', this.images);
    return str;
  }

  imgError(event: any) {
    event.target.src = this.images;
  }

  registerHardwareBackButton() {
    this.platform.backButton.subscribeWithPriority(9, (e) => {
      if (this.backButtonPressedOnceToExit) {
        navigator['app'].exitApp();
      } else {
        this.backButtonPressedOnceToExit = true;
        this.commonS.toastMsg("'뒤로'버튼을 한번 더 누르시면 종료합니다.", 'bottom', 1500);
        setTimeout(() => {
          this.backButtonPressedOnceToExit = false;
        }, 2000);
      }
    });
  }

}
