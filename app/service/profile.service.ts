import { Injectable } from '@angular/core';

import { AlertService } from './alert.service';
import { CommonService } from './common.service';
import { UserService } from './user.service';
import { VerifyService } from './verify.service';

import { ProfileComponent } from '../modal/profile/profile.component';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  me: any;

  constructor(
    public commonS: CommonService,
    public verifyS: VerifyService,
    public userS: UserService,
    public alertS: AlertService
  ) { 
    this.userS.getMeInfo().then(me => {
      this.me = me;
    });
  }

  profileOpen(obj: any): Promise<any> {
    return new Promise(resolve => {
      if (obj.target === 1) {
        resolve(this.commonS.commonModal(obj, ProfileComponent));
      } else {
        this.verifyS.isCertPhone().then(() => {
          this.verifyS.isProfile().then(() => {
            resolve(this.commonS.commonModal(obj, ProfileComponent));
          }).catch(() => {});
        }).catch(() => {});
      }
    });
  }
}
