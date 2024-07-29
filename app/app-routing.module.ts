import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'member/recommended',
    pathMatch: 'full'
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'join-info',
    loadChildren: () => import('./pages/join-info/join-info.module').then(m => m.JoinInfoPageModule)
  },
  {
    path: 'premium',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/premium/premium.module').then(m => m.PremiumPageModule)
  },
  {
    path: 'premium/view/:id',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/premium/view/view.module').then(m => m.ViewPageModule)
  },
  {
    path: 'golfjoin',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/golfjoin/golfjoin.module').then(m => m.GolfjoinPageModule)
  },
  {
    path: 'golfjoin/view/:id',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/golfjoin/view/view.module').then(m => m.ViewPageModule)
  },
  {
    path: 'member',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/member/member.module').then(m => m.MemberPageModule)
  },
  {
    path: 'email-login',
    loadChildren: () => import('./login/email-login/email-login.module').then(m => m.EmailLoginPageModule)
  },
  {
    path: 'find-email',
    loadChildren: () => import('./login/email-login/find-email/find-email.module').then(m => m.FindEmailPageModule)
  },
  {
    path: 'find-pass',
    loadChildren: () => import('./login/email-login/find-pass/find-pass.module').then(m => m.FindPassPageModule)
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'profile-manage',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/profile/profile-manage/profile-manage.module').then(m => m.ProfileManagePageModule)
  },
  {
    path: 'message',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/message/message.module').then(m => m.MessagePageModule)
  },
  {
    path: 'message/room/:id',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/message/room/room.module').then(m => m.RoomPageModule)
  },
  {
    path: 'visit',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/visit/visit.module').then(m => m.VisitPageModule)
  },
  {
    path: 'news',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/news/news.module').then(m => m.NewsPageModule)
  },
  {
    path: 'friend',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/friend/friend.module').then(m => m.FriendPageModule)
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule)
  },
  {
    path: 'payments',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/payments/payments.module').then(m => m.PaymentsPageModule)
  },
  {
    path: 'payments/lists',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/payments/page-list/page-list.module').then(m => m.PageListPageModule)
  },
  {
    path: 'active-golfjoin',
    canActivate: [AuthGuard],
    loadChildren: () => import('./home/active-golfjoin/active-golfjoin.module').then(m => m.ActiveGolfjoinPageModule)
  },
  {
    path: 'active-premium',
    canActivate: [AuthGuard],
    loadChildren: () => import('./home/active-premium/active-premium.module').then(m => m.ActivePremiumPageModule)
  },
  {
    path: 'phone-login',
    loadChildren: () => import('./login/phone-login/phone-login.module').then( m => m.PhoneLoginPageModule)
  },
  {
    path: 'package',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/package/package.module').then( m => m.PackagePageModule)
  },
  {
    path: 'screen',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/screen/screen.module').then( m => m.ScreenPageModule)
  },
  {
    path: 'giftmoney',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/giftmoney/giftmoney.module').then( m => m.GiftmoneyPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
