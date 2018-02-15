import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewlocmodalComponent } from './newlocmodal.component';

describe('NewlocmodalComponent', () => {
  let component: NewlocmodalComponent;
  let fixture: ComponentFixture<NewlocmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewlocmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewlocmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
