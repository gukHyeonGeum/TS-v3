import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';

import { AccountComponent } from './account/account.component';
import { UsernameComponent } from './username/username.component';
import { PasswordComponent } from './password/password.component';
import { AlarmComponent } from './alarm/alarm.component';
import { BugsComponent } from './bugs/bugs.component';
import { PartnerComponent } from './partner/partner.component';
import { CertificationComponent } from '../../modal/certification/certification.component';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { AppVersion } from '@ionic-native/app-version/ngx';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  version = '';

  constructor(
    public auth: AuthenticationService,
    public modal: ModalController,
    public platform: Platform,
    public appVersion: AppVersion
  ) { 
    if (this.platform.is('cordova')) {
    }
    appVersion.getVersionNumber().then((v) => {
      this.version = `v${v}`;
    });
  }

  ngOnInit() {
    this.auth.fbScreen('setting');
  }

  logout() {
    this.auth.logout();
  }

  rateApp() {
    if (this.platform.is('cordova')) {
    }
  }

  async settingModal(type: string) {
    let component: any;

    if (type == 'account') {
      component = AccountComponent;
    } else if (type == 'username') {
      component = UsernameComponent;
    } else if (type == 'password') {
      component = PasswordComponent;
    } else if (type == 'alarm') {
      component = AlarmComponent;
    } else if (type == 'bugs') {
      component = BugsComponent;
    } else if (type == 'partner') {
      component = PartnerComponent;
    } else if (type == 'certhp') {
      component = CertificationComponent;
    }

    let modal = await this.modal.create({
      component: component
    });
		await modal.present();
  }

}
