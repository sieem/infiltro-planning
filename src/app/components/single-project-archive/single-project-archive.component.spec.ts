import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleProjectArchiveComponent } from './single-project-archive.component';

describe('SingleProjectArchiveComponent', () => {
  let component: SingleProjectArchiveComponent;
  let fixture: ComponentFixture<SingleProjectArchiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleProjectArchiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleProjectArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
