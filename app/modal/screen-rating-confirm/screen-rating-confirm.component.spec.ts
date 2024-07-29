import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScreenRatingConfirmComponent } from './screen-rating-confirm.component';

describe('ScreenRatingConfirmComponent', () => {
  let component: ScreenRatingConfirmComponent;
  let fixture: ComponentFixture<ScreenRatingConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScreenRatingConfirmComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScreenRatingConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
