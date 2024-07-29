import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PageListPage } from './page-list.page';

describe('PageListPage', () => {
  let component: PageListPage;
  let fixture: ComponentFixture<PageListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PageListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
