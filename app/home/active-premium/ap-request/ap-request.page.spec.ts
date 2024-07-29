import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApRequestPage } from './ap-request.page';

describe('ApRequestPage', () => {
  let component: ApRequestPage;
  let fixture: ComponentFixture<ApRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApRequestPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
