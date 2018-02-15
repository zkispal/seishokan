import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeweventmodalComponent } from './neweventmodal.component';

describe('NeweventmodalComponent', () => {
  let component: NeweventmodalComponent;
  let fixture: ComponentFixture<NeweventmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeweventmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeweventmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
