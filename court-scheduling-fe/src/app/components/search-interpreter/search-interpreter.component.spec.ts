import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInterpreterComponent } from './search-interpreter.component';

describe('SearchInterpreterComponent', () => {
  let component: SearchInterpreterComponent;
  let fixture: ComponentFixture<SearchInterpreterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchInterpreterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchInterpreterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
