import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventregsComponent } from './eventregs.component';

describe('EventregsComponent', () => {
  let component: EventregsComponent;
  let fixture: ComponentFixture<EventregsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventregsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventregsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
