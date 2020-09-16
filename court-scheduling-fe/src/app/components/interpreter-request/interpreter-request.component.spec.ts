import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterpreterRequestComponent } from './interpreter-request.component';

describe('InterpreterRequestComponent', () => {
  let component: InterpreterRequestComponent;
  let fixture: ComponentFixture<InterpreterRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterpreterRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterpreterRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
