import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleProjectFormComponent } from './single-project-form.component';

describe('SingleProjectFormComponent', () => {
  let component: SingleProjectFormComponent;
  let fixture: ComponentFixture<SingleProjectFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleProjectFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleProjectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
