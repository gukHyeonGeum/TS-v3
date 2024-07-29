import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopMoreComponent } from './pop-more.component';

describe('PopMoreComponent', () => {
  let component: PopMoreComponent;
  let fixture: ComponentFixture<PopMoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopMoreComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
