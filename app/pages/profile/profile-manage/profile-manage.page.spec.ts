import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileManagePage } from './profile-manage.page';

describe('ProfileManagePage', () => {
  let component: ProfileManagePage;
  let fixture: ComponentFixture<ProfileManagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileManagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileManagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
