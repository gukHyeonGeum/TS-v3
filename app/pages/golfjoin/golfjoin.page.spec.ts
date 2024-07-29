import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GolfjoinPage } from './golfjoin.page';

describe('GolfjoinPage', () => {
  let component: GolfjoinPage;
  let fixture: ComponentFixture<GolfjoinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GolfjoinPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GolfjoinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
