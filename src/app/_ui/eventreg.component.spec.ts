import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventregComponent } from './eventreg.component';

describe('EventregComponent', () => {
  let component: EventregComponent;
  let fixture: ComponentFixture<EventregComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventregComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventregComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
