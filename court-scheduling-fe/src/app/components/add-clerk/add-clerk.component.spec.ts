import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClerkComponent } from './add-clerk.component';

describe('AddClerkComponent', () => {
  let component: AddClerkComponent;
  let fixture: ComponentFixture<AddClerkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddClerkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClerkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
