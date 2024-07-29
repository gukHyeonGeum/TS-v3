import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostModifyComponent } from './post-modify.component';

describe('PostModifyComponent', () => {
  let component: PostModifyComponent;
  let fixture: ComponentFixture<PostModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostModifyComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
