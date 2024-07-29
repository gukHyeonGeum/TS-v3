import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScreenMatchingNoComponent } from './screen-matching-no.component';

describe('ScreenMatchingNoComponent', () => {
  let component: ScreenMatchingNoComponent;
  let fixture: ComponentFixture<ScreenMatchingNoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScreenMatchingNoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScreenMatchingNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
