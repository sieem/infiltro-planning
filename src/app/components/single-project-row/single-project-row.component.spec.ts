import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleProjectRowComponent } from './single-project-row.component';

describe('SingleProjectRowComponent', () => {
  let component: SingleProjectRowComponent;
  let fixture: ComponentFixture<SingleProjectRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleProjectRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleProjectRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
