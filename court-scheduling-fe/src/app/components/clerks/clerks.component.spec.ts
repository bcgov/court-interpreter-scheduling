import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClerksComponent } from './clerks.component';

describe('ClerksComponent', () => {
  let component: ClerksComponent;
  let fixture: ComponentFixture<ClerksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClerksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClerksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
