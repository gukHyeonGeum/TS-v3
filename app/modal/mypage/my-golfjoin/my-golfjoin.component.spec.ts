import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGolfjoinComponent } from './my-golfjoin.component';

describe('MyGolfjoinComponent', () => {
  let component: MyGolfjoinComponent;
  let fixture: ComponentFixture<MyGolfjoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyGolfjoinComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGolfjoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
