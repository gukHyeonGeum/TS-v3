import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindEmailPage } from './find-email.page';

describe('FindEmailPage', () => {
  let component: FindEmailPage;
  let fixture: ComponentFixture<FindEmailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindEmailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindEmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
