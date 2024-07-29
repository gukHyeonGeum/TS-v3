import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private loading: any = null;

  constructor(
    public loadingController: LoadingController
  ) { }

  async show(dur: number = 0) {
    if (!this.loading) {
      this.loading = await this.loadingController.create({
        spinner: 'lines',
        duration: dur
      });
      await this.loading.present();
    }
  }

  hide() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    } else {
      setTimeout(() => {
        if (this.loading) {
          this.loading.dismiss();
          this.loading = null;
        }
      }, 2000);
    }
  }
}
