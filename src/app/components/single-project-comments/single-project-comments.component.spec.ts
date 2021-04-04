import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SingleProjectCommentsComponent } from './single-project-comments.component';

describe('SingleProjectCommentsComponent', () => {
  let component: SingleProjectCommentsComponent;
  let fixture: ComponentFixture<SingleProjectCommentsComponent>;

  beforeEach(waitForAsync(() => {
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
