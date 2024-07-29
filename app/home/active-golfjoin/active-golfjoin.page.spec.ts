import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveGolfjoinPage } from './active-golfjoin.page';

describe('ActiveGolfjoinPage', () => {
  let component: ActiveGolfjoinPage;
  let fixture: ComponentFixture<ActiveGolfjoinPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveGolfjoinPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveGolfjoinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
