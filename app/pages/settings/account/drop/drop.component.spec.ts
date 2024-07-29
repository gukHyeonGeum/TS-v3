import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DropComponent } from './drop.component';

describe('DropComponent', () => {
  let component: DropComponent;
  let fixture: ComponentFixture<DropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
