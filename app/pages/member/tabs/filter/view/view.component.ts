import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { ProfileService } from 'src/app/service/profile.service';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {

  me: any;
  lists: any;
  images = 'assets/icon/profile-none.jpg';

  constructor(
    public auth: AuthenticationService,
    public navParams: NavParams,
    public profileS: ProfileService,
    public modal2: ModalController
  ) {
    this.lists = this.navParams.get('obj');

    this.auth.getMe().then(me => {
      this.me = me;
    });
  }

  ngOnInit() {
    this.auth.fbScreen('member_filter_list');
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
      modal.onDidDismiss().then((detail: any) => {
        if (detail.data) {
          setTimeout(() => {
            this.close();
          }, 0);
        }
      });
    });
  }

  async close() {
    await this.modal2.dismiss();  
  }

}
