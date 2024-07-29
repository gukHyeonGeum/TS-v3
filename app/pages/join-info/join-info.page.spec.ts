import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinInfoPage } from './join-info.page';

describe('JoinInfoPage', () => {
  let component: JoinInfoPage;
  let fixture: ComponentFixture<JoinInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinInfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
