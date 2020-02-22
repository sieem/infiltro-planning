import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleProjectCommentsComponent } from './single-project-comments.component';

describe('SingleProjectCommentsComponent', () => {
  let component: SingleProjectCommentsComponent;
  let fixture: ComponentFixture<SingleProjectCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleProjectCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleProjectCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
