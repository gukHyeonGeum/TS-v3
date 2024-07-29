import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopMoreJoinComponent } from './pop-more-join.component';

describe('PopMoreJoinComponent', () => {
  let component: PopMoreJoinComponent;
  let fixture: ComponentFixture<PopMoreJoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopMoreJoinComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopMoreJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
