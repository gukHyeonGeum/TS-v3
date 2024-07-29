import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScreenGiftmoneyPayComponent } from './screen-giftmoney-pay.component';

describe('ScreenGiftmoneyPayComponent', () => {
  let component: ScreenGiftmoneyPayComponent;
  let fixture: ComponentFixture<ScreenGiftmoneyPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScreenGiftmoneyPayComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScreenGiftmoneyPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
