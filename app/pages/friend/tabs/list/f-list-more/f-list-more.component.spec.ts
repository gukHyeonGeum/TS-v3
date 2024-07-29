import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FListMoreComponent } from './f-list-more.component';

describe('FListMoreComponent', () => {
  let component: FListMoreComponent;
  let fixture: ComponentFixture<FListMoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FListMoreComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FListMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
