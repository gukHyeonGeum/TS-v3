import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailLoginPage } from './email-login.page';

describe('EmailLoginPage', () => {
  let component: EmailLoginPage;
  let fixture: ComponentFixture<EmailLoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailLoginPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
