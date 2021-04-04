import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMailTemplatesComponent } from './admin-mail-templates.component';

describe('AdminMailTemplatesComponent', () => {
  let component: AdminMailTemplatesComponent;
  let fixture: ComponentFixture<AdminMailTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminMailTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMailTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
