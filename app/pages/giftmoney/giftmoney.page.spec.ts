import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GiftmoneyPage } from './giftmoney.page';

describe('GiftmoneyPage', () => {
  let component: GiftmoneyPage;
  let fixture: ComponentFixture<GiftmoneyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftmoneyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GiftmoneyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
