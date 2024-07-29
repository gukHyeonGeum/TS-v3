import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BugsComponent } from './bugs.component';

describe('BugsComponent', () => {
  let component: BugsComponent;
  let fixture: ComponentFixture<BugsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BugsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BugsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
