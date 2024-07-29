import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedPage } from './updated.page';

describe('UpdatedPage', () => {
  let component: UpdatedPage;
  let fixture: ComponentFixture<UpdatedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatedPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
