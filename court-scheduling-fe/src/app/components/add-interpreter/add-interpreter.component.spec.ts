import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInterpreterComponent } from './add-interpreter.component';

describe('AddInterpreterComponent', () => {
  let component: AddInterpreterComponent;
  let fixture: ComponentFixture<AddInterpreterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInterpreterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInterpreterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
