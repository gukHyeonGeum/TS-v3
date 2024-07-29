import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchClubComponent } from './search-club.component';

describe('SearchClubComponent', () => {
  let component: SearchClubComponent;
  let fixture: ComponentFixture<SearchClubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchClubComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
