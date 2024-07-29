import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeKr from '@angular/common/locales/ko';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Device } from '@ionic-native/device/ngx';
import { AppRate } from '@ionic-native/app-rate/ngx';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { InAppPurchase2 } from '@ionic-native/in-app-purchase-2/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { WebIntent } from '@ionic-native/web-intent/ngx';
import { Appsflyer } from '@ionic-native/appsflyer/ngx';
import { SignInWithApple, ASAuthorizationAppleIDRequest } from '@ionic-native/sign-in-with-apple/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';

import { PipesModule } from './pipe/pipes/pipes.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AgreementComponent } from './modal/certification/agreement/agreement.component';
import { AgreeViewComponent } from './modal/certification/agreement/agree-view/agree-view.component';
import { AlertComponent } from './modal/alert/alert.component';
import { CertificationComponent } from './modal/certification/certification.component';
import { ConfirmComponent } from './modal/confirm/confirm.component';
import { EventComponent } from './modal/event/event.component';
import { ImageViewComponent } from './modal/image-view/image-view.component';
import { InvitationComponent } from './pages/screen/invitation/invitation.component';
import { ListsComponent } from './pages/payments/lists/lists.component';
import { MyGolfjoinComponent } from './modal/mypage/my-golfjoin/my-golfjoin.component';
import { MyPremiumComponent } from './modal/mypage/my-premium/my-premium.component';
import { PaymentMoneyComponent } from './modal/payment-money/payment-money.component';
import { ReportComponent } from './modal/report/report.component';
import { PopMoreComponent } from './pages/premium/view/pop-more/pop-more.component';
import { ProfileComponent } from './modal/profile/profile.component';
import { PermissionComponent } from './modal/permission/permission.component';
import { StoreComponent } from './modal/store/store.component';
import { ScreenCloseComponent } from './modal/screen-close/screen-close.component';
import { ScreenGiftmoneyPayComponent } from './modal/screen-giftmoney-pay/screen-giftmoney-pay.component';
import { ScreenMatchingComponent } from './modal/screen-matching/screen-matching.component';
import { ScreenRequestComponent } from './modal/screen-request/screen-request.component';
import { ScreenRatingComponent } from './modal/screen-rating/screen-rating.component';
import { ScreenRatingConfirmComponent } from './modal/screen-rating-confirm/screen-rating-confirm.component';
import { ScreenStoreComponent } from './modal/screen-store/screen-store.component';
import { SearchClubComponent } from './modal/search-club/search-club.component';
import { ViewComponent } from './pages/payments/lists/view/view.component';
import { RefundComponent } from './pages/payments/refund/refund.component';
import { BugsComponent } from './pages/settings/bugs/bugs.component';
import { DistrictSelectComponent } from './modal/district-select/district-select.component';
import { ScreenGuideComponent } from './modal/screen-guide/screen-guide.component';

registerLocaleData(localeKr);
@NgModule({
  declarations: [
    AppComponent,
    AgreementComponent,
    AgreeViewComponent,
    AlertComponent,
    CertificationComponent,
    ConfirmComponent,
    EventComponent,
    ImageViewComponent,
    InvitationComponent,
    ListsComponent,
    MyGolfjoinComponent,
    MyPremiumComponent,
    PaymentMoneyComponent,
    ReportComponent,
    RefundComponent,
    PopMoreComponent,
    ProfileComponent,
    StoreComponent,
    ScreenCloseComponent,
    ScreenGiftmoneyPayComponent,
    ScreenMatchingComponent,
    ScreenRequestComponent,
    ScreenRatingComponent,
    ScreenRatingConfirmComponent,
    ScreenStoreComponent,
    SearchClubComponent,
    PermissionComponent,
    DistrictSelectComponent,
    ScreenGuideComponent,
    ViewComponent,
    BugsComponent
  ],
  entryComponents: [
    AgreementComponent,
    AgreeViewComponent,
    AlertComponent,
    CertificationComponent,
    ConfirmComponent,
    EventComponent,
    ImageViewComponent,
    InvitationComponent,
    ListsComponent,
    MyGolfjoinComponent,
    MyPremiumComponent,
    PaymentMoneyComponent,
    ReportComponent,
    RefundComponent,
    PopMoreComponent,
    ProfileComponent,
    StoreComponent,
    ScreenCloseComponent,
    ScreenGiftmoneyPayComponent,
    ScreenMatchingComponent,
    ScreenRequestComponent,
    ScreenRatingComponent,
    ScreenRatingConfirmComponent,
    ScreenStoreComponent,
    SearchClubComponent,
    PermissionComponent,
    DistrictSelectComponent,
    ScreenGuideComponent,
    ViewComponent,
    BugsComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      
    }),
    AppRoutingModule,
    HttpClientModule,
    PipesModule,
    IonicStorageModule.forRoot(),
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Device,
    AppRate,
    FCM,
    Camera,
    FileTransfer,
    FileTransferObject,
    InAppPurchase2,
    AppVersion,
    WebIntent,
    Appsflyer,
    SignInWithApple, ASAuthorizationAppleIDRequest,
    Keyboard,
    InAppBrowser,
    Geolocation,
    Crop,
    Deeplinks,
    FirebaseAnalytics
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
