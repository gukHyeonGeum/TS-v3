import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RefundComponent } from './refund.component';

describe('RefundComponent', () => {
  let component: RefundComponent;
  let fixture: ComponentFixture<RefundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
