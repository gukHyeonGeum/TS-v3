import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonInfiniteScroll, IonRefresher, IonSlides, ModalController, NavController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ScreenService } from 'src/app/service/screen.service';
import { VerifyService } from 'src/app/service/verify.service';

import { PostComponent } from './post/post.component';
import { ScreenRatingComponent } from 'src/app/modal/screen-rating/screen-rating.component';
import { ScreenRatingConfirmComponent } from 'src/app/modal/screen-rating-confirm/screen-rating-confirm.component';
import { ScreenMatchingNoComponent } from 'src/app/modal/screen-matching-no/screen-matching-no.component';
import { ScreenGuideComponent } from 'src/app/modal/screen-guide/screen-guide.component';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.page.html',
  styleUrls: ['./screen.page.scss'],
})
export class ScreenPage implements OnInit {
  @ViewChild(IonSlides, { static: true }) slides: IonSlides;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonRefresher) refresher: IonRefresher;
  @ViewChild(IonContent, { static: true }) contentArea: IonContent;

  private refreshChk: boolean = false;

  me: any;
  pages: any = 0;
  lists: any;
  ratings: any;
  segment: any = 1;
  type: any = null;
  queryParam = false;
  images = 'assets/icon/profile-none.jpg';

  slideOpts = {
    initialSlide: 1,
    speed: 100,
    width: window.innerWidth
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modal: ModalController,
    private nav: NavController,
    public auth: AuthenticationService,
    public screenS: ScreenService,
    public verifyS: VerifyService
  ) { 
    this.route.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state?.type) {
        if (this.lists) this.doRefresh();
      } else if (this.router.getCurrentNavigation().extras.state?.tabs) {
        this.segment = this.router.getCurrentNavigation().extras.state?.tabs;
        this.queryParam = true;
        this.type = this.router.getCurrentNavigation().extras.state?.nav;
          this.segmentChanged(
            { 
              detail: { 
                value: this.router.getCurrentNavigation().extras.state?.tabs 
              } 
            }
          );
      }
    });
    
  }

  ngOnInit() {
    this.getLists();

    // 스크린 진행 여부 확인
    this.screenS.getScreenRatings().then(data => {
      this.auth.getMe().then(me => {
        data.forEach((screen: any) => {
          if (screen.status === 1) {
            if (screen.poster_id == me.id) {
              this.ratingConfirmModal(screen);
            }
          } else {
            if (screen.status === 2 || screen.status === 3) {
              this.ratingModal(screen);
            }
          }
        });  
      }); 
    });

    this.auth.fbScreen('screen_list');
  }
  
  // 리스트 불러오기
  getLists() {
    this.screenS.getLists({ segment: this.segment, type: this.type }, this.pages).then(res => {
      const data: any = res.data;
      this.me = res.me;

      if (this.pages > 0) {
        this.lists = this.lists.concat(data);

        if (!data.length) {
          this.pages = 0;
          this.infiniteScroll.disabled = true;
        }

      } else {
        this.lists = data;

        if (this.refreshChk) {
          this.refresher.complete();
          this.refreshChk = false;
        }
      }
    });
  }

  // 리스트 새로고침
  doRefresh() {
    this.refreshChk = true;
    this.infiniteScroll.disabled = false;
    this.pages = 0;
    this.getLists();
  }

  // 리스트 더보기
  loadData() {
    if (this.lists) {
      this.pages++;
      this.getLists();
    }
    this.infiniteScroll.complete();
  }

  imgError(event: any) {
    event.target.src = this.images;
  }

  // 초대장 상세보기 이동
  routerLink(type: String, list: any) {
      this.nav.navigateForward(['/screen/view', list.id]);
  }

  // 번개 만들기
  create() {
    this.verifyS.verify().then(() => {
      this.screenS.getTodayCount().then(res => {
        if (res) this.createModal();
      });
    }).catch(() => {});
  }

  // 탭 클릭
  async segmentChanged(ev: any) {
    this.segment = ev.detail.value;
    if (this.segment == 0) {
      this.auth.fbScreen('screengolf_invite_list');
      this.type = null;
    } else {
      this.auth.fbScreen('screengolf_request_list');
    }

    if (this.infiniteScroll) this.infiniteScroll.disabled = false;
    
    await this.contentArea.scrollToTop();

    this.lists = undefined;
    await this.slides.slideTo(ev.detail.value, 100, false);
    this.refreshChk = true;
    this.pages = 0;
    this.getLists();
  }

  // 좌우 슬라이드 이동
  async change() {
    if (!this.queryParam) {
      this.segment = await this.slides.getActiveIndex();
    }
    this.queryParam = false;
  }

  // 등록하기 Modal
  async createModal() {
    let modal = await this.modal.create({
      component: PostComponent,
      componentProps: {}
    });
    modal.onWillDismiss().then(detail => {
      if (detail.data) {
        this.doRefresh();
      }
    });
		await modal.present();
  }

  // 평가확인 modal
  async ratingConfirmModal(screen: any) {
    let modal = await this.modal.create({
      component: ScreenRatingConfirmComponent,
      componentProps: { screen },
      cssClass: 'global-modal-screen height360'
    });
    modal.onWillDismiss().then(detail => {
      
      this.screenS.putComplete(
        { 
          id: screen.id,
          answer: detail.data 
        }
      ).then(() => {
        if (detail.data == 'yes') {
          this.ratingModal(screen);
        } else if (detail.data == 'no') {
          this.matchingNoModal();
        }
      }).catch(() => {});
    });
		await modal.present();
  }

  // 평가하기
  async ratingModal(screen: any) {
    let modal = await this.modal.create({
      component: ScreenRatingComponent,
      componentProps: { screen }
    });
    modal.onWillDismiss().then(detail => {
      if (detail.data) {
      }
    });
		await modal.present();
  }

  // 매칭 후 스크린 진행 하지 않았을시
  async matchingNoModal() {
    let modal = await this.modal.create({
      component: ScreenMatchingNoComponent,
      componentProps: { },
      cssClass: 'global-modal-screen height200'
    });
    modal.onWillDismiss().then(detail => {
      if (detail.data) {
      }
    });
		await modal.present();
  }

  showGuide() {
    this.modal.create({ component: ScreenGuideComponent })
      .then((modal) => modal.present())
  }
}
