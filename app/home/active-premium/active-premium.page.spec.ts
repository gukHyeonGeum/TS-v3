import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivePremiumPage } from './active-premium.page';

describe('ActivePremiumPage', () => {
  let component: ActivePremiumPage;
  let fixture: ComponentFixture<ActivePremiumPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivePremiumPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivePremiumPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
