import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindPassPage } from './find-pass.page';

describe('FindPassPage', () => {
  let component: FindPassPage;
  let fixture: ComponentFixture<FindPassPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindPassPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindPassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
