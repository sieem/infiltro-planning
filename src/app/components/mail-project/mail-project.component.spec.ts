import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailProjectComponent } from './mail-project.component';

describe('MailProjectComponent', () => {
  let component: MailProjectComponent;
  let fixture: ComponentFixture<MailProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
