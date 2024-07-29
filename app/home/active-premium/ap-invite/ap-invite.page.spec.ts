import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApInvitePage } from './ap-invite.page';

describe('ApInvitePage', () => {
  let component: ApInvitePage;
  let fixture: ComponentFixture<ApInvitePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApInvitePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApInvitePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
