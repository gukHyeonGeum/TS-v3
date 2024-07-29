import { Component, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonContent, IonSlides } from '@ionic/angular';

import { appConfig } from 'src/config';

import { GiphyFetch } from '@giphy/js-fetch-api';

const gf = new GiphyFetch(appConfig.teeshotConfig.Giphy);

@Component({
  selector: 'emoji-picker',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EmojiPickerComponent),
      multi: true
    }
  ],
  templateUrl: './emoji-picker.component.html',
  styleUrls: ['./emoji-picker.component.scss'],
})
export class EmojiPickerComponent implements ControlValueAccessor {
  @ViewChild(IonContent) contentArea: IonContent;
  @ViewChild(IonSlides, { static: true }) slides: IonSlides;

  titleArr = ['#카카오프렌즈','#펭수','#스누피','#인기','#골프','#행복해','#인사','#놀람','#감사해요','#엄지척','#웃음','#박수','#눈물','#맛점','#굿나잇','#굿바이'];
  keyArr = ['카카오프렌즈','Pengsoo','스누피','인기','golf','행복해','hi','omg','감사해요','엄지','웃음','박수','눈물','lunch','good night','good bye'];
  
  webRoot = appConfig.teeshotConfig.webRoot;

  slideOpts = {
    initialSlide: 0,
    speed: 100,
    width: window.innerWidth
  };

  segment: any = 0;
  resize: boolean = false;

  emojiArr = [];
  smiles = [];
  teetalks = [];
  teetalkAnis = [];
  giphys: any = [];
  giphysTmp: any = [];
  giphyCategory: any = '3';

  _content: string;
  _onChanged: Function = () => {};
  _onTouched: Function = () => {};

  constructor(
  ) { 
    
  }

  writeValue(obj: any) {
    this._content = obj;
  }

  registerOnChange(fn: Function): void {
    this._onChanged = fn;
    this.setValue(this._content);
  }

  registerOnTouched(fn: Function): void {
    this._onTouched = fn;
  }

  setValue(val: any) {
    if (val) {
      if (val.indexOf('animation/') >= 0) {
        let t = new Date().getTime();
        val = val + '?t=' + t;
      }
    }
    this._content = val;
    if (this._content) {
      this._onChanged(this._content);
    }
  }

  async ngOnInit() {
    this.smiles = this.emojiList();
    this.teetalks = this.teetalkList();
    this.teetalkAnis = this.teetalkAniList();
    this.giphyApi();
  }

  async segmentChanged(ev: any) {
    await this.contentArea.scrollToTop();
    await this.slides.slideTo(ev.detail.value, 100, false);
  }

  async change() {
    this.segment = await this.slides.getActiveIndex();
  }

  teetalkList() {
    const teetalk = [];
    for (let i = 1; i <= 36; i++) {
      let ext: any = 'png';
      teetalk.push(`assets/emoji/teetalk/${i}.${ext}`);
    }
    return teetalk;
  }

  teetalkAniList() {
    const teetalkAni = [];
    const ani = [];
    const ani1 = [];
    const ext: any = 'png';

    for (let i = 1; i <= 12; i++) {
      ani.push(
        { 
          thumb: `assets/emoji/teetalk/animation/1/a${i}.${ext}`, 
          original: `https://s3-ap-northeast-1.amazonaws.com/teeshot-photo/emoji/teetalk/animation/a${i}.${ext}?t`
        }
      );
    }
    teetalkAni.push(ani);

    for (let i = 1; i <= 24; i++) {
      ani1.push(
        { 
          thumb: `assets/emoji/teetalk/animation/2/a${i}.${ext}`, 
          original: `assets/emoji/teetalk/animation/2/original/a${i}.${ext}`, 
        }
      );
    }
    teetalkAni.push(ani1);
    
    return teetalkAni;
  }

  emojiList() {
    const smile = [];
    for (let i = 1; i <= 104; i++) {
      let ext: any = 'png';
      smile.push(`assets/emoji/${i}.${ext}`);
    }
    return smile;
  }

  async giphyApi() {
    const { data: gifs } = await gf.trending({ limit: 50 });
    this.giphys = gifs;
    this.giphysTmp[this.giphyCategory] = this.giphys;
  }

  async categoryChanged(ev: any) {
    await this.contentArea.scrollToTop();
    
    let index = ev.detail.value;
    let keyword = this.keyArr[index];

    if (!this.giphysTmp[index]?.length) {
      const { data: gifs } = await gf.search(keyword, { sort: 'relevant', lang: 'ko', limit: 50, type: 'gifs' });
      this.giphys = gifs;
      this.giphysTmp[index] = this.giphys;
    } else {
      this.giphys = this.giphysTmp[index];
    }
  }

}
