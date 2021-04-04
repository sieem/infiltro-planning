import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MailTemplateSelectorComponent } from './mail-template-selector.component';

describe('MailTemplateSelectorComponent', () => {
  let component: MailTemplateSelectorComponent;
  let fixture: ComponentFixture<MailTemplateSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MailTemplateSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailTemplateSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
