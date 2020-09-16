import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterpretersComponent } from './interpreters.component';

describe('InterpretersComponent', () => {
  let component: InterpretersComponent;
  let fixture: ComponentFixture<InterpretersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterpretersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterpretersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
