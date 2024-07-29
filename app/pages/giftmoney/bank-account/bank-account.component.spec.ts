import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BankAccountComponent } from './bank-account.component';

describe('BankAccountComponent', () => {
  let component: BankAccountComponent;
  let fixture: ComponentFixture<BankAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankAccountComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BankAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
