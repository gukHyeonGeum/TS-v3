import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendPage } from './friend.page';

describe('FriendPage', () => {
  let component: FriendPage;
  let fixture: ComponentFixture<FriendPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FriendPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
