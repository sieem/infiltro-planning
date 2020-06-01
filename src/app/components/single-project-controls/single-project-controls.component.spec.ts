import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleProjectControlsComponent } from './single-project-controls.component';

describe('SingleProjectControlsComponent', () => {
  let component: SingleProjectControlsComponent;
  let fixture: ComponentFixture<SingleProjectControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleProjectControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleProjectControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
